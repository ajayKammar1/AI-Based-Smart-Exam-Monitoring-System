import cv2
import threading
import time

class Camera:
    def __init__(self, camera_index=0, width=640, height=480):
        self.camera_index = camera_index
        self.width = width
        self.height = height
        
        self.cap = None
        self.latest_frame = None
        self.running = True
        self.lock = threading.Lock()
        
        # We use an event to let the main thread know when the camera is ready
        self.ready_event = threading.Event()
        
        self.thread = threading.Thread(target=self._reader, daemon=True)
        self.thread.start()
        
        # Wait up to 5 seconds for the camera to initialize in the background thread
        if not self.ready_event.wait(timeout=5.0):
            raise RuntimeError("Failed to open camera. It might be blocked or in use.")

    def _reader(self):
        # FIX FOR WINDOWS 11: The cv2.VideoCapture object MUST be created inside 
        # the same thread that reads from it, otherwise the COM object hangs.
        
        # We try CAP_DSHOW first (fixes HP laptops), fallback to default if it fails
        self.cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)
        
        if not self.cap.isOpened():
            self.cap = cv2.VideoCapture(self.camera_index) # Fallback
            
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
        self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        
        if self.cap.isOpened():
            self.ready_event.set() # Signal main thread that camera is ready
        else:
            self.running = False
            return

        fail_count = 0
        while self.running:
            success, frame = self.cap.read()
            if not success:
                fail_count += 1
                with self.lock:
                    self.latest_frame = None
                
                if fail_count > 30:
                    self.cap.release()
                    self.cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)
                    self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
                    self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
                    fail_count = 0
                
                time.sleep(0.1)
                continue
            
            fail_count = 0
            with self.lock:
                self.latest_frame = frame

    def read(self):
        with self.lock:
            if self.latest_frame is None:
                return False, None
            return True, self.latest_frame.copy()

    def release(self):
        self.running = False
        if self.thread.is_alive():
            self.thread.join(timeout=1.0)
        if self.cap and self.cap.isOpened():
            self.cap.release()