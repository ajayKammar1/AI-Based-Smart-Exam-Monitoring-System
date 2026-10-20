import React, { useState, useEffect } from 'react';
import { getExams, createExam, deleteExam, getHalls } from '../api';
import { Plus, Trash2, X, Calendar, Clock, MapPin } from 'lucide-react';
import './Halls.css'; // Reusing standard container/form styles
import './Exams.css';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    exam_id: '',
    subject_name: '',
    subject_code: '',
    department: '',
    semester: 1,
    hall_id: '',
    exam_date: '',
    start_time: '',
    end_time: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsData, hallsData] = await Promise.all([getExams(), getHalls()]);
      setExams(examsData);
      setHalls(hallsData);
      if (hallsData.length > 0) {
        setFormData(prev => ({ ...prev, hall_id: hallsData[0].hall_id }));
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load exams data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await createExam(formData);
      if (res.success) {
        setIsModalOpen(false);
        setFormData({
          exam_id: '', subject_name: '', subject_code: '', department: '', 
          semester: 1, hall_id: halls.length > 0 ? halls[0].hall_id : '', 
          exam_date: '', start_time: '', end_time: ''
        });
        fetchData(); // Refresh list
      } else {
        alert(res.message || "Failed to create exam");
      }
    } catch (err) {
      alert("Error saving exam.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm(`Delete exam ${examId}?`)) {
      try {
        await deleteExam(examId);
        fetchData();
      } catch (err) {
        alert("Failed to delete exam");
      }
    }
  };

  if (loading && exams.length === 0) return <div className="page-loading">Loading Exams...</div>;

  return (
    <div className="exams-container">
      <div className="page-header">
        <div>
          <h2>Exams Schedule</h2>
          <p>Manage upcoming examinations and their allocated halls</p>
        </div>
        <button className="btn-primary-add" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Exam
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {exams.length === 0 ? (
        <div className="empty-state">No exams scheduled. Create one to get started.</div>
      ) : (
        <div className="exams-grid">
          {exams.map(exam => (
            <div key={exam.exam_id} className="exam-card">
              <div className="exam-card-header">
                <div>
                  <h3>{exam.subject_name}</h3>
                  <span className="exam-code">{exam.subject_code}</span>
                </div>
                <span className={`status-badge ${exam.status ? exam.status.toLowerCase() : 'scheduled'}`}>
                  {exam.status || 'Scheduled'}
                </span>
              </div>
              
              <div className="exam-card-body">
                <div className="exam-detail">
                  <Calendar size={16} />
                  <span>{exam.exam_date}</span>
                </div>
                <div className="exam-detail">
                  <Clock size={16} />
                  <span>{exam.start_time} - {exam.end_time}</span>
                </div>
                <div className="exam-detail">
                  <MapPin size={16} />
                  <span>{halls.find(h => h.hall_id === exam.hall_id)?.hall_name || exam.hall_id}</span>
                </div>
                
                <div className="exam-tags">
                  <span className="tag">Dept: {exam.department}</span>
                  <span className="tag">Sem: {exam.semester}</span>
                </div>
              </div>
              
              <div className="exam-card-footer">
                <button className="btn-icon delete" onClick={() => handleDelete(exam.exam_id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Schedule New Exam</h3>
              <button className="btn-icon close" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="standard-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Exam ID</label>
                  <input type="text" name="exam_id" value={formData.exam_id} onChange={handleChange} required placeholder="e.g. EXAM-2026-01" />
                </div>
                <div className="form-group">
                  <label>Exam Hall</label>
                  <select name="hall_id" value={formData.hall_id} onChange={handleChange} required>
                    <option value="" disabled>Select Hall</option>
                    {halls.map(h => (
                      <option key={h.hall_id} value={h.hall_id}>{h.hall_name} (Cap: {h.capacity})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject Name</label>
                  <input type="text" name="subject_name" value={formData.subject_name} onChange={handleChange} required placeholder="e.g. Data Structures" />
                </div>
                <div className="form-group">
                  <label>Subject Code</label>
                  <input type="text" name="subject_code" value={formData.subject_code} onChange={handleChange} required placeholder="e.g. CS301" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="e.g. CSE" />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <select name="semester" value={formData.semester} onChange={handleChange} required>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Exam Date</label>
                  <input type="date" name="exam_date" value={formData.exam_date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={submitLoading || halls.length === 0}>
                  {submitLoading ? 'Saving...' : 'Schedule Exam'}
                </button>
              </div>
              {halls.length === 0 && <p style={{color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'right'}}>You must create an Exam Hall first.</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
