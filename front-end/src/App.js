import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './boundaries/Navbar';
import UserAdminUI from './boundaries/UserAdminUI';

function App() {
  const [currentPage, setCurrentPage] = useState('create');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsAuthenticated(true);
      setUser(loggedInUser);
    }
  }, []);
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };
  
  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setUser(username);
    // Store in localStorage for persistence across page refreshes
    localStorage.setItem('user', username);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('');
    // Remove from localStorage
    localStorage.removeItem('user');
  };

  return (
    <div className="app-container">
      {isAuthenticated ? (
        // Show the main app when authenticated
        <>
          <header className="app-header">
            <h1>User Administration System</h1>
          </header>
          
          <Navbar 
            currentPage={currentPage} 
            navigateTo={navigateTo} 
            user={user}
            onLogout={handleLogout}
          />
          
          <main className="app-content">
            <UserAdminUI
              initialTab={currentPage === 'create' ? 'create' : 'manage'} 
              isAuthenticated={true} 
            />
          </main>
          
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} User Admin System</p>
          </footer>
        </>
      ) : (
        // Show just the UserAdminUi for login when not authenticated
        <UserAdminUI 
          onLogin={handleLogin} 
          isAuthenticated={false}
        />
      )}
    </div>
  );
}

export default App;