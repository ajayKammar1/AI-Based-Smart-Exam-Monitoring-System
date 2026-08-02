import os
import cv2
from datetime import datetime


class UnknownFaceHandler:

    def __init__(self):
        self.save_dir = "storage/unknown_faces"
        os.makedirs(self.save_dir, exist_ok=True)

    def save(self, frame, bbox):

        x1, y1, x2, y2 = map(int, bbox)

        face = frame[y1:y2, x1:x2]

        if face.size == 0:
            return

        filename = datetime.now().strftime("%Y%m%d_%H%M%S_%f") + ".jpg"

        path = os.path.join(self.save_dir, filename)

        cv2.imwrite(path, face)

        return path