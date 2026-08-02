import os
import cv2
import numpy as np

from ai.camera.camera_manager import CameraManager
from ai.face_detection.detector import FaceDetector


class FaceRegistration:

    def __init__(self):
        self.camera = CameraManager()
        self.detector = FaceDetector()

    def register(self, person_name):

        save_dir = os.path.join("storage", "known_faces", person_name)
        os.makedirs(save_dir, exist_ok=True)

        print("Press 'S' to save the face")
        print("Press 'Q' to quit")

        while True:

            frame = self.camera.get_frame()

            if frame is None:
                break

            faces = self.detector.detect(frame)

            for face in faces:

                x1, y1, x2, y2 = map(int, face.bbox)

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0,255,0), 2)

            cv2.imshow("Face Registration", frame)

            key = cv2.waitKey(1) & 0xFF

            if key == ord("q"):
                break

            if key == ord("s"):

                if len(faces) != 1:
                    print("Exactly one face must be visible.")
                    continue

                face = faces[0]

                cv2.imwrite(
                    os.path.join(save_dir, "face.jpg"),
                    frame
                )

                np.save(
                    os.path.join(save_dir, "embedding.npy"),
                    face.embedding
                )

                print(f"{person_name} registered successfully.")
                break

        self.camera.stop()
        cv2.destroyAllWindows()