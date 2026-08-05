import React, { useState, useRef } from 'react';
import { createStudent, uploadStudentPhoto, generateStudentEmbedding } from '../api';
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
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photo) {
      setStatus({ type: 'error', message: 'Please select a photo for the student.' });
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

      // 2. Upload Photo
      setStatus({ type: 'info', message: 'Uploading student photo...' });
      const photoRes = await uploadStudentPhoto(formData.student_id, photo);
      
      if (!photoRes.success) {
        throw new Error(photoRes.message || 'Failed to upload photo');
      }

      // 3. Generate Embedding
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
