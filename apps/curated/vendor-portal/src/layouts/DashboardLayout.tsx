import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardLayout.css';

export function DashboardLayout() {
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/profile', label: 'Brand Profile', icon: '🏢' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/products', label: 'Products', icon: '🧴' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/discovery', label: 'Discovery', icon: '🔍' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">JADE Vendor Portal</h1>
          <p className="sidebar-subtitle">{user?.companyName}</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-button">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
