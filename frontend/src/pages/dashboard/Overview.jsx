import { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Calendar, Award, AlertTriangle, User as UserIcon, Plus, X, Users, LogOut } from 'lucide-react';
import { apiClient } from '../../api/config';
import './Dashboard.css';

const Overview = () => {
  const role = localStorage.getItem('user_role') || 'Student';
  const isTeacher = role === 'Teacher';
  const loggedInUserId = localStorage.getItem('user_id');
  const loggedInUserEmail = localStorage.getItem('user_email');

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Dashboard Data State
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isTeacher) {
      fetchStudents();
    } else {
      // If Student, auto-select themselves via exact email match
      if (loggedInUserEmail) {
        autoSelectStudent(loggedInUserEmail);
      }
    }
  }, [isTeacher, loggedInUserEmail]);

  const fetchStudents = async () => {
    try {
      const data = await apiClient('/students');
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students.');
    }
  };

  const autoSelectStudent = async (email) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const userRes = await apiClient('/students').catch(() => []);
      const matched = userRes.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
      
      if (matched) {
        setSelectedStudent(matched);
        fetchDataForStudent(matched.id);
      } else {
        // Stop loading, and leave selectedStudent as null to show error UI
        setLoading(false);
        setErrorMsg('Your academic profile has not been created by a Teacher yet. Please ask an administrator to add your email to the Student Directory.');
      }
    } catch (err) {
      setErrorMsg('Failed to auto-load your profile.');
      setLoading(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);
    setIsDropdownOpen(false);
    fetchDataForStudent(student.id);
  };

  const fetchDataForStudent = async (studentId) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [attData, marksData, alertsData] = await Promise.all([
        apiClient(`/attendance/student/${studentId}`).catch(() => []),
        apiClient(`/marks/student/${studentId}`).catch(() => []),
        apiClient(`/alerts/student/${studentId}`).catch(() => [])
      ]);
      setAttendance(attData);
      setMarks(marksData);
      setAlerts(alertsData);
    } catch (err) {
      setErrorMsg('Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const lower = searchTerm.toLowerCase();
    return students.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      (s.email && s.email.toLowerCase().includes(lower)) ||
      s.id.toString() === lower
    );
  }, [students, searchTerm]);

  return (
    <div className="dashboard-page inner-page-fade">
      <div className="page-header student-lookup-header">
        <div className="header-titles">
          <h1>{isTeacher ? 'Student Diagnostics' : 'My Dashboard'}</h1>
          <p className="subtitle">
            {isTeacher 
              ? 'Search and select a student to instantly view their unified record.' 
              : 'Review your personalized attendance, marks, and alerts.'}
          </p>
        </div>
        
        {isTeacher && (
          <div className="search-container">
            <div className="input-with-icon lookup-input">
              <Search size={20} className="input-icon" />
              <input 
                type="text" 
                className="input-field pl-10" 
                placeholder="Lookup Student Name/ID..." 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  if (e.target.value === '') setSelectedStudent(null);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
                {isDropdownOpen && searchTerm && filteredStudents.length > 0 && (
                  <ul className="dropdown-list glass-panel">
                    {filteredStudents.map(student => (
                      <li key={student.id} onClick={() => handleSelectStudent(student)}>
                        <div className="autocomplete-item">
                          <span className="name">{student.name}</span>
                          <span className="subtext">({student.email}) - {student.department}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {isDropdownOpen && searchTerm && filteredStudents.length === 0 && (
                  <div className="dropdown-list glass-panel p-4 text-center">
                    <p className="text-secondary mb-2">No student matches "{searchTerm}"</p>
                    <NavLink to="/students" className="btn btn-primary btn-sm">Add New Student</NavLink>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Success Note for Teachers */}
        {isTeacher && (
          <div className="info-banner glass-panel mb-4 d-flex-col gap-2 p-4">
            <div className="d-flex align-center gap-2">
              <LogOut size={16} className="text-primary" />
              <span className="text-secondary">Want to test the Student view? Remember to logout first!</span>
            </div>
          </div>
        )}

        {/* Special Welcome State for completely empty databases */}
        {!selectedStudent && isTeacher && (students.length === 0) && (
          <div className="welcome-card glass-panel p-8 text-center animate-fade-in mb-6">
            <Users size={64} className="text-primary mb-4" />
            <h2 className="mb-2">Welcome to your Teacher Dashboard!</h2>
            <p className="text-secondary mb-6">
              It looks like your Student Directory is currently empty. Add students before you can record marks.
            </p>
            <NavLink to="/students" className="btn btn-primary px-8">
              <Plus size={20} /> Create Your First Student
            </NavLink>
          </div>
        )}

        {!selectedStudent && isTeacher && (students.length > 0) && (
          <div className="empty-lookup-state glass-panel animate-fade-in">
            <UserIcon size={48} className="empty-icon" />
            <h3>No Student Selected</h3>
            <p>Please use the search bar above to look up a student's profile to view and input grades.</p>
          </div>
        )}

      {!selectedStudent && !isTeacher && !loading && (
        <div className="empty-lookup-state glass-panel animate-fade-in">
          <UserIcon size={48} className="empty-icon text-danger" />
          <h3 className="text-danger">Profile Not Linked</h3>
          <p>{errorMsg || "Your account has not been linked to a student profile yet."}</p>
        </div>
      )}

      {selectedStudent && loading && (
        <div className="p-8 text-center text-secondary">Loading Profile...</div>
      )}

      {selectedStudent && !loading && (
        <div className="diagnostic-dashboard animate-fade-in">
          {/* Quick Info Profile Bar */}
          <div className="profile-bar glass-panel mb-4">
            <div className="profile-details">
              <h2>{selectedStudent.name}</h2>
              <div className="tags">
                <span className="badge badge-primary">ID: #{selectedStudent.id}</span>
                <span className="badge badge-secondary">{selectedStudent.department || 'Enrolled Student'}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-content-grid">
            {/* Left Column: Attendance & Marks */}
            <div className="flex-2 d-flex-col gap-4">
              
              {/* Attendance Card */}
              <div className="dashboard-card glass-panel">
                <div className="card-header d-flex space-between align-center">
                  <h3 className="d-flex align-center gap-2">
                    <Calendar size={20} className="text-primary" /> Attendance Record
                  </h3>
                </div>
                <div className="card-body">
                  {attendance.length === 0 ? <p className="text-secondary text-center">No attendance recorded yet.</p> : (
                    <div className="progress-list">
                      {attendance.map(record => (
                        <div key={record.id} className="progress-item">
                          <div className="progress-info">
                            <span className="subject">{record.subject}</span>
                            <span className="metrics">{record.attendedClasses} / {record.totalClasses} classes ({record.percentage}%)</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div 
                              className={`progress-bar-fill ${record.percentage < 75 ? 'bg-danger' : 'bg-success'}`}
                              style={{ width: `${Math.min(record.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Marks Card */}
              <div className="dashboard-card glass-panel flex-grow">
                <div className="card-header d-flex space-between align-center">
                  <h3 className="d-flex align-center gap-2">
                    <Award size={20} className="text-accent" /> Academic Marks
                  </h3>
                </div>
                <div className="card-body p-0">
                  {marks.length === 0 ? <div className="p-4 text-secondary text-center">No academic marks recorded.</div> : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Sem</th>
                          <th>Score</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map(mark => {
                          const percent = (mark.score / mark.maxScore) * 100;
                          return (
                            <tr key={mark.id}>
                              <td className="font-medium text-white">{mark.subject}</td>
                              <td className="text-secondary">{mark.semester}</td>
                              <td>{mark.score} / {mark.maxScore}</td>
                              <td>
                                <span className={`badge ${percent >= 90 ? 'badge-success' : percent >= 75 ? 'badge-primary' : percent >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                                  {percent >= 90 ? 'A' : percent >= 75 ? 'B' : percent >= 50 ? 'C' : 'F'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Alerts */}
            <div className="flex-1">
              <div className="dashboard-card glass-panel h-full" style={{ minHeight: '100%' }}>
                <div className="card-header d-flex space-between">
                  <h3 className="d-flex align-center gap-2"><AlertTriangle size={20} className="text-danger" /> System Alerts</h3>
                </div>
                <div className="card-body p-0">
                  {alerts.length === 0 ? <div className="p-4 text-secondary text-center">No active alerts. Excellent standing.</div> : (
                    <div className="alerts-list">
                      {alerts.map(alert => (
                        <div key={alert.id} className={`alert-toast ${alert.read ? 'read' : 'unread'}`}>
                          <div className="alert-toast-indicator"></div>
                          <div className="alert-toast-content">
                            <h4 className="alert-type">{alert.type || 'Notice'}</h4>
                            <p>{alert.message}</p>
                            <span className="alert-date">{new Date(alert.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
