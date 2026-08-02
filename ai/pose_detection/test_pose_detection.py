import cv2

from ai.camera.camera_manager import CameraManager
from ai.pose_detection.detector import PoseDetector
from ai.pose_detection.draw import draw_pose


camera = CameraManager()
detector = PoseDetector()

while True:

    frame = camera.get_frame()

    if frame is None:
        break

    data = detector.detect(frame)

    frame = draw_pose(frame, data)

    cv2.imshow("Pose Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.stop()
cv2.destroyAllWindows()