import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const TopNavbar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Admin User';
  const userRole = localStorage.getItem('user_role') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    navigate('/login');
  };

  return (
    <header className="top-navbar glass-panel animate-fade-in">
      <div className="navbar-left">
        <div className="search-bar">
          <input type="text" className="input-field" placeholder="Search..." />
        </div>
      </div>
      
      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="name">{userName}</span>
            <span className="role">{userRole}</span>
          </div>
        </div>

        <button className="icon-btn logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
