import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, MonitorPlay, FileText, Video, LogOut, UserPlus, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(
    location.pathname.includes('/halls') || 
    location.pathname.includes('/exams') || 
    location.pathname.includes('/allocations')
  );
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(
    location.pathname.includes('/students')
  );

  return (
    <div className="sidebar glass-panel">
      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="text-gradient">AI Proctor</h2>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Secure Exam Monitoring</p>
      </div>
      
      <nav style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>
        


        <NavLink to="/camera" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <Video size={18} />
          Camera Feed
        </NavLink>
        
        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={() => setIsStudentMenuOpen(!isStudentMenuOpen)} 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'space-between', whiteSpace: 'nowrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderOpen size={18} />
              Student Management
            </div>
            {isStudentMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {isStudentMenuOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: '0.5rem' }}>
              <NavLink end to="/students" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                <Users size={16} />
                Students List
              </NavLink>
              
              <NavLink to="/students/register" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                <UserPlus size={16} />
                Register Student
              </NavLink>
            </div>
          )}
        </div>
        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={() => setIsExamMenuOpen(!isExamMenuOpen)} 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'space-between', whiteSpace: 'nowrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderOpen size={18} />
              Exam Management
            </div>
            {isExamMenuOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
          
          {isExamMenuOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)', marginLeft: '0.5rem' }}>
              <NavLink to="/halls" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                <LayoutDashboard size={16} />
                Exam Halls
              </NavLink>
              
              <NavLink to="/exams" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                <FileText size={16} />
                Exams
              </NavLink>
              
              <NavLink to="/allocations" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                <Users size={16} />
                Allocations
              </NavLink>
            </div>
          )}
        </div>
        
        <NavLink to="/reports" className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start' }}>
          <FileText size={18} />
          Reports
        </NavLink>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>

        <button onClick={logout} className="btn" style={{ width: '100%', justifyContent: 'flex-start', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
