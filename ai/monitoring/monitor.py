import cv2
import time
import logging
import numpy as np
from datetime import datetime
from typing import Dict, Any, List

from ai.camera import CameraManager
from ai.face_detection import FaceDetector
from ai.face_recognition import FaceRecognizer
from ai.tracking import FaceTracker
from ai.head_pose import HeadPoseDetector
from ai.hand_detection import HandDetector

from .suspicion_engine import SuspicionEngine
from .event_manager import EventManager
from .websocket_client import WebSocketClient

from backend.database.mongodb import connect_db, close_db
from backend.services.exam_service import ExamService
from backend.services.monitoring_service import MonitoringService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def get_active_exam():
    # Deprecated for automatic polling, but kept for potential utility
    try:
        exams = ExamService.get_all()
        current_date = datetime.now().strftime("%Y-%m-%d")
        current_time = datetime.now().strftime("%H:%M")
        
        for exam in exams:
            if exam.get('exam_date') == current_date:
                start_time = exam.get('start_time', '00:00')
                end_time = exam.get('end_time', '23:59')
                
                # Check if exam spans past midnight
                if end_time < start_time:
                    # Active if it's after start_time OR before end_time (next day)
                    if current_time >= start_time or current_time <= end_time:
                        return exam
                else:
                    # Normal case
                    if start_time <= current_time <= end_time:
                        return exam
    except Exception as e:
        logger.error(f"Error fetching active exams: {e}")
    return None


class ExamMonitor:
    def __init__(self):
        self.exam_id = None
        self.hall_id = None
        
        self.camera = None
        self.face_detector = None
        self.face_recognizer = None
        self.tracker = None
        self.head_pose_estimator = None
        self.hand_detector = None
        self.suspicion_engine = None
        
        self.ws = WebSocketClient()
        self.ws.start()
        
        self.is_running = False
        self.latest_frame_bytes = None
        self.stop_event = False
        self.marked_attendance = set()

    def init_components(self, exam_id: str, hall_id: str):
        logger.info(f"Initializing Monitor Components for Exam: {exam_id}, Hall: {hall_id}...")
        self.exam_id = exam_id
        self.hall_id = hall_id
        
        self.camera = CameraManager()
        self.face_detector = FaceDetector()
        self.face_recognizer = FaceRecognizer()
        self.tracker = FaceTracker()
        self.head_pose_estimator = HeadPoseDetector()
        self.hand_detector = HandDetector()
        
        self.suspicion_engine = SuspicionEngine()
        self.is_running = True
        logger.info("Monitor Initialization Complete.")

    def release_components(self):
        if self.is_running:
            logger.info("Releasing Monitor Components...")
            if self.camera:
                self.camera.stop()
            cv2.destroyAllWindows()
            self.is_running = False
            self.exam_id = None
            self.hall_id = None
            self.marked_attendance.clear()

    def start_monitoring(self, exam_id: str, hall_id: str):
        if self.is_running:
            self.release_components()
        self.init_components(exam_id, hall_id)

    def stop_monitoring(self):
        self.release_components()

    def run(self):
        logger.info("Starting Main Monitoring Loop...")
        frame_count = 0
        start_time = time.time()
        fps = 0.0

        while True:
            current_loop_time = time.time()

            if not self.is_running:
                # Show waiting screen when no exam is active
                blank_frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(blank_frame, "Waiting for an active exam...", (100, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                cv2.putText(blank_frame, f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", (100, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
                # Encode waiting screen to JPEG
                ret, buffer = cv2.imencode('.jpg', blank_frame)
                if ret:
                    self.latest_frame_bytes = buffer.tobytes()
                
                if self.stop_event:
                    logger.info("Exiting...")
                    break
                time.sleep(1)
                continue

            frame = self.camera.get_frame()
            if frame is None:
                # Show camera error screen
                error_frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(error_frame, "Camera Offline or In Use", (100, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
                cv2.putText(error_frame, "Please check camera permissions", (100, 280), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)
                ret, buffer = cv2.imencode('.jpg', error_frame)
                if ret:
                    self.latest_frame_bytes = buffer.tobytes()
                    
                time.sleep(0.1)
                continue

            frame_count += 1
            elapsed_time = current_loop_time - start_time
            if elapsed_time >= 1.0:
                fps = frame_count / elapsed_time
                frame_count = 0
                start_time = current_loop_time

            try:
                detected_faces = self.face_detector.detect(frame)
                recognized_faces = self.face_recognizer.recognize(detected_faces)
                tracks = self.tracker.update(recognized_faces, frame)
                hand_results = self.hand_detector.detect(frame)

                total_faces = len(tracks)
                recognized_students_count = 0
                unknown_students_count = 0

                for track in tracks:
                    if not track.is_confirmed():
                        continue

                    track_id = track.track_id
                    bbox = track.to_ltrb()
                    x1, y1, x2, y2 = map(int, bbox)
                    
                    # Match track with recognized face based on bounding box proximity
                    student_name = "Unknown"
                    student_id = "UNKNOWN"
                    confidence = 0.0
                    
                    for face in recognized_faces:
                        fx1, fy1, fx2, fy2 = face["bbox"]
                        if abs(x1 - fx1) < 50 and abs(y1 - fy1) < 50:
                            matched_val = face.get("name", "Unknown")
                            if matched_val != "Unknown":
                                student_id = matched_val
                                student_name = matched_val  # Video stream will display student ID, UI handles real name
                            confidence = face.get("score", 0.0)
                            break

                    def log_if_added(event_type):
                        s_score, added = self.suspicion_engine.add_event(track_id, event_type)
                        if added:
                            MonitoringService.save_event({
                                "exam_id": self.exam_id,
                                "student_id": student_id,
                                "tracking_id": track_id,
                                "event_type": event_type,
                                "confidence": confidence,
                                "details": {"score": s_score}
                            })

                    if student_name == "Unknown":
                        unknown_students_count += 1
                        log_if_added("UNKNOWN_FACE")
                        
                        # Capture and log unknown person in attendance
                        unknown_id = f"UNKNOWN_{track_id}"
                        if unknown_id not in self.marked_attendance:
                            try:
                                import os
                                h, w = frame.shape[:2]
                                cy1, cy2 = max(0, int(y1)), min(h, int(y2))
                                cx1, cx2 = max(0, int(x1)), min(w, int(x2))
                                face_crop = frame[cy1:cy2, cx1:cx2]
                                
                                if face_crop.size > 0:
                                    os.makedirs("storage/events", exist_ok=True)
                                    cv2.imwrite(f"storage/events/{unknown_id}.jpg", face_crop)
                                
                                from backend.models.attendance import AttendanceCreate
                                from backend.services.attendance_service import AttendanceService
                                logger.info(f"Marking attendance for Unknown Person: {unknown_id}")
                                AttendanceService.mark_attendance(AttendanceCreate(
                                    exam_id=self.exam_id,
                                    student_id=unknown_id,
                                    hall_id=self.hall_id,
                                    status="Unknown Person"
                                ))
                                self.marked_attendance.add(unknown_id)
                            except Exception as e:
                                logger.error(f"Failed to log unknown person {unknown_id}: {e}", exc_info=True)
                    else:
                        recognized_students_count += 1
                        # Track Attendance Automatically
                        if student_id not in self.marked_attendance:
                            try:
                                from backend.models.attendance import AttendanceCreate
                                from backend.services.attendance_service import AttendanceService
                                logger.info(f"Marking attendance for {student_id} in {self.exam_id}")
                                AttendanceService.mark_attendance(AttendanceCreate(
                                    exam_id=self.exam_id,
                                    student_id=student_id,
                                    hall_id=self.hall_id,
                                    status="Present"
                                ))
                                self.marked_attendance.add(student_id)
                                logger.info(f"Successfully marked attendance for {student_id}")
                            except Exception as e:
                                logger.error(f"Failed to mark attendance for {student_id}: {e}", exc_info=True)

                    # Head Pose
                    head_pose = "STRAIGHT"
                    for d_face in detected_faces:
                        dx1, dy1, dx2, dy2 = d_face.bbox
                        if abs(x1 - dx1) < 50 and abs(y1 - dy1) < 50:
                            pose_data = self.head_pose_estimator.get_pose(d_face)
                            if pose_data:
                                head_pose = pose_data.get("direction", "STRAIGHT")
                            break

                    if head_pose in ["LEFT", "RIGHT", "UP", "DOWN"]:
                        log_if_added(f"LOOK_{head_pose}")

                    # Hand Detection
                    hand_near_face = hand_results.get("near_face", False)
                    hand_above_shoulder = hand_results.get("hand_above_shoulder", False)
                    hands_missing = hand_results.get("hands_missing", False)
                    
                    if hand_near_face:
                        log_if_added("HAND_NEAR_FACE")
                    if hand_above_shoulder:
                        log_if_added("HAND_ABOVE_SHOULDER")
                    if hands_missing:
                        log_if_added("HANDS_MISSING")

                    suspicion_score = self.suspicion_engine.get_score(track_id)

                    event = EventManager.create_event(
                        exam_id=self.exam_id,
                        hall_id=self.hall_id,
                        student_id=student_id,
                        tracking_id=track_id,
                        student_name=student_name,
                        event_type="MONITORING_UPDATE",
                        confidence=confidence,
                        suspicion_score=suspicion_score,
                        head_pose=head_pose,
                        hand_near_face=hand_near_face,
                        hand_above_shoulder=hand_above_shoulder,
                        hands_missing=hands_missing,
                        unknown_face=(student_name == "Unknown")
                    )

                    self.ws.send_event(event)

                    # Drawing
                    color = (0, 255, 0) if student_name != "Unknown" else (0, 0, 255)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    
                    label_y = y1 - 10 if y1 - 10 > 10 else y1 + 10
                    cv2.putText(frame, f"{student_name} ID: {track_id}", (x1, label_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    cv2.putText(frame, f"Conf: {confidence:.2f} Score: {suspicion_score}", (x1, label_y - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    cv2.putText(frame, f"Pose: {head_pose}", (x1, y2 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                    
                    hand_status = "Hands OK"
                    if hand_near_face: hand_status = "Hand near face!"
                    elif hands_missing: hand_status = "Hands missing!"
                    cv2.putText(frame, hand_status, (x1, y2 + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

                # Display Stats
                cv2.putText(frame, f"Exam: {self.exam_id} | Hall: {self.hall_id}", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
                cv2.putText(frame, f"FPS: {fps:.1f}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                cv2.putText(frame, f"Total Faces: {total_faces}", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
                cv2.putText(frame, f"Recognized: {recognized_students_count}", (20, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                cv2.putText(frame, f"Unknown: {unknown_students_count}", (20, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                cv2.putText(frame, f"Time: {time.strftime('%H:%M:%S')}", (20, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            except Exception as e:
                import traceback
                error_msg = str(e)
                logger.error(f"Error in monitor loop: {error_msg}")
                logger.error(traceback.format_exc())
                cv2.putText(frame, f"AI Error: {error_msg}", (20, 220), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            # Encode frame to JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            if ret:
                self.latest_frame_bytes = buffer.tobytes()

            if self.stop_event:
                logger.info("Exiting...")
                break
            
            # Tiny sleep to yield thread
            time.sleep(0.01)

        self.cleanup()

    def cleanup(self):
        self.release_components()

# Global instance to be used by FastAPI
monitor_instance = ExamMonitor()
