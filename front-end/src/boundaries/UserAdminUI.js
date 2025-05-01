import React, { Component } from 'react';
import '../UserAdminUI.css';

class UserAdminUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Login state
      loginUsername: '',
      loginPassword: '',
      loginError: null,
      isLoading: false,
      
      // ManageUsers state
      users: [],
      filteredUsers: [],
      searchTerm: '',
      loading: false,
      error: null,
      selectedUser: null,
      showEditModal: false,
      editFormData: {
        username: '',
        userProfile: '',
        email: '',
        status: ''
      },
      
      // CreateUser state
      newUser: {
        username: '',
        password: '',
        userProfile: '',
      },
      response: null,
      dropdownOpen: false,
      message: null,
      
      // Tab management
      activeTab: props.initialTab || 'manage' // Use the initialTab prop, default to 'manage'
    };
    
    this.dropdownRef = React.createRef();
  }
  
  componentDidMount() {
    // If authenticated, load users
    if (this.props.isAuthenticated) {
      this.getAllUsers();
    }
    
    // Add event listener for dropdown
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
  
  // Update active tab if initialTab prop changes
  componentDidUpdate(prevProps) {
    // Load users if user becomes authenticated
    if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
      this.getAllUsers();
    }
    
    // Update active tab if initialTab prop changes
    if (this.props.initialTab !== prevProps.initialTab && this.props.initialTab) {
      this.setState({ activeTab: this.props.initialTab });
    }
  }

  // Login methods
  handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { loginUsername, loginPassword } = this.state;
    
    // Show loading state
    this.setState({ isLoading: true, loginError: null });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo purposes, using hardcoded admin credentials
    if (loginUsername === 'admin' && loginPassword === 'admin123') {
      // Call the parent component's login handler
      this.props.onLogin(loginUsername);
      
      this.setState({ 
        loginUsername: '',
        loginPassword: '',
        loginError: null, 
        isLoading: false 
      });
    } else {
      this.setState({ 
        loginError: 'Invalid username or password. Try admin/admin123',
        isLoading: false
      });
    }
  };

  // ManageUsers methods
  getAllUsers = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      // Use the actual API call
      const res = await fetch('http://localhost:3001/api/users');
      const data = await res.json();
      
      this.setState({
        users: data,
        filteredUsers: data,
        loading: false
      });
      
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false,
        message: {
          text: `Error loading users: ${err.message}`,
          type: 'error'
        }
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  search = async (keyword) => {
    if (!keyword.trim()) {
      this.setState({ filteredUsers: this.state.users });
      return;
    }
    
    try {
      this.setState({ loading: true });
      
      // Use the actual API call
      const res = await fetch(`http://localhost:3001/api/users/search?term=${keyword}`);
      const data = await res.json();
      
      this.setState({
        filteredUsers: data,
        loading: false,
        message: data.length === 0 ? {
          text: "No users found matching your search criteria",
          type: "info"
        } : null
      });
      
    } catch (err) {
      this.setState({
        error: err.message,
        loading: false,
        message: {
          text: `Error searching: ${err.message}`,
          type: 'error'
        }
      });
      
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.search(this.state.searchTerm);
  };

  selectUser = (user) => {
    this.setState({ selectedUser: user });
  };

  getEditInputs = () => {
    const { selectedUser } = this.state;
    if (!selectedUser) return;
    
    this.setState({
      editFormData: {
        username: selectedUser.username,
        userProfile: selectedUser.userProfile,
        email: selectedUser.email || '',
        status: selectedUser.status
      },
      showEditModal: true
    });
  };

  handleEditFormChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        [name]: value
      }
    }));
  };

  handleSaveChanges = async (e) => {
    e.preventDefault();
    const { selectedUser, editFormData } = this.state;
    
    try {
      // Use the actual API call
      const res = await fetch(`http://localhost:3001/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      
      // Update local state with the response from API
      const updatedUsers = this.state.users.map(user => {
        if (user.id === selectedUser.id) {
          return data;
        }
        return user;
      });
      
      const updatedFilteredUsers = this.state.filteredUsers.map(user => {
        if (user.id === selectedUser.id) {
          return data;
        }
        return user;
      });
      
      this.setState({
        users: updatedUsers,
        filteredUsers: updatedFilteredUsers,
        selectedUser: data,
        showEditModal: false,
        message: {
          text: `User ${data.username} updated successfully!`,
          type: 'success'
        }
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
      
    } catch (err) {
      this.setState({
        error: err.message,
        message: {
          text: `Failed to update user: ${err.message}`,
          type: 'error'
        }
      });
      
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  handleCancelEdit = () => {
    this.setState({ showEditModal: false });
  };

  confirmSuspend = async () => {
    const { selectedUser } = this.state;
    if (!selectedUser) return;
    
    const confirmAction = window.confirm(
      selectedUser.status === 'Active'
        ? `Are you sure you want to suspend ${selectedUser.username}?`
        : `Are you sure you want to activate ${selectedUser.username}?`
    );
    
    if (!confirmAction) return;
    
    try {
      // Use the actual API call
      const newStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active';
      
      const res = await fetch(`http://localhost:3001/api/users/${selectedUser.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      const updatedUsers = this.state.users.map(user => {
        if (user.id === selectedUser.id) {
          return data;
        }
        return user;
      });
      
      const updatedFilteredUsers = this.state.filteredUsers.map(user => {
        if (user.id === selectedUser.id) {
          return data;
        }
        return user;
      });
      
      this.setState({
        users: updatedUsers,
        filteredUsers: updatedFilteredUsers,
        selectedUser: data,
        message: {
          text: `User ${data.username} ${data.status === 'Active' ? 'activated' : 'suspended'} successfully!`,
          type: 'success'
        }
      });
      
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
      
    } catch (err) {
      this.setState({
        error: err.message,
        message: {
          text: `Failed to update user status: ${err.message}`,
          type: 'error'
        }
      });
      
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // CreateUser methods
  createUser = async (username, password, userProfile) => {
    try {
      // Use the actual API call
      const res = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password, 
          userProfile 
        }),
      });
      const data = await res.json();
      
      this.setState({ 
        response: data,
        message: {
          text: `User ${username} created successfully!`,
          type: 'success'
        },
        newUser: {
          username: '',
          password: '',
          userProfile: ''
        }
      });
      
      // Refresh the user list
      this.getAllUsers();
      
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

  handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser,
        [name]: value
      }
    }));
  };

  selectUserProfile = (type) => {
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser,
        userProfile: type
      },
      dropdownOpen: false
    }));
  };

  handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    const { username, password, userProfile } = this.state.newUser;
    if (!userProfile) {
      alert("Please select a user profile.");
      return;
    }
    await this.createUser(username, password, userProfile.toUpperCase());
  };

  // Shared methods
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleClickOutside = (event) => {
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ dropdownOpen: false });
    }
  };

  // UI Rendering methods
  renderLogin() {
    const { loginUsername, loginPassword, loginError, isLoading } = this.state;

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
  
  renderUserList() {
    const { filteredUsers, loading } = this.state;
    
    if (loading) {
      return <div className="loading">Loading users...</div>;
    }
    
    return (
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Type</th>
              <th>Email</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className={user.status === 'Suspended' ? 'suspended-row' : ''}>
                  <td>{user.username}</td>
                  <td>{user.userProfile}</td>
                  <td>{user.email}</td>
                  <td>{user.status}</td>
                  <td>
                    <button 
                      className="view-details-button"
                      onClick={() => this.selectUser(user)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  renderUserDetails() {
    const { selectedUser } = this.state;
    
    if (!selectedUser) return null;
    
    return (
      <div className="user-details-container">
        <h3>User Details:</h3>
        <div className="user-details">
          <p><strong>Username:</strong> {selectedUser.username}</p>
          <p><strong>User Profile:</strong> {selectedUser.userProfile}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Status:</strong> {selectedUser.status}</p>
        </div>
        <div className="user-actions">
          <button onClick={this.getEditInputs} className="edit-button">
            Edit User
          </button>
          <button 
            onClick={this.confirmSuspend} 
            className={selectedUser.status === 'Active' ? 'suspend-button' : 'activate-button'}
          >
            {selectedUser.status === 'Active' ? 'Suspend User' : 'Activate User'}
          </button>
        </div>
      </div>
    );
  }

  renderEditModal() {
    if (!this.state.showEditModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="edit-modal">
          <h2>Edit User Account Details</h2>
          <form onSubmit={this.handleSaveChanges} className="edit-user-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                name="username"
                value={this.state.editFormData.username}
                onChange={this.handleEditFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="userProfile">Account Type</label>
              <input 
                type="text" 
                id="userProfile"
                name="userProfile"
                value={this.state.editFormData.userProfile}
                onChange={this.handleEditFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email"
                name="email"
                value={this.state.editFormData.email}
                onChange={this.handleEditFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <input 
                type="text" 
                id="status"
                name="status"
                value={this.state.editFormData.status}
                onChange={this.handleEditFormChange}
                required
              />
            </div>
            
            <div className="edit-buttons">
              <button type="submit" className="save-button">Save Changes</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={this.handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  renderManageUsers() {
    const { searchTerm } = this.state;
    
    return (
      <div className="manage-users-container">
        <h2 className="page-title">Manage Users</h2>
        
        {/* Search form - always visible */}
        <form onSubmit={this.handleSearchSubmit} className="search-form">
          <div className="search-group">
            <label htmlFor="searchTerm">Search user:</label>
            <input 
              type="text" 
              id="searchTerm"
              name="searchTerm"
              value={searchTerm}
              onChange={this.handleInputChange}
              placeholder="Enter username or email"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>
        
        {this.renderUserList()}
        {this.renderUserDetails()}
        {this.renderEditModal()}
      </div>
    );
  }

  renderCreateUser() {
    const { newUser, dropdownOpen, response } = this.state;
    
    return (
      <div className="create-user-container">
        <h2 className="page-title">Create User Account</h2>
        
        <form onSubmit={this.handleCreateUserSubmit} className="create-user-form">
          <div className="form-group">
            <label htmlFor="new-username">Username:</label>
            <input 
              type="text" 
              id="new-username"
              name="username"
              value={newUser.username}
              onChange={this.handleNewUserInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password"
              name="password"
              value={newUser.password}
              onChange={this.handleNewUserInputChange}
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
                <span>{newUser.userProfile || "User Profile"}</span>
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

        {response && !this.state.message && (
          <div className="success">
            <p>User created successfully!</p>
            <p>Username: {response.username}</p>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { message, error, activeTab } = this.state;
    
    // Check explicitly for isAuthenticated being true
    if (this.props.isAuthenticated !== true) {
      return this.renderLogin();
    }
    
    // If authenticated, show admin UI with the appropriate tab
    return (
      <div className="user-admin-ui-container">
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {error && !message && <div className="error-message">{error}</div>}
        
        {activeTab === 'manage' ? this.renderManageUsers() : this.renderCreateUser()}
      </div>
    );
  }
}

export default UserAdminUI;