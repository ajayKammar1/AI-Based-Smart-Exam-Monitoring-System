import os
import numpy as np

from .config import KNOWN_FACE_DIR


class EmbeddingLoader:

    def load(self):

        database = {}

        if not os.path.exists(KNOWN_FACE_DIR):
            return database

        for person in os.listdir(KNOWN_FACE_DIR):

            path = os.path.join(
                KNOWN_FACE_DIR,
                person,
                "embedding.npy"
            )

            if os.path.exists(path):

                database[person] = np.load(path)

        return database