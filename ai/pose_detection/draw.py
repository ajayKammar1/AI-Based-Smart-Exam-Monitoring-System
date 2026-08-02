import cv2
import mediapipe as mp

mp_draw = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose


def draw_pose(frame, data):

    results = data["results"]

    if results.pose_landmarks:

        mp_draw.draw_landmarks(
            frame,
            results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            mp_draw.DrawingSpec(
                color=(0,255,0),
                thickness=2,
                circle_radius=2
            ),
            mp_draw.DrawingSpec(
                color=(255,0,0),
                thickness=2
            )
        )

    y = 30

    cv2.putText(
        frame,
        f'Pose : {"Detected" if data["pose_detected"] else "Not Detected"}',
        (20,y),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0,255,0),
        2
    )

    y += 30

    if data["left_shoulder"]:

        cv2.putText(
            frame,
            f'Left Shoulder : {data["left_shoulder"]}',
            (20,y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255,255,255),
            2
        )

    y += 30

    if data["right_shoulder"]:

        cv2.putText(
            frame,
            f'Right Shoulder : {data["right_shoulder"]}',
            (20,y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255,255,255),
            2
        )

    return frame