import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import StudentDirectory from './pages/students/StudentDirectory';
import AttendanceDirectory from './pages/dashboard/AttendanceDirectory';
import MarksDirectory from './pages/dashboard/MarksDirectory';

function App() {
  const isAuthenticated = !!localStorage.getItem('jwt_token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes inside Dashboard Layout */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Overview />} />
          <Route path="students" element={<StudentDirectory />} />
          <Route path="attendance" element={<AttendanceDirectory />} />
          <Route path="marks" element={<MarksDirectory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
