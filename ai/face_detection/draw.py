import cv2


def draw_faces(frame, faces):

    for face in faces:

        x1, y1, x2, y2 = map(int, face.bbox)

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        confidence = getattr(face, "det_score", 0)

        cv2.putText(
            frame,
            f"{confidence:.2f}",
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0,255,0),
            2
        )

        if hasattr(face, "kps"):

            for point in face.kps:

                cv2.circle(
                    frame,
                    tuple(map(int, point)),
                    2,
                    (0,0,255),
                    -1
                )

    return frame