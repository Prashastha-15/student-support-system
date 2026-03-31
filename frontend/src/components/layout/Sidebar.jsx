import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Award, AlertCircle, Settings } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
  const menuItems = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: Calendar },
    { name: 'Marks', path: '/marks', icon: Award },
  ];

  return (
    <aside className="sidebar glass-panel animate-fade-in">
      <div className="sidebar-header">
        <div className="logo-icon">SS</div>
        <h2>Student Support</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                  end={item.path === '/'}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-link">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
