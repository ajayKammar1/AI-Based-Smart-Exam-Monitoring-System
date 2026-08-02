import numpy as np

from .config import SIMILARITY_THRESHOLD


class FaceMatcher:

    def cosine_similarity(self, a, b):

        a = a / np.linalg.norm(a)

        b = b / np.linalg.norm(b)

        return np.dot(a, b)

    def match(self, embedding, database):

        best_name = "Unknown"
        best_score = 0

        for name, db_embedding in database.items():

            score = self.cosine_similarity(
                embedding,
                db_embedding
            )

            if score > best_score:

                best_score = score
                best_name = name

        if best_score < SIMILARITY_THRESHOLD:

            best_name = "Unknown"

        return best_name, float(best_score)