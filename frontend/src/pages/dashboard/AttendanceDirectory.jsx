import { useState, useEffect } from 'react';
import { Calendar, Search, User, Plus, X } from 'lucide-react';
import { apiClient } from '../../api/config';
import './Dashboard.css';

const AttendanceDirectory = () => {
  const role = localStorage.getItem('user_role') || 'Student';
  const userEmail = localStorage.getItem('user_email');
  const isTeacher = role === 'Teacher';

  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', subject: '', totalClasses: '', attendedClasses: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [attData, stuData] = await Promise.all([
        apiClient('/attendance'),
        apiClient('/students')
      ]);
      setAttendance(attData);
      setStudents(stuData);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    try {
      await apiClient('/attendance', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          studentId: parseInt(formData.studentId, 10),
          totalClasses: parseInt(formData.totalClasses, 10),
          attendedClasses: parseInt(formData.attendedClasses, 10)
        })
      });
      setShowModal(false);
      setFormData({ studentId: '', subject: '', totalClasses: '', attendedClasses: '' });
      fetchInitialData();
      alert('Attendance recorded successfully!');
    } catch (error) {
      alert(`Failed to save attendance: ${error.message || 'Server error'}`);
    }
  };

  const filteredAttendance = attendance.filter(a => {
    // 1. Role-based privacy filtering
    if (!isTeacher && userEmail) {
      if (a.student?.email?.toLowerCase() !== userEmail.toLowerCase()) return false;
    }

    // 2. Search filtering
    const search = searchTerm.toLowerCase();
    const studentName = a.student?.name?.toLowerCase() || '';
    const subject = a.subject?.toLowerCase() || '';
    return studentName.includes(search) || subject.includes(search);
  });

  return (
    <div className="attendance-page inner-page-fade">
      <div className="page-header d-flex space-between">
        <div>
          <h1>Attendance Management</h1>
          <p className="subtitle">
            {isTeacher 
              ? 'View and monitor student attendance across all subjects.' 
              : 'View your personalized attendance records and progress.'}
          </p>
        </div>
        {isTeacher && (
          <button className="btn btn-primary d-flex align-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Attendance
          </button>
        )}
      </div>

      <div className="dashboard-card glass-panel p-0">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input-field pl-10" 
              placeholder="Filter by student or subject..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading attendance records...</div>
        ) : filteredAttendance.length === 0 ? (
          <div className="empty-state">No attendance records found.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Progress</th>
                  <th>Classes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map(record => (
                  <tr key={record.id}>
                    <td>
                      <div className="d-flex align-center gap-2">
                        <div className="avatar-mini">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="font-medium text-white">{record.student?.name || 'Unknown'}</div>
                          <div className="text-secondary text-xs">ID: #{record.student?.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-white">{record.subject}</td>
                    <td style={{ width: '200px' }}>
                      <div className="progress-bar-bg">
                        <div 
                          className={`progress-bar-fill ${record.percentage < 75 ? 'bg-danger' : 'bg-success'}`}
                          style={{ width: `${Math.min(record.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </td>
                    <td>{record.attendedClasses} / {record.totalClasses}</td>
                    <td>
                      <span className={`badge ${record.percentage < 75 ? 'badge-danger' : 'badge-success'}`}>
                        {record.percentage < 75 ? 'Shortage' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Attendance Modal */}
      {showModal && (
        <div className="modal-overlay animate-fade-in z-top">
          <div className="modal-content glass-panel mx-w-400">
            <div className="modal-header">
              <h3>Record Attendance</h3>
              <button className="icon-btn-small" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAttendance} className="modal-body">
              <div className="form-group mb-3">
                <label className="input-label">Select Student</label>
                <select 
                  className="input-field" 
                  required 
                  value={formData.studentId} 
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (#{s.id})</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-3">
                <label className="input-label">Subject</label>
                <input type="text" className="input-field" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. History" />
              </div>
              <div className="d-flex gap-2 mb-4 align-center">
                <div className="form-group flex-1">
                  <label className="input-label">Attended</label>
                  <input type="number" className="input-field" required value={formData.attendedClasses} onChange={e => setFormData({...formData, attendedClasses: e.target.value})} placeholder="24" />
                </div>
                <span className="text-secondary mt-4">/</span>
                <div className="form-group flex-1">
                  <label className="input-label">Total Classes</label>
                  <input type="number" className="input-field" required value={formData.totalClasses} onChange={e => setFormData({...formData, totalClasses: e.target.value})} placeholder="30" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary full-width">Save Attendance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDirectory;
