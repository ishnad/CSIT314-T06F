import React, { Component } from 'react';
import '../ManageUsers.css';

class ManageUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      filteredUsers: [],
      searchTerm: '',
      loading: false,
      error: null,
      selectedUser: null,
      message: null,
      showEditModal: false,
      editFormData: {
        username: '',
        userProfile: '',
        email: '',
        status: ''
      }
    };
  }

  getAllUsers = async () => {
    try {
      this.setState({ loading: true, error: null });
      
      // In a real app, you would call your API
      // const res = await fetch('http://localhost:3001/api/users');
      // const data = await res.json();
      
      // For demo, use mock data
      const mockUsers = [
        { id: 1, username: 'user1', userProfile: 'CLEANER', email: 'user1@example.com', status: 'Active' },
        { id: 2, username: 'user2', userProfile: 'HOMEOWNER', email: 'user2@example.com', status: 'Active' },
        { id: 3, username: 'user3', userProfile: 'CLEANER', email: 'user3@example.com', status: 'Suspended' },
        { id: 4, username: 'admin', userProfile: 'ADMIN', email: 'admin@example.com', status: 'Active' }
      ];
      
      // Add delay to simulate network request
      setTimeout(() => {
        this.setState({
          users: mockUsers,
          filteredUsers: mockUsers,
          loading: false
        });
      }, 500);
      
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
      
      // In a real app, you would call your API with the search term
      // const res = await fetch(`http://localhost:3001/api/users/search?term=${keyword}`);
      // const data = await res.json();
      
      // For demo, filter existing users
      const results = this.state.users.filter(user => 
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase())
      );
      
      setTimeout(() => {
        this.setState({
          filteredUsers: results,
          loading: false,
          message: results.length === 0 ? {
            text: "No users found matching your search criteria",
            type: "info"
          } : null
        });
      }, 300);
      
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

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
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
      // In a real app, you would call your API
      // const res = await fetch(`http://localhost:3001/api/users/${selectedUser.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editFormData)
      // });
      // const data = await res.json();
      
      // For demo, update locally
      const updatedUsers = this.state.users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, ...editFormData };
        }
        return user;
      });
      
      const updatedFilteredUsers = this.state.filteredUsers.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, ...editFormData };
        }
        return user;
      });
      
      this.setState({
        users: updatedUsers,
        filteredUsers: updatedFilteredUsers,
        selectedUser: { ...selectedUser, ...editFormData },
        showEditModal: false,
        message: {
          text: `User ${editFormData.username} updated successfully!`,
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
      // In a real app, you would call your API
      // const res = await fetch(`http://localhost:3001/api/users/${selectedUser.id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ 
      //     status: selectedUser.status === 'Active' ? 'Suspended' : 'Active' 
      //   })
      // });
      
      // For demo, update locally
      const newStatus = selectedUser.status === 'Active' ? 'Suspended' : 'Active';
      
      const updatedUsers = this.state.users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, status: newStatus };
        }
        return user;
      });
      
      const updatedFilteredUsers = this.state.filteredUsers.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, status: newStatus };
        }
        return user;
      });
      
      this.setState({
        users: updatedUsers,
        filteredUsers: updatedFilteredUsers,
        selectedUser: { ...selectedUser, status: newStatus },
        message: {
          text: `User ${selectedUser.username} ${newStatus === 'Active' ? 'activated' : 'suspended'} successfully!`,
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

  componentDidMount() {
    // Load users initially
    this.getAllUsers();
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

  render() {
    const { searchTerm, message, error } = this.state;
    
    return (
      <div className="manage-users-container">
        <h2 className="page-title">Manage Users</h2>
        
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        {error && !message && <div className="error-message">{error}</div>}
        
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
}

export default ManageUsers;