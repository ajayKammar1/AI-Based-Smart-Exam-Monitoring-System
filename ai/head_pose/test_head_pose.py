import cv2

from ai.camera.camera_manager import CameraManager
from ai.face_detection.detector import FaceDetector
from ai.head_pose.detector import HeadPoseDetector
from ai.head_pose.draw import draw_head_pose


camera = CameraManager()
detector = FaceDetector()
head_pose = HeadPoseDetector()


while True:

    frame = camera.get_frame()

    if frame is None:
        break

    faces = detector.detect(frame)

    for face in faces:

        x1, y1, x2, y2 = face.bbox.astype(int)

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            (0, 255, 0),
            2
        )

        pose = head_pose.get_pose(face)

        if pose:
            draw_head_pose(frame, face.bbox, pose)

    cv2.imshow("Head Pose Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break


camera.stop()
cv2.destroyAllWindows()