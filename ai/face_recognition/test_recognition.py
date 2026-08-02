import cv2

from ai.camera.camera_manager import CameraManager
from ai.face_detection.detector import FaceDetector
from ai.face_recognition.recognizer import FaceRecognizer
from ai.face_recognition.unknown_face_handler import UnknownFaceHandler

camera = CameraManager()
detector = FaceDetector()
recognizer = FaceRecognizer()
unknown_handler = UnknownFaceHandler()

while True:

    frame = camera.get_frame()

    if frame is None:
        break

    faces = detector.detect(frame)

    results = recognizer.recognize(faces)

    for person in results:

        x1, y1, x2, y2 = person["bbox"]

        # Set color based on recognition result
        if person["name"] == "Unknown":

            # Save unknown face
            unknown_handler.save(frame, (x1, y1, x2, y2))

            color = (0, 0, 255)      # Red

        else:

            color = (0, 255, 0)      # Green

        # Draw bounding box
        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            color,
            2
        )

        # Draw name and confidence
        cv2.putText(
            frame,
            f'{person["name"]} ({person["score"]:.2f})',
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            color,
            2
        )

    cv2.imshow("Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.stop()
cv2.destroyAllWindows()