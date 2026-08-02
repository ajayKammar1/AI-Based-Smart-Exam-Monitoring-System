from .embedding_loader import EmbeddingLoader
from .matcher import FaceMatcher


class FaceRecognizer:

    def __init__(self):

        self.database = EmbeddingLoader().load()

        self.matcher = FaceMatcher()

    def recognize(self, faces):

        results = []

        for face in faces:

            name, score = self.matcher.match(
                face.embedding,
                self.database
            )

            results.append({

                "name": name,
                "score": score,
                "bbox": face.bbox.astype(int).tolist()

            })

        return results