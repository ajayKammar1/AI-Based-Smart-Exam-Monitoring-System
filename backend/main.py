from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database.mongodb import connect_db
from backend.database.mongodb import close_db
from backend.api.auth import router as auth_router
from backend.api.students import router as student_router
from backend.api.exam_halls import router as hall_router
from backend.api.exams import router as exam_router
from backend.api.assignments import router as assignment_router
from backend.api.attendance import router as attendance_router

from backend.api.monitoring import router as monitoring_router
from backend.api.websocket_api import router as websocket_router

app = FastAPI(
    title="AI-Based Offline Exam Malpractice Detection System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os

os.makedirs("storage/known_faces", exist_ok=True)
app.mount("/storage", StaticFiles(directory="storage"), name="storage")

import threading

monitor_thread = None

@app.on_event("startup")
def startup():
    connect_db()
    
    # Start AI monitoring in a background thread
    from ai.monitoring.monitor import monitor_instance
    global monitor_thread
    monitor_thread = threading.Thread(target=monitor_instance.run, daemon=True)
    monitor_thread.start()


@app.on_event("shutdown")
def shutdown():
    from ai.monitoring.monitor import monitor_instance
    monitor_instance.stop_event = True
    close_db()

app.include_router(auth_router)
app.include_router(student_router)
app.include_router(hall_router)
app.include_router(exam_router)
app.include_router(assignment_router)
app.include_router(attendance_router)
app.include_router(monitoring_router)
app.include_router(websocket_router)

@app.get("/")
def home():

    return {
        "message": "AI Exam Monitoring Backend Running"
    }


@app.get("/health")
def health():

    return {
        "status": "Healthy"
    }