import cv2
import mediapipe as mp

from .config import (
    MAX_NUM_HANDS,
    MIN_DETECTION_CONFIDENCE,
    MIN_TRACKING_CONFIDENCE
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

    def detect(self, frame):

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = self.hands.process(rgb)

        hand_count = 0
        left_hand = False
        right_hand = False
        near_face = False

        if results.multi_hand_landmarks:

            hand_count = len(results.multi_hand_landmarks)

            if results.multi_handedness:

                for hand in results.multi_handedness:

                    label = hand.classification[0].label

                    if label == "Left":
                        left_hand = True

                    elif label == "Right":
                        right_hand = True

        return {
            "results": results,
            "hand_count": hand_count,
            "left_hand": left_hand,
            "right_hand": right_hand,
            "near_face": near_face
        }