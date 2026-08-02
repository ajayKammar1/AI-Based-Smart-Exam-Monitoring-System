import cv2

from ai.camera.camera_manager import CameraManager
from ai.hand_detection.detector import HandDetector
from ai.hand_detection.draw import draw_hands

camera = CameraManager()
detector = HandDetector()

while True:

    frame = camera.get_frame()

    if frame is None:
        break

    data = detector.detect(frame)

    frame = draw_hands(frame, data)

    cv2.imshow("Hand Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.stop()
cv2.destroyAllWindows()