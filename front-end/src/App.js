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
    try {
      const loggedInUser = localStorage.getItem('user');
      if (loggedInUser) {
          const parsedUser = JSON.parse(loggedInUser);
          // Crucially check for parsedUser.id as well
          if (parsedUser && parsedUser.username && parsedUser.id) {
              setIsAuthenticated(true);
              setUser(parsedUser);
          } else {
              // If essential info like ID is missing, treat as not properly logged in
              localStorage.removeItem('user');
          }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear invalid data from localStorage
      localStorage.removeItem('user');
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
    if (userData && userData.id) { // Ensure userData.id exist
        try {
            const userToStore = {
                id: userData.id, // Store the ID
                username: username,
                profile: userData.profile || null,
                email: userData.email || '',
                status: userData.status || 'ACTIVE'
            };
            setIsAuthenticated(true);
            setUser(userToStore);
            localStorage.setItem('user', JSON.stringify(userToStore));
        } catch (error) {
            console.error('Error saving user data:', error);
            // Clear any partial data that might have been stored
            localStorage.removeItem('user');
        }
    } else {
        console.error('Login failed: User data, ID missing.', userData);
        // Clear any existing auth data
        localStorage.removeItem('user');
    }
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
            {user?.profile?.name === 'UserAdmin' ? (
              <UserAdminUi 
                ref={userAdminRef}
                initialTab={currentPage} 
                isAuthenticated={true}
                onNavigate={navigateTo}
              />
            ) : (
              <CleanerUi 
                ref={cleanerUiRef}
                isAuthenticated={true}
                onNavigate={navigateTo}
                currentPage={currentPage}
                user={user ? { 
                  ...user, // Spread all user properties
                  id: user.id, // Ensure id is included
                  profile: user.profile || null // Ensure profile exists
                } : null}
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
