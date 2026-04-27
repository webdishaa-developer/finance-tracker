import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="logo-icon">₹</span>
        <span className="brand-name">FinTrack</span>
      </div>
      <div className="nav-right">
        <span className="nav-user">👤 {user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
