import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { apiClient } from '../../api/config';
import './Students.css';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: 1
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/students');
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        department: student.department || '',
        year: student.year || 1
      });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', email: '', department: '', year: 1 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleChange = (e) => {
    const value = e.target.name === 'year' ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await apiClient(`/students/${editingStudent.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiClient('/students', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      fetchStudents();
      setSearchTerm(''); // Clear search so the new student is visible
      handleCloseModal();
      alert(editingStudent ? 'Student updated successfully!' : 'New student created successfully!');
    } catch (error) {
      alert(`Failed to save student: ${error.message || 'Server error'}`);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await apiClient(`/students/${id}`, { method: 'DELETE' });
        fetchStudents();
      } catch (error) {
        alert('Failed to delete student.');
        console.error(error);
      }
    }
  };

  const filteredStudents = students.filter(s => {
    const search = searchTerm.toLowerCase();
    const nameMatch = s.name ? s.name.toLowerCase().includes(search) : false;
    const emailMatch = s.email ? s.email.toLowerCase().includes(search) : false;
    const deptMatch = s.department ? s.department.toLowerCase().includes(search) : false;
    return nameMatch || emailMatch || deptMatch;
  });

  return (
    <div className="students-page inner-page-fade">
      <div className="page-header d-flex space-between">
        <div>
          <h1>Student Directory</h1>
          <p className="subtitle">Manage enrolled students across departments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="dashboard-card glass-panel p-0">
        <div className="table-toolbar">
          <div className="input-with-icon" style={{ width: '300px' }}>
            <Search size={18} className="input-icon" />
            <input 
              type="text" 
              className="input-field pl-10" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading students...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>No students found {searchTerm ? `matching "${searchTerm}"` : ''}.</p>
            {searchTerm && <button className="btn btn-secondary btn-sm mt-3" onClick={() => setSearchTerm('')}>Clear Search</button>}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td className="text-secondary">#{student.id}</td>
                    <td className="font-medium text-white">{student.name}</td>
                    <td className="text-secondary">{student.email}</td>
                    <td><span className="badge badge-primary">{student.department || 'N/A'}</span></td>
                    <td>Year {student.year || 0}</td>
                    <td className="actions-cell">
                      <button className="icon-btn-small hover-primary" onClick={() => handleOpenModal(student)} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn-small hover-danger" onClick={() => handleDelete(student.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="icon-btn-small" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group mb-3">
                <label className="input-label">Full Name</label>
                <input required type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group mb-3">
                <label className="input-label">Email Address</label>
                <input required type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group mb-3">
                <label className="input-label">Department</label>
                <input required type="text" name="department" className="input-field" value={formData.department} onChange={handleChange} />
              </div>
              <div className="form-group mb-4">
                <label className="input-label">Year</label>
                <input required type="number" name="year" min="1" max="5" className="input-field" value={formData.year} onChange={handleChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingStudent ? 'Save Changes' : 'Create Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
