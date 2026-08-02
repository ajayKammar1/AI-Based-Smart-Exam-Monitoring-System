from insightface.app import FaceAnalysis
from .config import MODEL_NAME, DETECTION_SIZE


class FaceDetector:

    def __init__(self):

        self.app = FaceAnalysis(name=MODEL_NAME)

        self.app.prepare(
            ctx_id=0,
            det_size=DETECTION_SIZE
        )

    def detect(self, frame):

        return self.app.get(frame)