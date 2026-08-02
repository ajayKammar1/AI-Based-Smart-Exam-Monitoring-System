# AI-Based Smart Exam Monitoring System
## Basic Final Year College Project Specification

**Version:** 1.0

---

# 1. Project Overview

The AI-Based Smart Exam Monitoring System is designed to monitor students during offline examinations using computer vision and artificial intelligence. The system identifies registered students, tracks their behaviour, detects suspicious activities, and generates reports through an interactive web dashboard.

---

# 2. Functional Modules

## Module 1: Authentication

### Features

- Default Admin Login
- JWT Authentication
- Secure Password Hashing
- Logout

### Default Credentials

Username: admin

Password: admin123

---

## Module 2: Student Management

### Features

- Add Student
- Edit Student
- Delete Student
- View Student Details
- Upload Student Photo
- Generate Face Embedding
- Store Face Embedding

### Student Information

- Student ID
- Name
- Roll Number
- Department
- Semester
- Hall Number
- Seat Number
- Photograph

---

## Module 3: Face Recognition

### Features

- Live Camera Feed
- Face Detection
- Face Recognition
- Student Identification
- Unknown Face Detection
- Face Bounding Box
- Confidence Score

---

## Module 4: Behaviour Detection

### Features

#### Head Movement

- Looking Left
- Looking Right
- Looking Up
- Looking Down

#### Hand Detection

- Hand Near Face

#### Face Cover Detection

- Face Covered by Hand
- Partial Face Hidden

---

## Module 5: Suspicion Score

### Score Rules

| Activity | Score |
|-----------|------:|
| Looking Left | 3 |
| Looking Right | 3 |
| Looking Up | 2 |
| Looking Down | 2 |
| Hand Near Face | 5 |
| Face Covered | 10 |

### Status

- Low
- Medium
- High

---

## Module 6: Dashboard

### Dashboard Cards

- Total Students
- Live Camera Status
- Student Detected
- Current Suspicion Score
- Recent Detection Activities

---

## Module 7: Database

### MongoDB Collections

- Admin
- Students
- Face Embeddings
- Detection Logs

---

## Module 8: Reports

### Reports

- Student Information Report
- Detection History
- Suspicion Report

### Export

- PDF (Optional)

---

## Module 9: Documentation

### Documents

- Software Requirement Specification (SRS)
- System Design Document
- Database Design
- Installation Guide
- User Manual

---

# 3. Technology Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- Material UI
- Axios

---

## Backend

- FastAPI
- Python 3.10+
- JWT Authentication
- Uvicorn

---

## Database

- MongoDB
- PyMongo

---

## Artificial Intelligence

- OpenCV
- InsightFace
- MediaPipe
- NumPy

---

# 4. Project Workflow

Admin Login

↓

Student Registration

↓

Upload Student Photograph

↓

Generate Face Embedding

↓

Save Student Data

↓

Start Live Camera

↓

Face Detection

↓

Face Recognition

↓

Behaviour Detection

↓

Suspicion Score Calculation

↓

Store Detection Log

↓

Display Dashboard

↓

Generate Reports

---

# 5. Expected Deliverables

- Complete React Source Code
- Complete FastAPI Backend
- AI Detection Modules
- MongoDB Database
- API Documentation
- SRS Document
- System Design
- Database Design
- User Manual
- Installation Guide
- Project Report
- PowerPoint Presentation

---

# 6. Project Timeline

Week 1
- Environment Setup
- Authentication
- Database Setup

Week 2
- Student Management

Week 3
- Face Registration
- Face Recognition

Week 4
- Behaviour Detection

Week 5
- Suspicion Score
- Dashboard

Week 6
- Reports
- Documentation
- Testing

---

# 7. Future Scope

- Multi-Camera Support
- Object Detection (Mobile, Book, Calculator)
- Email Alerts
- Live Video Recording
- Analytics Dashboard
- Multi-User Support
- Cloud Deployment
- Attendance Management