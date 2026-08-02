import cv2

from ai.camera.camera_manager import CameraManager
from ai.face_detection.detector import FaceDetector
from ai.face_recognition.recognizer import FaceRecognizer
from ai.face_recognition.unknown_face_handler import UnknownFaceHandler

from ai.tracking.tracker import FaceTracker
from ai.tracking.draw import draw_tracks


camera = CameraManager()
detector = FaceDetector()
recognizer = FaceRecognizer()
tracker = FaceTracker()
unknown_handler = UnknownFaceHandler()


while True:

    frame = camera.get_frame()

    if frame is None:
        break

    # Detect faces
    faces = detector.detect(frame)

    # Recognize faces
    results = recognizer.recognize(faces)

    # Save unknown faces and set colors
    for person in results:

        x1, y1, x2, y2 = person["bbox"]

        if person["name"] == "Unknown":
            unknown_handler.save(frame, (x1, y1, x2, y2))
            person["color"] = (0, 0, 255)      # Red
        else:
            person["color"] = (0, 255, 0)      # Green

    # Update tracker
    tracks = tracker.update(results, frame)

    # Draw tracker IDs
    draw_tracks(frame, tracks)

    # Draw recognition results
    for person in results:

        x1, y1, x2, y2 = person["bbox"]

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            person["color"],
            2
        )

        cv2.putText(
            frame,
            f'{person["name"]} ({person["score"]:.2f})',
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            person["color"],
            2
        )

    cv2.imshow("Face Tracking", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


camera.stop()
cv2.destroyAllWindows()