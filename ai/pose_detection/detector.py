import cv2
import mediapipe as mp

from .config import (
    MIN_DETECTION_CONFIDENCE,
    MIN_TRACKING_CONFIDENCE
)


class PoseDetector:

    def __init__(self):

        self.mp_pose = mp.solutions.pose

        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=MIN_DETECTION_CONFIDENCE,
            min_tracking_confidence=MIN_TRACKING_CONFIDENCE
        )

    def detect(self, frame):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.pose.process(rgb)

        pose_detected = results.pose_landmarks is not None

        left_shoulder = None
        right_shoulder = None
        left_wrist = None
        right_wrist = None

        if pose_detected:

            landmarks = results.pose_landmarks.landmark

            h, w = frame.shape[:2]

            left_shoulder = (
                int(landmarks[11].x * w),
                int(landmarks[11].y * h)
            )

            right_shoulder = (
                int(landmarks[12].x * w),
                int(landmarks[12].y * h)
            )

            left_wrist = (
                int(landmarks[15].x * w),
                int(landmarks[15].y * h)
            )

            right_wrist = (
                int(landmarks[16].x * w),
                int(landmarks[16].y * h)
            )

        return {
            "results": results,
            "pose_detected": pose_detected,
            "left_shoulder": left_shoulder,
            "right_shoulder": right_shoulder,
            "left_wrist": left_wrist,
            "right_wrist": right_wrist
        }