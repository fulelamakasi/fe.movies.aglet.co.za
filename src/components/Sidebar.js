import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdMovie, MdFavorite, MdContactMail, MdLanguage,
  MdSecurity, MdPeople, MdVpnKey, MdAssignment,
  MdPersonAdd, MdDashboard
} from 'react-icons/md';

const mainNav = [
  { to: '/', icon: <MdMovie />, label: 'Movies' },
  { to: '/favourites', icon: <MdFavorite />, label: 'Favourites' },
  { to: '/contact', icon: <MdContactMail />, label: 'Contact Us' },
];

const adminNav = [
  { to: '/admin/movies', icon: <MdDashboard />, label: 'Manage Movies' },
  { to: '/admin/languages', icon: <MdLanguage />, label: 'Languages' },
  { to: '/admin/users', icon: <MdPeople />, label: 'Users' },
  { to: '/admin/roles', icon: <MdAssignment />, label: 'Roles' },
  { to: '/admin/permissions', icon: <MdSecurity />, label: 'Permissions' },
  { to: '/admin/role-permissions', icon: <MdVpnKey />, label: 'Role Permissions' },
  { to: '/admin/user-roles', icon: <MdPersonAdd />, label: 'User Roles' },
  { to: '/admin/contact-us', icon: <MdContactMail />, label: 'Contact Submissions' },
];

export default function Sidebar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>AGLET <span>MOVIES</span></h1>
        <p>The Movie Database</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Browse</div>
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        {isAuthenticated && (
          <>
            <div className="nav-section-label">Administration</div>
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <div className="user-avatar">{user?.name?.[0] || 'U'}</div>
              <div>
                <div className="user-name">{user?.name || 'User'}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>
            <button className="btn-logout" onClick={logout}>Sign Out</button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Sign In
          </NavLink>
        )}
      </div>
    </aside>
  );
}
