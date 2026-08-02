import cv2


class Camera:
    def __init__(self, camera_index=0, width=1280, height=720):
        self.cap = cv2.VideoCapture(camera_index)

        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

        if not self.cap.isOpened():
            raise RuntimeError("Failed to open camera.")

    def read(self):
        return self.cap.read()

    def release(self):
        if self.cap.isOpened():
            self.cap.release()