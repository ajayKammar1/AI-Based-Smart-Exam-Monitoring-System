import React, { useState, useEffect } from 'react';
import { getHalls, createHall, deleteHall } from '../api';
import { Plus, Trash2, X } from 'lucide-react';
import './Halls.css';

const Halls = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    hall_id: '',
    hall_name: '',
    capacity: 30,
    camera_count: 2,
    location: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const data = await getHalls();
      setHalls(data);
    } catch (err) {
      console.error("Failed to fetch halls:", err);
      setError("Failed to load exam halls.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'capacity' || name === 'camera_count') ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await createHall(formData);
      if (res.success) {
        setIsModalOpen(false);
        setFormData({ hall_id: '', hall_name: '', capacity: 30, camera_count: 2, location: '' });
        fetchHalls();
      } else {
        alert(res.message || "Failed to create hall");
      }
    } catch (err) {
      alert("Error saving hall.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (hallId) => {
    if (window.confirm(`Delete hall ${hallId}?`)) {
      try {
        await deleteHall(hallId);
        fetchHalls();
      } catch (err) {
        alert("Failed to delete hall");
      }
    }
  };

  if (loading && halls.length === 0) return <div className="page-loading">Loading Exam Halls...</div>;

  return (
    <div className="halls-container">
      <div className="page-header">
        <div>
          <h2>Exam Halls</h2>
          <p>Manage venues for AI monitoring</p>
        </div>
        <button className="btn-primary-add" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Hall
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {halls.length === 0 ? (
        <div className="empty-state">No exam halls found. Create one to get started.</div>
      ) : (
        <div className="halls-grid">
          {halls.map(hall => (
            <div key={hall.hall_id} className="hall-card">
              <div className="hall-card-header">
                <h3>{hall.hall_name}</h3>
                <span className="hall-badge">{hall.hall_id}</span>
              </div>
              <div className="hall-card-body">
                <div className="stat-row">
                  <span className="stat-label">Location:</span>
                  <span className="stat-value">{hall.location}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Capacity:</span>
                  <span className="stat-value">{hall.capacity} students</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Cameras:</span>
                  <span className="stat-value">{hall.camera_count} Active</span>
                </div>
              </div>
              <div className="hall-card-footer">
                <button className="btn-icon delete" onClick={() => handleDelete(hall.hall_id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Exam Hall</h3>
              <button className="btn-icon close" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="standard-form">
              <div className="form-group">
                <label>Hall ID (Unique)</label>
                <input type="text" name="hall_id" value={formData.hall_id} onChange={handleChange} required placeholder="e.g. HALL-A1" />
              </div>
              <div className="form-group">
                <label>Hall Name</label>
                <input type="text" name="hall_name" value={formData.hall_name} onChange={handleChange} required placeholder="e.g. Main Auditorium" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Camera Count</label>
                  <input type="number" name="camera_count" value={formData.camera_count} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Location Details</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Block A, 1st Floor" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={submitLoading}>
                  {submitLoading ? 'Saving...' : 'Save Hall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Halls;
