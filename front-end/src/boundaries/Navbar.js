import React from 'react';
import '../Navbar.css';

function Navbar({ currentPage, navigateTo, user, onLogout }) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className={`nav-item ${currentPage === 'create' ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => navigateTo('create')}
          >
            Create User
          </button>
        </li>
        <li className={`nav-item ${currentPage === 'manage' ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => navigateTo('manage')}
          >
            Manage Users
          </button>
        </li>
      </ul>
      
      <div className="navbar-user">
        <span className="user-greeting">Welcome, {user}</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;