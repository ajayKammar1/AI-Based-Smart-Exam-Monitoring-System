import cv2

from .camera_manager import CameraManager


def main():
    camera = CameraManager()

    while True:
        frame = camera.get_frame()

        if frame is None:
            print("Failed to read frame.")
            break

        cv2.imshow("Smart Exam Monitoring Camera", frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord("q"):
            break

    camera.stop()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()