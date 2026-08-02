from fastapi import FastAPI

from backend.database.mongodb import connect_db
from backend.database.mongodb import close_db

app = FastAPI(
    title="AI-Based Offline Exam Malpractice Detection System",
    version="1.0.0"
)


@app.on_event("startup")
def startup():

    connect_db()


@app.on_event("shutdown")
def shutdown():

    close_db()


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