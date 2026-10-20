# AI Module Installation and Testing Guide

This guide will walk you through the process of setting up and running the AI modules on your system. **Please ensure you only run these modules using the provided test files.**

## 📋 Prerequisites
- **Python**: Ensure you have Python 3.8 or newer installed. You can download it from [python.org](https://www.python.org/).
- **C++ Build Tools**: Some AI libraries (like `insightface`) may require C++ build tools to compile on Windows. If you encounter errors during installation, you might need to install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

---

## 🛠️ Step 1: Extract the Folder
Extract the zipped `ai` folder to a convenient location on your system. Open your terminal or command prompt and navigate to the extracted folder:

```bash
cd path/to/extracted/ai
```

---

## 🔒 Step 2: Create a Virtual Environment (Recommended)
It is highly recommended to use a virtual environment to avoid conflicts with other Python projects on your system.

**1. Create the virtual environment:**
```bash
python -m venv ai_env
```

**2. Activate the virtual environment:**
- **On Windows:**
  ```bash
  ai_env\Scripts\activate
  ```
- **On macOS/Linux:**
  ```bash
  source ai_env/bin/activate
  ```
*(You should see `(ai_env)` appear at the beginning of your command prompt)*

---

## 📦 Step 3: Install Requirements
With your virtual environment activated, install all the necessary AI libraries using the provided `requirements.txt` file:

```bash
pip install -r requirements.txt
```
*Note: This process might take a few minutes as it downloads large machine learning models and libraries like OpenCV, Mediapipe, and Insightface.*

---

## 🚀 Step 4: Running the AI Modules (Test Files Only)

As per the guidelines, you should **only run the AI modules using the designated test files**. Do not integrate them into a production server directly without the main system configuration.

**To run a test file:**
Ensure your virtual environment is still active, then run the test script using Python. 

*Example (assuming you have a test file named `test_detector.py` in the root of this folder):*
```bash
python test_detector.py
```

*(If the test files are located in a specific subfolder like `ai/face_detection/`, navigate there or run them via module path):*
```bash
python -m face_detection.test_script_name
```

### Important Notes for Testing:
- Ensure you have a working webcam if the test script requires live video feed.
- If the test script requires an input image, ensure the image file path is correctly referenced in the test script.
- Press `q` to close any OpenCV video windows that pop up during testing.
