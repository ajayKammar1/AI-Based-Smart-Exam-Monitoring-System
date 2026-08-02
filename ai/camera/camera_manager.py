from .camera import Camera


class CameraManager:
    def __init__(self):
        self.camera = Camera()

    def get_frame(self):
        success, frame = self.camera.read()

        if not success:
            return None

        return frame

    def stop(self):
        self.camera.release()