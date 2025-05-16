import React from 'react';
import '../Navbar.css';

function Navbar({ currentPage, navigateTo, user, onLogout, activeTab }) {
  // Create a function to handle tab click that both navigates and refreshes
  const handleTabClick = (tabName) => {
    // Always navigate to the tab first
    navigateTo(tabName);
    
    // Then refresh the data if it's the same tab
    if (currentPage === tabName) {
      if (typeof window.refreshActiveTab === 'function') {
        window.refreshActiveTab();
      }
    }
  };
  
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        {user?.profile?.name === 'Cleaner' ? (
          <>
            <li className={`nav-item ${currentPage === 'search' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('search')}
              >
                Search Listings
              </button>
            </li>
            <li className={`nav-item ${currentPage === 'myListings' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('myListings')}
              >
                My Listings
              </button>
            </li>
            <li className={`nav-item ${currentPage === 'matches' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('matches')}
              >
                Confirmed Matches
              </button>
            </li>
            <li className={`nav-item ${currentPage === 'insights' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => {
                  handleTabClick('insights');
                  if (typeof window.refreshActiveTab === 'function') {
                    window.refreshActiveTab();
                  }
                }}
              >
                Profile Insights
              </button>
            </li>
          </>
        ) : user?.profile?.name === 'UserAdmin' ? (
          <>
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
          </>
        ) : (
          <>
            <li className={`nav-item ${currentPage === 'browseCleaners' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('browseCleaners')}
              >
                Browse Cleaners
              </button>
            </li>
            <li className={`nav-item ${currentPage === 'saved' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('saved')}
              >
                Saved Cleaners
              </button>
            </li>
            <li className={`nav-item ${currentPage === 'booked' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('booked')}
              >
                My Bookings
              </button>
            </li>
            <li className={`nav-item ${currentPage === 'history' ? 'active' : ''}`}>
              <button 
                className="nav-link" 
                onClick={() => handleTabClick('history')}
              >
                Cleaning History
              </button>
            </li>
          </>
        )}
      </ul>
      
      <div className="navbar-user">
        {/* Render user.username instead of the whole user object */}
        <span className="user-greeting">Welcome, {user?.username}</span>
        {/* Optional: Show profile name if available */}
        {user?.profile?.name && (
          <span className="user-role">({user.profile.name})</span>
        )}
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
