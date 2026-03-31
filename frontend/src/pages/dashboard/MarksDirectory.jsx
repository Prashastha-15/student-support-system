import { useState, useEffect } from 'react';
import { Award, Search, User, Plus, X } from 'lucide-react';
import { apiClient } from '../../api/config';
import './Dashboard.css';

const MarksDirectory = () => {
  const role = localStorage.getItem('user_role') || 'Student';
  const userEmail = localStorage.getItem('user_email');
  const isTeacher = role === 'Teacher';

  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', subject: '', score: '', maxScore: 100, semester: '1st' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [marksData, stuData] = await Promise.all([
        apiClient('/marks'),
        apiClient('/students')
      ]);
      setMarks(marksData);
      setStudents(stuData);
    } catch (error) {
      console.error('Failed to fetch marks data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMarks = async (e) => {
    e.preventDefault();
    try {
      await apiClient('/marks', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          studentId: parseInt(formData.studentId, 10),
          score: parseFloat(formData.score),
          maxScore: parseFloat(formData.maxScore)
        })
      });
      setShowModal(false);
      setFormData({ studentId: '', subject: '', score: '', maxScore: 100, semester: '1st' });
      fetchInitialData();
      alert('Marks recorded successfully!');
    } catch (error) {
      alert(`Failed to save marks: ${error.message || 'Server error'}`);
    }
  };

  const filteredMarks = marks.filter(m => {
    // 1. Role-based privacy filtering
    if (!isTeacher && userEmail) {
      if (m.student?.email?.toLowerCase() !== userEmail.toLowerCase()) return false;
    }

    // 2. Search filtering
    const search = searchTerm.toLowerCase();
    const studentName = m.student?.name?.toLowerCase() || '';
    const subject = m.subject?.toLowerCase() || '';
    return studentName.includes(search) || subject.includes(search);
  });

  return (
    <div className="marks-page inner-page-fade">
      <div className="page-header d-flex space-between">
        <div>
          <h1>Academic Results</h1>
          <p className="subtitle">
            {isTeacher 
              ? "Track students' academic performance and grades." 
              : "View your personalized academic reports and grades."}
          </p>
        </div>
        {isTeacher && (
          <button className="btn btn-primary d-flex align-center gap-2" onClick={() => setShowModal(true)}>
            <Plus size={20} /> Add Marks
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
          <div className="empty-state">Loading academic results...</div>
        ) : filteredMarks.length === 0 ? (
          <div className="empty-state">No marks found.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Semester</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarks.map(mark => {
                  const percent = (mark.score / mark.maxScore) * 100;
                  return (
                    <tr key={mark.id}>
                      <td>
                        <div className="d-flex align-center gap-2">
                          <div className="avatar-mini">
                            <User size={14} />
                          </div>
                          <div>
                            <div className="font-medium text-white">{mark.student?.name || 'Unknown'}</div>
                            <div className="text-secondary text-xs">ID: #{mark.student?.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-white">{mark.subject}</td>
                      <td className="text-secondary">{mark.semester}</td>
                      <td>{mark.score} / {mark.maxScore} ({percent.toFixed(1)}%)</td>
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
          </div>
        )}
      </div>

      {/* Add Marks Modal */}
      {showModal && (
        <div className="modal-overlay animate-fade-in z-top">
          <div className="modal-content glass-panel mx-w-400">
            <div className="modal-header">
              <h3>Record Marks</h3>
              <button className="icon-btn-small" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddMarks} className="modal-body">
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
                <input type="text" className="input-field" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Mathematics" />
              </div>
              <div className="d-flex gap-2 mb-3 align-center">
                <div className="form-group flex-1">
                  <label className="input-label">Score</label>
                  <input type="number" step="0.1" className="input-field" required value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} placeholder="85" />
                </div>
                <span className="text-secondary mt-4">/</span>
                <div className="form-group flex-1">
                  <label className="input-label">Max</label>
                  <input type="number" step="0.1" className="input-field" required value={formData.maxScore} onChange={e => setFormData({...formData, maxScore: e.target.value})} />
                </div>
              </div>
              <div className="form-group mb-4">
                <label className="input-label">Semester</label>
                <input type="text" className="input-field" required value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} placeholder="e.g. 1st Semester" />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary full-width">Save Marks</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksDirectory;
