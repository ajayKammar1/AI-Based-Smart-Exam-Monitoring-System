import cv2
import time
import logging
from typing import Dict, Any, List

from ai.camera import CameraManager
from ai.face_detection import FaceDetector
from ai.face_recognition import FaceRecognizer
from ai.tracking import FaceTracker
from ai.head_pose import HeadPoseEstimator
from ai.hand_detection import HandDetector

from .suspicion_engine import SuspicionEngine
from .event_manager import EventManager
from .websocket_client import WebSocketClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

class ExamMonitor:
    def __init__(self, exam_id: str = "EXAM001", hall_id: str = "HALL001"):
        self.exam_id = exam_id
        self.hall_id = hall_id
        
        logger.info("Initializing Monitor Components...")
        self.camera = CameraManager()
        self.face_detector = FaceDetector()
        self.face_recognizer = FaceRecognizer()
        self.tracker = FaceTracker()
        self.head_pose_estimator = HeadPoseEstimator()
        self.hand_detector = HandDetector()
        
        self.suspicion_engine = SuspicionEngine()
        self.ws = WebSocketClient()
        self.ws.start()
        
        logger.info("Monitor Initialization Complete.")

    def run(self):
        logger.info("Starting Main Monitoring Loop...")
        frame_count = 0
        start_time = time.time()
        fps = 0.0

        while True:
            frame = self.camera.get_frame()
            if frame is None:
                continue

            frame_count += 1
            current_time = time.time()
            elapsed_time = current_time - start_time
            if elapsed_time >= 1.0:
                fps = frame_count / elapsed_time
                frame_count = 0
                start_time = current_time

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
                    # Simple center matching or overlap logic can be placed here
                    # Assuming recognized_faces is aligned or passed through tracking
                    if abs(x1 - fx1) < 50 and abs(y1 - fy1) < 50:
                        student_name = face.get("name", "Unknown")
                        student_id = face.get("student_id", "UNKNOWN")
                        confidence = face.get("score", 0.0)
                        break

                if student_name == "Unknown":
                    unknown_students_count += 1
                    self.suspicion_engine.add_event(track_id, "UNKNOWN_FACE")
                else:
                    recognized_students_count += 1

                # Head Pose
                head_pose = self.head_pose_estimator.estimate(frame, [x1, y1, x2, y2])
                if head_pose in ["LEFT", "RIGHT", "UP", "DOWN"]:
                    self.suspicion_engine.add_event(track_id, f"LOOK_{head_pose}")

                # Hand Detection
                hand_near_face = hand_results.get("near_face", False)
                hand_above_shoulder = hand_results.get("hand_above_shoulder", False)
                hands_missing = hand_results.get("hands_missing", False)
                
                if hand_near_face:
                    self.suspicion_engine.add_event(track_id, "HAND_NEAR_FACE")
                if hand_above_shoulder:
                    self.suspicion_engine.add_event(track_id, "HAND_ABOVE_SHOULDER")
                if hands_missing:
                    self.suspicion_engine.add_event(track_id, "HANDS_MISSING")

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
            cv2.putText(frame, f"FPS: {fps:.1f}", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Total Faces: {total_faces}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Recognized: {recognized_students_count}", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, f"Unknown: {unknown_students_count}", (20, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, f"Time: {time.strftime('%H:%M:%S')}", (20, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            cv2.imshow("Monitoring System", frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                logger.info("Exiting...")
                break

        self.cleanup()

    def cleanup(self):
        logger.info("Releasing resources...")
        self.camera.stop()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    monitor = ExamMonitor()
    try:
        monitor.run()
    except KeyboardInterrupt:
        monitor.cleanup()
