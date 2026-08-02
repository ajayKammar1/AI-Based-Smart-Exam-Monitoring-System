# AI-Based Smart Exam Monitoring System
## Project Folder Structure Documentation

**Project Name:** AI-Based Smart Exam Monitoring System  
**Version:** 1.0  
**Architecture:** AI + FastAPI + React + MongoDB + WebSocket

---

# Project Structure

```text
smart-exam-monitoring/
│
├── ai/
│   ├── face_detection/
│   ├── face_recognition/
│   ├── object_detection/
│   ├── pose_detection/
│   ├── hand_detection/
│   ├── tracking/
│   ├── scoring/
│   └── utils/
│
├── backend/
│   ├── api/
│   ├── auth/
│   ├── database/
│   ├── websocket/
│   ├── services/
│   ├── models/
│   └── uploads/
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── store/
│
├── storage/
│   ├── known_faces/
│   ├── unknown_faces/
│   ├── evidence/
│   └── videos/
│
└── docs/
```

---

# Folder Explanation

---

# 1. AI Module

This folder contains all Artificial Intelligence and Computer Vision related modules.

```
ai/
```

---

## face_detection/

Responsible for detecting all faces from the live camera feed.

### Responsibilities

- Detect multiple faces
- Return face coordinates
- Crop detected faces
- Confidence score

### Files

```
detector.py
camera.py
preprocess.py
config.py
```

---

## face_recognition/

Recognizes registered students.

### Responsibilities

- Face Embedding Generation
- Face Matching
- Student Identification
- Unknown Person Detection

### Files

```
recognizer.py
embedding.py
matcher.py
register.py
```

---

## object_detection/

Detect prohibited objects.

### Detects

- Mobile Phone
- Book
- Notes
- Calculator
- Tablet
- Laptop
- Earphones
- Smart Watch

### Files

```
yolo_detector.py
classes.py
utils.py
```

---

## pose_detection/

Body posture estimation.

### Detects

- Head Rotation
- Neck Angle
- Body Direction
- Sitting Position
- Standing Position

### Files

```
pose.py
head_pose.py
angles.py
```

---

## hand_detection/

Tracks hand movement.

### Detects

- Hand Raising
- Face Covering
- Hand Outside Desk
- Suspicious Gestures

### Files

```
hands.py
landmarks.py
gesture.py
```

---

## tracking/

Tracks each student continuously.

### Responsibilities

- Multi Person Tracking
- Student ID Tracking
- Lost Tracking Recovery
- Bounding Box Tracking

### Files

```
tracker.py
sort_tracker.py
deepsort.py
```

---

## scoring/

Calculates cheating probability.

### Responsibilities

- Suspicion Score
- Behaviour Analysis
- Event Weight Calculation
- Final Score

### Example

```
Phone Detected
+40

Looking Away
+10

Covering Face
+20

Talking
+30

Final Score
100
```

### Files

```
score_engine.py
rules.py
weights.py
```

---

## utils/

Shared helper functions.

Contains

- Image Processing
- Logging
- Config
- Drawing Bounding Boxes
- FPS Counter

---

# 2. Backend

```
backend/
```

FastAPI Backend

Handles

- Authentication
- REST APIs
- WebSocket
- Database
- Reports
- Evidence Storage

---

## api/

Contains all REST APIs.

Example

```
student.py
exam.py
report.py
dashboard.py
camera.py
```

---

## auth/

Authentication system.

Features

- Login
- JWT Authentication
- Password Hashing
- Role Management

Files

```
jwt.py
auth.py
security.py
```

---

## database/

Database connection.

Contains

```
mongodb.py
config.py
```

Responsibilities

- MongoDB Connection
- Collections
- Indexes

---

## websocket/

Real-time communication.

Responsibilities

- Live Camera
- Live Dashboard
- Alerts
- Notifications

Files

```
manager.py
broadcast.py
events.py
```

---

## services/

Business logic.

Examples

```
face_service.py
exam_service.py
score_service.py
report_service.py
```

---

## models/

Database models.

Examples

```
student.py
exam.py
attendance.py
report.py
violation.py
```

---

## uploads/

Stores temporary uploaded files.

Contains

```
student_photos/
exam_images/
csv/
```

---

# 3. Frontend

```
frontend/
```

React + Vite Dashboard

---

## src/

Application entry point.

Contains

```
App.jsx
main.jsx
router.jsx
```

---

## pages/

Application Pages

Examples

```
Dashboard
Students
Exams
Reports
Settings
Login
Profile
```

---

## components/

Reusable Components

Examples

```
Navbar
Sidebar
Charts
Cards
Tables
Camera
Modals
Buttons
```

---

## hooks/

React Custom Hooks

Examples

```
useAuth
useCamera
useSocket
useFetch
```

---

## services/

API Calls

Examples

```
studentAPI.js
examAPI.js
reportAPI.js
socket.js
```

---

## store/

State Management

Redux Toolkit

Contains

```
authSlice.js
studentSlice.js
dashboardSlice.js
reportSlice.js
```

---

# 4. Storage

Stores AI generated data.

```
storage/
```

---

## known_faces/

Registered students.

Example

```
known_faces/

Student001/

    image.jpg

    embedding.npy
```

---

## unknown_faces/

Unknown persons detected.

Contains

```
Image
Timestamp
Camera ID
```

---

## evidence/

Stores malpractice evidence.

Contains

```
Images

Short Video Clips

Violation Snapshots

Reports
```

---

## videos/

Stores recorded videos.

Examples

```
Exam Recording

Live Streams

Compressed Videos
```

---

# 5. Documentation

```
docs/
```

Contains all documentation.

Recommended files

```
README.md

ARCHITECTURE.md

DATABASE.md

API.md

AI_MODELS.md

INSTALLATION.md

DEPLOYMENT.md

CHANGELOG.md

PROJECT_STATUS.md

TODO.md

USER_MANUAL.md

ADMIN_GUIDE.md
```

---

# Complete Project Workflow

```
Camera
      │
      ▼
Face Detection
      │
      ▼
Face Recognition
      │
      ▼
Object Detection
      │
      ▼
Pose Detection
      │
      ▼
Hand Detection
      │
      ▼
Multi Object Tracking
      │
      ▼
Behaviour Analysis
      │
      ▼
Suspicion Score Engine
      │
      ▼
Evidence Storage
      │
      ▼
MongoDB
      │
      ▼
FastAPI
      │
      ▼
WebSocket
      │
      ▼
React Dashboard
      │
      ▼
Admin Monitoring
```

---

# Technology Stack

| Layer | Technology |
|----------|------------|
| Frontend | React + Vite + Redux Toolkit + Tailwind CSS |
| Backend | FastAPI |
| Database | MongoDB |
| Authentication | JWT |
| AI Framework | OpenCV, MediaPipe, InsightFace, YOLOv8 |
| Deep Learning | PyTorch |
| Real-Time Communication | WebSocket |
| File Storage | Local Storage / Cloud |
| Reports | PDF + Excel |
| Deployment | Docker + Nginx (Optional) |

---

# Future Enhancements

- Multi-camera support
- Automatic Email Alerts
- SMS Notifications
- AI Voice Detection
- Eye Gaze Estimation
- Lip Movement Detection
- Attendance Analytics
- Cloud Deployment
- Mobile Admin App
- Real-time Exam Hall Monitoring
- Deep Learning Behaviour Classification
- AI-powered Risk Prediction

---

## Summary

This folder structure cleanly separates:

- AI Processing
- Backend APIs
- Frontend Dashboard
- Data Storage
- Documentation

The architecture is modular, scalable, and suitable for a production-quality final-year project or a commercial AI exam monitoring system.