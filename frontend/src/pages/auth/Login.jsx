import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { apiClient } from '../../api/config';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Teacher' // Default for registration
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await apiClient('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        
        if (response.role !== formData.role) {
          setError(`Access denied. This account belongs to a ${response.role}. Please select the correct role.`);
          setLoading(false);
          return;
        }

        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('user_role', response.role);
          localStorage.setItem('user_name', response.name);
          localStorage.setItem('user_id', response.userId);
          localStorage.setItem('user_email', formData.email);
          navigate('/');
        }
      } else {
        await apiClient('/auth/register', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        setIsLogin(true); // Switch to login after successful register
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <div className="logo-icon large">SS</div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Enter your credentials to access the system' : 'Sign up to manage students effectively'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  name="name"
                  className="input-field pl-10" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="input-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                name="email"
                className="input-field pl-10" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                name="password"
                className="input-field pl-10" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Login As A</label>
            <select 
              name="role" 
              className="input-field"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? <Loader className="spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="text-link" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
