import cv2
import mediapipe as mp
import math
import time

from .config import (
    MAX_NUM_HANDS,
    MIN_DETECTION_CONFIDENCE,
    MIN_TRACKING_CONFIDENCE,
    MOVEMENT_THRESHOLD,
    MISSING_TIME_THRESHOLD,
    FACE_MARGIN
)


class HandDetector:

    def __init__(self):

        self.mp_hands = mp.solutions.hands

        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=MAX_NUM_HANDS,
            min_detection_confidence=MIN_DETECTION_CONFIDENCE,
            min_tracking_confidence=MIN_TRACKING_CONFIDENCE
        )

        self.previous_wrist = None
        self.hand_missing_start = None

    def detect(self, frame, faces=None):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.hands.process(rgb)

        hand_count = 0
        left_hand = False
        right_hand = False

        near_face = False
        movement = 0
        fast_movement = False

        frame_h, frame_w = frame.shape[:2]

        # -----------------------------
        # Detect Hands
        # -----------------------------
        if results.multi_hand_landmarks:

            hand_count = len(results.multi_hand_landmarks)

            # Reset missing timer
            self.hand_missing_start = None

            if results.multi_handedness:

                for hand in results.multi_handedness:

                    label = hand.classification[0].label

                    if label == "Left":
                        left_hand = True

                    elif label == "Right":
                        right_hand = True

            # Use first detected hand
            hand_landmarks = results.multi_hand_landmarks[0]

            wrist = hand_landmarks.landmark[0]

            wrist_x = int(wrist.x * frame_w)
            wrist_y = int(wrist.y * frame_h)

            # -----------------------------
            # Hand Movement
            # -----------------------------
            if self.previous_wrist is not None:

                movement = math.sqrt(
                    (wrist_x - self.previous_wrist[0]) ** 2 +
                    (wrist_y - self.previous_wrist[1]) ** 2
                )

                if movement > MOVEMENT_THRESHOLD:
                    fast_movement = True

            self.previous_wrist = (wrist_x, wrist_y)

            # -----------------------------
            # Hand Near Face
            # -----------------------------
            if faces:

                face = faces[0]

                x1, y1, x2, y2 = map(int, face.bbox)

                if (
                    x1 - FACE_MARGIN <= wrist_x <= x2 + FACE_MARGIN and
                    y1 - FACE_MARGIN <= wrist_y <= y2 + FACE_MARGIN
                ):
                    near_face = True

        # -----------------------------
        # Hands Missing Timer
        # -----------------------------
        else:

            self.previous_wrist = None

            if self.hand_missing_start is None:
                self.hand_missing_start = time.time()

        missing_time = 0

        if self.hand_missing_start is not None:
            missing_time = time.time() - self.hand_missing_start

        hands_missing = missing_time >= MISSING_TIME_THRESHOLD

        # -----------------------------
        # Return
        # -----------------------------
        return {

            "results": results,

            "hand_count": hand_count,

            "left_hand": left_hand,

            "right_hand": right_hand,

            "movement": round(movement, 2),

            "fast_movement": fast_movement,

            "near_face": near_face,

            "missing_time": round(missing_time, 2),

            "hands_missing": hands_missing
        }