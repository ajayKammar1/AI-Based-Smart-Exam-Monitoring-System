import React, { useState, useEffect } from 'react';
import { Video, Shield, Play, Square } from 'lucide-react';
import { API_URL } from '../api';
import './Halls.css';

const Camera = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    fetchExams();
    checkStreamStatus();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch(`${API_URL}/exams`);
      const data = await response.json();
      
      // Filter for today's exams or live exams
      const today = new Date().toISOString().split('T')[0];
      const todaysExams = data.filter(exam => exam.exam_date === today);
      setExams(todaysExams);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const checkStreamStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/monitoring/status`);
      const data = await response.json();
      if (data.is_running) {
        setIsStreaming(true);
        setSelectedExam(data.exam_id);
        setStreamUrl(`${API_URL}/monitoring/video_feed?t=${Date.now()}`);
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleStartStream = async () => {
    if (!selectedExam) return;
    
    const exam = exams.find(e => e.exam_id === selectedExam);
    
    try {
      const response = await fetch(`${API_URL}/monitoring/start_stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: selectedExam,
          hall_id: exam ? exam.hall_id : 'UNKNOWN'
        })
      });
      
      if (response.ok) {
        setIsStreaming(true);
        setStreamUrl(`${API_URL}/monitoring/video_feed?t=${Date.now()}`);
      }
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const handleStopStream = async () => {
    try {
      const response = await fetch(`${API_URL}/monitoring/stop_stream`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setIsStreaming(false);
        setStreamUrl('');
      }
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  };

  return (
    <div className="halls-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Live Camera Feed</h2>
          <p>Real-time AI processed video stream</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={selectedExam} 
            onChange={(e) => setSelectedExam(e.target.value)}
            disabled={isStreaming}
            style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            <option value="">Select an active exam...</option>
            {exams.map(exam => (
              <option key={exam.exam_id} value={exam.exam_id}>
                {exam.exam_name} ({exam.exam_id})
              </option>
            ))}
          </select>

          {!isStreaming ? (
            <button 
              onClick={handleStartStream}
              disabled={!selectedExam}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#10b981', color: '#fff', border: 'none', cursor: selectedExam ? 'pointer' : 'not-allowed', opacity: selectedExam ? 1 : 0.5 }}
            >
              <Play size={18} /> Start Stream
            </button>
          ) : (
            <button 
              onClick={handleStopStream}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              <Square size={18} /> Stop Stream
            </button>
          )}
        </div>
      </div>

      <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '600px', justifyContent: 'center', backgroundColor: '#000' }}>
        {isStreaming ? (
          <img 
            src={streamUrl} 
            alt="Live Exam Stream" 
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              document.getElementById('stream-error').style.display = 'flex';
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <Shield size={64} style={{ opacity: 0.5 }} />
            <h3>No Active Stream</h3>
            <p>Select an exam and click "Start Stream" to begin monitoring.</p>
          </div>
        )}
        
        <div id="stream-error" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
          <Shield size={64} style={{ opacity: 0.5 }} />
          <h3>Stream Interrupted</h3>
          <p>Please check the camera connection or server status.</p>
        </div>
      </div>
    </div>
  );
};

export default Camera;
