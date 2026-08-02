import os
import numpy as np
import cv2

from insightface.app import FaceAnalysis


class EmbeddingService:

    MODEL = None

    @staticmethod
    def load_model():

        if EmbeddingService.MODEL is None:

            app = FaceAnalysis(
                name="buffalo_l"
            )

            app.prepare(
                ctx_id=0,
                det_size=(640,640)
            )

            EmbeddingService.MODEL = app

        return EmbeddingService.MODEL


    @staticmethod
    def generate(student_id):

        image_path = (
            f"storage/known_faces/"
            f"{student_id}/image.jpg"
        )

        save_path = (
            f"storage/known_faces/"
            f"{student_id}/embedding.npy"
        )


        if not os.path.exists(image_path):

            return {
                "success":False,
                "message":"Student image not found"
            }


        model = EmbeddingService.load_model()


        image = cv2.imread(image_path)


        faces = model.get(image)


        if len(faces)==0:

            return {
                "success":False,
                "message":"No face detected"
            }


        embedding = faces[0].embedding


        os.makedirs(
            os.path.dirname(save_path),
            exist_ok=True
        )


        np.save(
            save_path,
            embedding
        )


        return {
            "success":True,
            "embedding_path":save_path
        }