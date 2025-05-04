import React from 'react';
import '../Navbar.css';

function Navbar({ currentPage, navigateTo, user, onLogout }) {
  // Create a function to handle tab click that both navigates and refreshes
  const handleTabClick = (tabName) => {
    // If already on the same tab, just refresh the data
    if (currentPage === tabName) {
      // We need to communicate with parent to refresh the tab
      // This assumes you add a refreshActiveTab prop to Navbar
      if (typeof window.refreshActiveTab === 'function') {
        window.refreshActiveTab();
      }
    }
    
    // Navigate to the tab
    navigateTo(tabName);
  };
  
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className={`nav-item ${currentPage === 'create' ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => handleTabClick('create')}
          >
            Create User
          </button>
        </li>
        <li className={`nav-item ${currentPage === 'manage' ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => handleTabClick('manage')}
          >
            Manage Users
          </button>
        </li>
        <li className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => handleTabClick('profile')}
          >
            Create User Profile
          </button>
        </li>
        <li className={`nav-item ${currentPage === 'manageProfiles' ? 'active' : ''}`}>
          <button 
            className="nav-link" 
            onClick={() => handleTabClick('manageProfiles')}
          >
            Manage Profiles
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