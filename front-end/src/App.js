import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './boundaries/Navbar';
import UserAdminUi from './boundaries/UserAdminUI';
import CleanerUi from './boundaries/CleanerUI';

function App() {
  const [currentPage, setCurrentPage] = useState('create');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  
  // Create a ref to the UserAdminUi component
  const userAdminRef = useRef(null);

  const cleanerUiRef = useRef(null);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(loggedInUser));
    }
    
    // Define the global refresh function for the Navbar to call
    window.refreshActiveTab = () => {
      if (userAdminRef.current && typeof userAdminRef.current.refreshActiveTabData === 'function') {
        userAdminRef.current.refreshActiveTabData();
      }
      if (cleanerUiRef.current && typeof cleanerUiRef.current.refreshActiveTabData === 'function') {
        cleanerUiRef.current.refreshActiveTabData();
      }
    };
    
    // Cleanup
    return () => {
      delete window.refreshActiveTab;
    };
  }, []);
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (username, userData) => {
    setIsAuthenticated(true);
    setUser(userData);  // store the complete user object
    localStorage.setItem('user', JSON.stringify(userData));
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
            {user?.profile?.name === 'UserAdmin' && (
              <UserAdminUi 
                ref={userAdminRef}
                initialTab={currentPage} 
                isAuthenticated={true}
                onNavigate={navigateTo}
              />
            )}

            {user?.profile?.name === 'Cleaner' && (
              <CleanerUi 
                ref={cleanerUiRef}
                initialTab={currentPage}
                isAuthenticated={true}
                onNavigate={navigateTo}
              />
            )}
          </main>
          
          <footer className="app-footer">
            <p>&copy; {new Date().getFullYear()} User Admin System</p>
          </footer>
        </>
      ) : (
        // Show just the UserAdminUi for login when not authenticated
        <UserAdminUi
          onLogin={handleLogin} 
          isAuthenticated={false}
        />
      )}
    </div>
  );
}

export default App;