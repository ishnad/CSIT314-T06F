import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    accountType: ''
  });
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const selectAccountType = (type) => {
    setFormData({
      ...formData,
      accountType: type
    });
    setDropdownOpen(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert(`Account creation submitted for ${formData.username} as ${formData.accountType}`);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  return (
    <div className="wire-frame-container">
      <form onSubmit={handleSubmit} className="create-user-form">
        <h2 className="form-heading">Create User Account</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Account Type:</label>
          <div className="dropdown-container" ref={dropdownRef}>
            <button 
              type="button"
              className="dropdown-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{formData.accountType || "Account Type"}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div 
                  className="dropdown-item"
                  onClick={() => selectAccountType('Cleaner')}
                >
                  Cleaner
                </div>
                <div 
                  className="dropdown-item"
                  onClick={() => selectAccountType('Homeowner')}
                >
                  Homeowner
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="button-container">
          <button type="submit" className="create-button">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;