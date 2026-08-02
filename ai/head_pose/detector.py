class HeadPoseDetector:

    def __init__(self):
        pass

    def get_pose(self, face):

        # InsightFace returns pose as [pitch, yaw, roll]
        if not hasattr(face, "pose"):
            return None

        pitch = float(face.pose[0])
        yaw = float(face.pose[1])
        roll = float(face.pose[2])

        direction = "STRAIGHT"

        if yaw < -20:
            direction = "LEFT"

        elif yaw > 20:
            direction = "RIGHT"

        elif pitch < -15:
            direction = "UP"

        elif pitch > 15:
            direction = "DOWN"

        return {
            "pitch": pitch,
            "yaw": yaw,
            "roll": roll,
            "direction": direction
        }