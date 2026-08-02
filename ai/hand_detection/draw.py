import cv2
import mediapipe as mp

mp_draw = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands


def draw_hands(frame, data):

    results = data["results"]

    # Draw hand landmarks
    if results.multi_hand_landmarks:

        for hand in results.multi_hand_landmarks:

            mp_draw.draw_landmarks(
                frame,
                hand,
                mp_hands.HAND_CONNECTIONS,
                mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                mp_draw.DrawingSpec(color=(255, 0, 0), thickness=2)
            )

    # Hand Count
    cv2.putText(
        frame,
        f'Hands : {data["hand_count"]}',
        (20, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )

    # Left Hand
    cv2.putText(
        frame,
        f'Left : {"Yes" if data["left_hand"] else "No"}',
        (20, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 0),
        2
    )

    # Right Hand
    cv2.putText(
        frame,
        f'Right : {"Yes" if data["right_hand"] else "No"}',
        (20, 90),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 0),
        2
    )

    # Hand Near Face Status
    if data.get("near_face", False):

        cv2.putText(
            frame,
            "HAND NEAR FACE",
            (20, 130),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 0, 255),
            2
        )

    else:

        cv2.putText(
            frame,
            "NORMAL",
            (20, 130),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (0, 255, 0),
            2
        )

    return frame