import React, { Component } from 'react';
import '../CreateUser.css';

class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userProfile: '',
      response: null,
      error: null,
      dropdownOpen: false,
      message: null
    };
    this.dropdownRef = React.createRef();
  }

  getUserInput = async (username, password, userProfile) => {
    try {
      // In a real app, this would call your API
      // const res = await fetch('http://localhost:3001/api/users', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     username, 
      //     password, 
      //     userProfile 
      //   }),
      // });
      // const data = await res.json();
      
      // Simulate success response
      const data = { username, userProfile };
      
      this.setState({ 
        response: data,
        message: {
          text: `User ${username} created successfully!`,
          type: 'success'
        },
        username: '',
        password: '',
        userProfile: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
      
      return 'User created successfully';
    } catch (err) {
      this.setState({ 
        error: err.message,
        message: {
          text: `Error: ${err.message}`,
          type: 'error'
        }
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
      
      return err.message;
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  selectUserProfile = (type) => {
    this.setState({
      userProfile: type,
      dropdownOpen: false
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, userProfile } = this.state;
    if (!userProfile) {
      alert("Please select a user profile.");
      return;
    }
    await this.getUserInput(username, password, userProfile.toUpperCase());
  };

  // Close dropdown when clicking outside
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ dropdownOpen: false });
    }
  };

  render() {
    const { username, password, userProfile, response, error, dropdownOpen, message } = this.state;
    
    return (
      <div className="create-user-container">
        <h2 className="page-title">Create User Account</h2>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={this.handleSubmit} className="create-user-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username"
              name="username"
              value={username}
              onChange={this.handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={password}
              onChange={this.handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>User Profile:</label>
            <div className="dropdown-container" ref={this.dropdownRef}>
              <button 
                type="button"
                className="dropdown-button"
                onClick={() => this.setState({ dropdownOpen: !dropdownOpen })}
              >
                <span>{userProfile || "User Profile"}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div 
                    className="dropdown-item"
                    onClick={() => this.selectUserProfile('Cleaner')}
                  >
                    Cleaner
                  </div>
                  <div 
                    className="dropdown-item"
                    onClick={() => this.selectUserProfile('Homeowner')}
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

        {response && !message && (
          <div className="success">
            <p>User created successfully!</p>
            <p>Username: {response.username}</p>
          </div>
        )}

        {error && !message && <div className="error">Error: {error}</div>}
      </div>
    );
  }
}

export default CreateUser;