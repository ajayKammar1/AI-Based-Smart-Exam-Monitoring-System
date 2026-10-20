import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import StudentRegistration from './pages/StudentRegistration';
import StudentsList from './pages/StudentsList';
import Halls from './pages/Halls';
import Exams from './pages/Exams';
import ExamAllocation from './pages/ExamAllocation';
import Camera from './pages/Camera';
import Reports from './pages/Reports';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {/* Only show sidebar if authenticated */}
      {isAuthenticated && <Sidebar />}
      
      <main className="main-content" style={{ padding: isAuthenticated ? '2rem' : '0' }}>
        <Routes>
          
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/students" element={
            <ProtectedRoute>
              <StudentsList />
            </ProtectedRoute>
          } />

          <Route path="/camera" element={
            <ProtectedRoute>
              <Camera />
            </ProtectedRoute>
          } />

          <Route path="/students/register" element={
            <ProtectedRoute>
              <StudentRegistration />
            </ProtectedRoute>
          } />

          <Route path="/halls" element={
            <ProtectedRoute>
              <Halls />
            </ProtectedRoute>
          } />

          <Route path="/exams" element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          } />

          <Route path="/allocations" element={
            <ProtectedRoute>
              <ExamAllocation />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </main>
    </div>
  );
}

export default App;
