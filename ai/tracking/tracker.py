from deep_sort_realtime.deepsort_tracker import DeepSort
from .config import MAX_AGE, N_INIT, MAX_IOU_DISTANCE


class FaceTracker:

    def __init__(self):

        self.tracker = DeepSort(
            max_age=MAX_AGE,
            n_init=N_INIT,
            max_iou_distance=MAX_IOU_DISTANCE
        )

    def update(self, results, frame):

        detections = []

        for person in results:

            x1, y1, x2, y2 = person["bbox"]

            w = x2 - x1
            h = y2 - y1

            # Skip invalid detections
            if w <= 0 or h <= 0:
                continue

            detections.append(
                (
                    [x1, y1, w, h],      # Bounding box
                    float(person["score"]),  # Confidence
                    "face"               # Track ONLY faces
                )
            )

        tracks = self.tracker.update_tracks(
            detections,
            frame=frame
        )

        # Return only confirmed and recently updated tracks
        valid_tracks = []

        for track in tracks:

            if not track.is_confirmed():
                continue

            if track.time_since_update > 1:
                continue

            valid_tracks.append(track)

        return valid_tracks