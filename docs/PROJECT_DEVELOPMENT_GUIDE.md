# AI-Based Smart Exam Monitoring System
## Development System Requirement Assessment

**Version:** 1.0  
**Project:** AI-Based Smart Exam Monitoring System for Offline Examination Hall  
**Developer Environment Assessment**

---

# 1. Overview

This document evaluates the development system requirements for building the **AI-Based Smart Exam Monitoring System**.

The project consists of:

- React Admin Dashboard
- FastAPI Backend
- MongoDB Database
- OpenCV
- InsightFace
- MediaPipe
- Live Video Streaming
- Face Recognition
- Head Movement Detection
- Hand Detection
- Suspicion Score Engine
- Reports & Analytics

The following assessment is based on the current development laptop.

---

# 2. Current Development System

| Component | Specification |
|------------|--------------|
| Laptop | Dell Latitude E7470 |
| Processor | Intel Core i7-6600U |
| CPU Speed | 2.60 GHz |
| Cores / Threads | 2 Cores / 4 Threads |
| RAM | 8 GB |
| Operating System | Windows 11 Pro 64-bit |
| DirectX | Version 12 |
| GPU | Intel HD Graphics 520 (Integrated) |
| Storage | SSD Recommended |

---

# 3. Development Environment

The following software can be installed and executed successfully on the current system.

| Software | Status |
|-----------|--------|
| Visual Studio Code | ✅ Supported |
| Python 3.10+ | ✅ Supported |
| Node.js (LTS) | ✅ Supported |
| React + Vite | ✅ Supported |
| FastAPI | ✅ Supported |
| MongoDB Community | ✅ Supported |
| Git | ✅ Supported |
| Postman | ✅ Supported |
| OpenCV | ✅ Supported |
| MediaPipe | ✅ Supported |
| InsightFace (CPU Mode) | ✅ Supported |
| NumPy | ✅ Supported |
| Pandas | ✅ Supported |
| Uvicorn | ✅ Supported |

---

# 4. AI Module Performance

The current system is capable of running all core AI modules required for the project in CPU mode.

| Module | Performance |
|---------|-------------|
| Student Registration | ✅ Good |
| Face Detection | ✅ Good |
| Face Recognition | ✅ Good |
| Head Movement Detection | ✅ Good |
| Hand Detection | ✅ Good |
| Face Cover Detection | ✅ Good |
| Student Identification | ✅ Good |
| Suspicion Score Engine | ✅ Excellent |
| Dashboard Communication | ✅ Excellent |
| MongoDB Operations | ✅ Excellent |
| Reports Generation | ✅ Excellent |

---

# 5. Camera Performance

| Camera Configuration | Expected Performance |
|----------------------|----------------------|
| 1 Camera | ✅ Recommended |
| 2 Cameras | ⚠ Moderate Performance |
| 3 Cameras | ⚠ Reduced FPS |
| 4+ Cameras | ❌ Not Recommended |

---

# 6. Supported AI Features

The following features can be developed and demonstrated successfully.

## Student Management

- Student Registration
- Student Login
- Student Details
- Face Registration
- Face Embedding Generation

---

## Face Recognition

- Face Detection
- Face Recognition
- Student Identification
- Unknown Face Detection

---

## Behaviour Detection

- Head Movement Detection
- Hand Movement Detection
- Face Cover Detection
- Suspicious Head Rotation

---

## Monitoring

- Live Camera Feed
- Live Student Recognition
- Bounding Box Display
- Recognition Confidence

---

## Examination Monitoring

- Multi-Person Detection
- Student Tracking
- Attendance Verification
- Seat Monitoring

---

## Suspicion Engine

- Suspicion Score Calculation
- Behaviour Analysis
- Event Logging
- Alert Generation

---

## Reports

- Student Reports
- Attendance Reports
- Suspicion Reports
- Daily Reports
- Analytics Dashboard

---

# 7. Development Limitations

Although the current laptop supports the complete development process, certain limitations exist due to the absence of a dedicated GPU.

## Limitations

- YOLO Object Detection will execute on CPU only.
- Processing speed will be slower compared to GPU systems.
- Multi-camera processing is limited.
- High-resolution video processing may reduce FPS.
- Real-time detection of many students simultaneously will be slower.

These limitations affect only processing speed and not the functionality of the application.

---

# 8. Recommended Development Settings

To achieve smooth performance during development, the following settings are recommended.

| Setting | Recommended Value |
|----------|-------------------|
| Camera Resolution | 640 × 480 |
| FPS | 15–20 |
| Number of Cameras | 1 |
| Face Detection Interval | Every Frame |
| Object Detection Interval | Every 5–10 Frames |
| Image Format | JPEG |
| Database | MongoDB Community |

---

# 9. Recommended Software Stack

## Frontend

- React 19
- Vite
- TypeScript
- Tailwind CSS
- Material UI
- Redux Toolkit
- React Router

---

## Backend

- FastAPI
- Python 3.10+
- JWT Authentication
- WebSocket
- Uvicorn

---

## Database

- MongoDB
- PyMongo

---

## AI Technologies

- OpenCV
- InsightFace
- MediaPipe
- NumPy
- ONNX Runtime

---

## Development Tools

- VS Code
- Git
- Postman
- MongoDB Compass

---

# 10. Overall Assessment

The current development system is fully capable of building and demonstrating the **AI-Based Smart Exam Monitoring System** with all major project features.

The laptop can efficiently support:

- Student Registration
- Face Detection
- Face Recognition
- Live Camera Streaming
- Head Movement Detection
- Hand Detection
- Face Cover Detection
- Multi-Person Detection
- Suspicion Score Calculation
- React Dashboard
- MongoDB Integration
- Reports & Analytics

For a final-year college project, this hardware configuration is sufficient to develop, test, and demonstrate the application using a single live camera.

---

# 11. Future Hardware Recommendation

For production deployment in colleges with multiple examination halls, the following configuration is recommended:

| Component | Recommended Specification |
|------------|--------------------------|
| Processor | Intel Core i7 12th Gen / AMD Ryzen 7 |
| RAM | 16–32 GB |
| GPU | NVIDIA RTX 3060 / RTX 4060 or higher |
| Storage | 1 TB NVMe SSD |
| Operating System | Ubuntu Server 22.04 LTS / Windows 11 Pro |

This configuration enables efficient real-time AI inference, multi-camera monitoring, higher frame rates, and improved scalability for commercial deployments.