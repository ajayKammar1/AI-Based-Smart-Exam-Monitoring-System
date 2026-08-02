import cv2
import mediapipe as mp

mp_draw = mp.solutions.drawing_utils
mp_hands = mp.solutions.hands


def draw_hands(frame, data):

    results = data["results"]

    # -----------------------------
    # Draw Hand Landmarks
    # -----------------------------
    if results.multi_hand_landmarks:

        for hand in results.multi_hand_landmarks:

            mp_draw.draw_landmarks(
                frame,
                hand,
                mp_hands.HAND_CONNECTIONS,
                mp_draw.DrawingSpec(
                    color=(0, 255, 0),
                    thickness=2,
                    circle_radius=2
                ),
                mp_draw.DrawingSpec(
                    color=(255, 0, 0),
                    thickness=2
                )
            )

    # -----------------------------
    # Display Information
    # -----------------------------
    y = 30
    gap = 30

    cv2.putText(
        frame,
        f'Hands : {data["hand_count"]}',
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )

    y += gap

    cv2.putText(
        frame,
        f'Left : {"Yes" if data["left_hand"] else "No"}',
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 0),
        2
    )

    y += gap

    cv2.putText(
        frame,
        f'Right : {"Yes" if data["right_hand"] else "No"}',
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 0),
        2
    )

    y += gap

    cv2.putText(
        frame,
        f'Movement : {data["movement"]:.1f}px',
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2
    )

    y += gap

    if data["fast_movement"]:

        cv2.putText(
            frame,
            "FAST HAND MOVEMENT",
            (20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2
        )

    else:

        cv2.putText(
            frame,
            "Movement : Normal",
            (20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    y += gap

    if data["near_face"]:

        cv2.putText(
            frame,
            "HAND NEAR FACE",
            (20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2
        )

    else:

        cv2.putText(
            frame,
            "Near Face : No",
            (20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2
        )

    y += gap

    cv2.putText(
        frame,
        f'Missing Time : {data["missing_time"]:.1f}s',
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (255, 255, 255),
        2
    )

    y += gap

    if data["hands_missing"]:

        status = "WARNING - HANDS NOT DETECTED"
        color = (0, 0, 255)

    elif data["near_face"]:

        status = "WARNING - HAND NEAR FACE"
        color = (0, 165, 255)

    elif data["fast_movement"]:

        status = "WARNING - FAST HAND MOVEMENT"
        color = (0, 165, 255)

    else:

        status = "STATUS : NORMAL"
        color = (0, 255, 0)

    cv2.putText(
        frame,
        status,
        (20, y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        color,
        2
    )

    return frame