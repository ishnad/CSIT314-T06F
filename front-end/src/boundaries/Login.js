import React, { Component } from 'react';
import '../Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: null,
      isLoading: false
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    
    // Show loading state
    this.setState({ isLoading: true, error: null });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, using hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      this.props.onLogin(username);
      this.setState({ error: null, isLoading: false });
    } else {
      this.setState({ 
        error: 'Invalid username or password. Try admin/admin123',
        isLoading: false
      });
    }
  };

  render() {
    const { username, password, error, isLoading } = this.state;

    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          
          <h1 className="login-title">Admin Login</h1>
          
          <p className="login-subtitle">Enter your credentials to access the admin panel</p>
          
          {error && <div className="login-error">{error}</div>}
          
          <form onSubmit={this.handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                name="username"
                value={username}
                onChange={this.handleInputChange}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;