import cv2


def draw_head_pose(frame, bbox, pose):

    x1, y1, x2, y2 = map(int, bbox)

    cv2.putText(
        frame,
        f"Yaw   : {pose['yaw']:.1f}",
        (x1, y2 + 20),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 0),
        2
    )

    cv2.putText(
        frame,
        f"Pitch : {pose['pitch']:.1f}",
        (x1, y2 + 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 0),
        2
    )

    cv2.putText(
        frame,
        f"Roll  : {pose['roll']:.1f}",
        (x1, y2 + 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 0),
        2
    )

    color = (0, 255, 0)

    if pose["direction"] != "STRAIGHT":
        color = (0, 0, 255)

    cv2.putText(
        frame,
        pose["direction"],
        (x1, y1 - 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.8,
        color,
        2
    )

    return frame