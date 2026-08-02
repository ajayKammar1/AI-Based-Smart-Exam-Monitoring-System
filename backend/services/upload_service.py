import os
import shutil


class UploadService:

    BASE_FOLDER = "storage/known_faces"

    @staticmethod
    def save_student_photo(student_id: str, file):

        student_folder = os.path.join(
            UploadService.BASE_FOLDER,
            student_id
        )

        os.makedirs(student_folder, exist_ok=True)

        extension = os.path.splitext(file.filename)[1]

        if extension == "":
            extension = ".jpg"

        file_path = os.path.join(
            student_folder,
            f"image{extension}"
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return file_path.replace("\\", "/")