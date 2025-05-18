import React, { Component } from 'react';
import '../LoginPage.css';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUsername: '',
      loginPassword: '',
      loginError: null,
      isLoading: false,
    };
  }

  handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleLoginSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, loginError: null }); // Clear previous errors

    const { loginUsername, loginPassword } = this.state;

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies/sessions
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use error message from backend if available, otherwise a generic one
        throw new Error(data.message || data.error || `Login failed with status: ${response.status}`);
      }

      // Login successful
      this.setState({
        loginUsername: '', // Clear form
        loginPassword: '',
        loginError: null,
        isLoading: false,
      });

      // Call the onLogin prop passed from App.js, providing the user data
      if (this.props.onLogin && data.user) {
        this.props.onLogin(data.user.username, data.user); // Pass username and full user object
      } else {
        // This case should ideally not happen if backend sends user data on success
        console.error("Login success but no user data received from backend or onLogin prop missing.");
        this.setState({ loginError: "Login succeeded but user data is incomplete." });
      }

    } catch (error) {
      console.error('Login error:', error);
      this.setState({
        loginError: error.message || 'An unexpected error occurred during login.',
        isLoading: false
      });
    }
  };

  render() {
    const { loginUsername, loginPassword, loginError, isLoading } = this.state;

    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>

          <h1 className="login-title">Login</h1> {/* Changed from Admin Login for generality */}

          <p className="login-subtitle">Enter your credentials to access your account</p>

          {loginError && <div className="login-error">{loginError}</div>}

          <form onSubmit={this.handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="loginUsername">Username</label>
              <input
                type="text"
                id="loginUsername"
                name="loginUsername"
                value={loginUsername}
                onChange={this.handleLoginInputChange}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                id="loginPassword"
                name="loginPassword"
                value={loginPassword}
                onChange={this.handleLoginInputChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
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

export default LoginPage;
