import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function linkClass({ isActive }) {
  return isActive ? 'active' : '';
}

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0 }}>PayTrack</h2>
          <div className="small">
            Signed in as <span className="badge">{user?.email || '—'}</span>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      <div className="nav">
        <NavLink className={linkClass} to="/app/dashboard">Dashboard</NavLink>
        <NavLink className={linkClass} to="/app/income">Income</NavLink>
        <NavLink className={linkClass} to="/app/expense">Expense</NavLink>
        <NavLink className={linkClass} to="/app/history">History</NavLink>
        <NavLink className={linkClass} to="/app/monthly">Monthly</NavLink>
        <NavLink className={linkClass} to="/app/profile">Profile</NavLink>
      </div>

      <Outlet />
    </div>
  );
}
