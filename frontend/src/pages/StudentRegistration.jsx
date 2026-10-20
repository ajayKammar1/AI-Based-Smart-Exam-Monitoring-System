import React, { useState, useRef, useEffect } from 'react';
import { createStudent, uploadStudentPhoto, generateStudentEmbedding } from '../api';
import { Camera, Upload, Video } from 'lucide-react';
import './StudentRegistration.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    usn: '',
    department: '',
    semester: 1,
    email: '',
    phone: '',
  });
  
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [useAICapture, setUseAICapture] = useState(false);
  
  // Camera specific state
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle switching to camera mode
  useEffect(() => {
    if (useAICapture) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [useAICapture]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setCameraError(false);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(true);
      setStatus({ type: 'error', message: 'Could not access camera. Please check permissions.' });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        // Create a File object
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        setPhoto(file);
        setPhotoPreview(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg', 0.9);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    startCamera();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || 1 : value
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setUseAICapture(false); // Explicit file upload disables AI capture
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photo) {
      setStatus({ type: 'error', message: 'Please select or capture a photo for the student.' });
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Creating student record...' });
    
    try {
      // 1. Create Student
      const createRes = await createStudent(formData);
      if (!createRes.success) {
        throw new Error(createRes.message || 'Failed to create student');
      }

      // 2. Upload Photo (File or Blob)
      setStatus({ type: 'info', message: 'Uploading student photo...' });
      const photoRes = await uploadStudentPhoto(formData.student_id, photo);
      
      if (!photoRes.success) {
        throw new Error(photoRes.message || 'Failed to upload photo');
      }

      // 3. Generate Embedding via backend
      setStatus({ type: 'info', message: 'Generating facial embeddings for AI...' });
      const embedRes = await generateStudentEmbedding(formData.student_id);
      
      if (!embedRes.success) {
        throw new Error(embedRes.message || 'Failed to generate embedding');
      }

      setStatus({ type: 'success', message: 'Student registered successfully!' });
      
      // Reset form
      setFormData({
        student_id: '',
        name: '',
        usn: '',
        department: '',
        semester: 1,
        email: '',
        phone: '',
      });
      setPhoto(null);
      setPhotoPreview(null);
      setUseAICapture(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Registration Error:', error);
      setStatus({ type: 'error', message: error.message || 'An error occurred during registration.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h2 className="registration-title">Student Registration</h2>
        <p className="registration-subtitle">Enroll a new student for AI Exam Monitoring</p>
        
        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID</label>
              <input 
                type="text" 
                name="student_id" 
                value={formData.student_id} 
                onChange={handleChange} 
                required 
                placeholder="e.g. STU12345"
              />
            </div>
            
            <div className="form-group">
              <label>USN</label>
              <input 
                type="text" 
                name="usn" 
                value={formData.usn} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 1AB23CS001"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input 
                type="text" 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
                required 
                placeholder="Computer Science"
              />
            </div>

            <div className="form-group">
              <label>Semester</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="student@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                placeholder="+1234567890"
              />
            </div>
          </div>
          
          <div className="photo-upload-section full-width">
            <label>Student Photo (for AI Facial Recognition)</label>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
              <button 
                type="button" 
                className={`capture-mode-btn ${!useAICapture ? 'active' : ''}`}
                onClick={() => setUseAICapture(false)}
              >
                <Upload size={18} /> Upload File
              </button>
              <button 
                type="button" 
                className={`capture-mode-btn ${useAICapture ? 'active' : ''}`}
                onClick={() => { setUseAICapture(true); setPhoto(null); setPhotoPreview(null); }}
              >
                <Camera size={18} /> In-Browser Web Camera
              </button>
            </div>

            {useAICapture ? (
              <div className="camera-capture-container">
                {photoPreview ? (
                  <div className="photo-preview-wrapper">
                    <img src={photoPreview} alt="Captured preview" className="photo-preview" />
                    <button 
                      type="button" 
                      className="change-photo-btn"
                      onClick={retakePhoto}
                    >
                      Retake Photo
                    </button>
                  </div>
                ) : (
                  <div className="video-wrapper">
                    {cameraError ? (
                      <div className="camera-error-box">
                        <Video size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <p>Camera access denied or unavailable.</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Please check your browser permissions.</p>
                      </div>
                    ) : (
                      <>
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted 
                          className="live-video"
                        ></video>
                        <button 
                          type="button" 
                          className="capture-btn"
                          onClick={captureImage}
                          disabled={!isCameraActive}
                        >
                          <Camera size={20} /> Capture Face
                        </button>
                      </>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                  </div>
                )}
              </div>
            ) : (
              <div className="photo-upload-container">
                {photoPreview ? (
                  <div className="photo-preview-wrapper">
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
                    <button 
                      type="button" 
                      className="change-photo-btn"
                      onClick={() => fileInputRef.current.click()}
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div 
                    className="photo-upload-placeholder"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <div className="upload-icon">📷</div>
                    <span>Click to browse for a photo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentRegistration;
