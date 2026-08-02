import cv2

from ai.camera.camera_manager import CameraManager
from .detector import FaceDetector
from .draw import draw_faces


def main():

    camera = CameraManager()

    detector = FaceDetector()

    while True:

        frame = camera.get_frame()

        if frame is None:
            break

        faces = detector.detect(frame)

        frame = draw_faces(frame, faces)

        cv2.imshow("Face Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    camera.stop()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()