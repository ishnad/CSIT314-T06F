import React from 'react';

// This object holds all the rendering methods.
// They will be bound to the UserAdminUI component instance in its constructor.
// Therefore, they can access `this.state`, `this.props`, and other component methods.
const renderingMethods = {
  renderLogin() {
    const { loginUsername, loginPassword, loginError, isLoading } = this.state;

    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
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
  },

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
  },

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
            // Compare against uppercase 'ACTIVE' from backend enum
            className={selectedUser.status === 'ACTIVE' ? 'suspend-button' : 'activate-button'}
          >
            {/* Compare against uppercase 'ACTIVE' but display title-case */}
            {selectedUser.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
          </button>
        </div>
      </div>
    );
  },

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
              <label>Account Type</label>
              <div className="dropdown-container">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() => this.setState({ editDropdownOpen: !this.state.editDropdownOpen })}
                >
                  <span>{this.state.editFormData.userProfile || "Select Profile"}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {this.state.editDropdownOpen && (
                  <div className="dropdown-menu">
                    {this.state.profiles.length > 0 ? (
                      this.state.profiles.map(profile => (
                        <div
                          key={profile.id}
                          className="dropdown-item"
                          onClick={() => {
                            this.setState(prevState => ({
                              editFormData: {
                                ...prevState.editFormData,
                                userProfile: profile.name
                              },
                              editDropdownOpen: false
                            }));
                          }}
                        >
                          {profile.name}
                        </div>
                      ))
                    ) : (
                      <div className="dropdown-item disabled">Loading profiles...</div>
                    )}
                  </div>
                )}
              </div>
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
              <label>Status</label>
              <div className="dropdown-container">
                <button
                  type="button"
                  className="dropdown-button"
                  onClick={() => this.setState({ statusDropdownOpen: !this.state.statusDropdownOpen })}
                >
                  <span>{this.state.editFormData.status || "Select Status"}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {this.state.statusDropdownOpen && (
                  <div className="dropdown-menu">
                    {['Active', 'Suspended'].map(status => (
                      <div
                        key={status}
                        className="dropdown-item"
                        onClick={() => {
                          this.setState(prevState => ({
                            editFormData: {
                              ...prevState.editFormData,
                              status
                            },
                            statusDropdownOpen: false
                          }));
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
  },

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
  },

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
            <label htmlFor="new-email">Email:</label>
            <input
              type="email"
              id="new-email"
              name="email"
              value={newUser.email}
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
                  {/* Dynamically list profiles from state */}
                  {this.state.profiles.length > 0 ? (
                    this.state.profiles.map(profile => (
                      <div
                        key={profile.id}
                        className="dropdown-item"
                        onClick={() => this.selectUserProfile(profile.name)}
                      >
                        {profile.name}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item disabled">Loading profiles...</div>
                  )}
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
  },

  renderCreateUserProfile() {
    const { profileName, permissions, profileMessage } = this.state;

    return (
      <div className="create-profile-container">
        <h2 className="page-title">Create New User Profile</h2>

        {profileMessage && (
          <div className={`message ${profileMessage.type}`}>
            {profileMessage.text}
          </div>
        )}

        <form onSubmit={this.handleCreateProfile} className="create-profile-form">
          <div className="form-group">
            <label htmlFor="profileName">New Profile:</label>
            <input
              type="text"
              id="profileName"
              name="profileName"
              value={profileName}
              onChange={this.handleProfileNameChange}
              required
            />
          </div>

          <div className="permissions-container">
            <div className="permissions-label">Access<br />Permissions:</div>

            <div className="permissions-options">
              <div className="permission-option">
                <input
                  type="checkbox"
                  id="MANAGE_SERVICES"
                  name="MANAGE_SERVICES" // Use backend enum name
                  checked={permissions.MANAGE_SERVICES}
                  onChange={this.handlePermissionChange}
                />
                <label htmlFor="MANAGE_SERVICES">Manage Services</label>
              </div>

              <div className="permission-option">
                <input
                  type="checkbox"
                  id="ADMIN_PRIVILEGES"
                  name="ADMIN_PRIVILEGES" // Use backend enum name
                  checked={permissions.ADMIN_PRIVILEGES}
                  onChange={this.handlePermissionChange}
                />
                <label htmlFor="ADMIN_PRIVILEGES">Admin Privileges</label>
              </div>

              <div className="permission-option">
                <input
                  type="checkbox"
                  id="SEARCH_CLEANERS"
                  name="SEARCH_CLEANERS" // Use backend enum name
                  checked={permissions.SEARCH_CLEANERS}
                  onChange={this.handlePermissionChange}
                />
                <label htmlFor="SEARCH_CLEANERS">Search Cleaners</label>
              </div>

              <div className="permission-option">
                <input
                  type="checkbox"
                  id="VIEW_REPORTS"
                  name="VIEW_REPORTS" // Use backend enum name
                  checked={permissions.VIEW_REPORTS}
                  onChange={this.handlePermissionChange}
                />
                <label htmlFor="VIEW_REPORTS">View Reports</label>
              </div>
            </div>
          </div>

          <div className="profile-buttons">
            <button type="submit" className="create-button">
              Create Profile
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={this.handleCancelProfile}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  },

  renderManageProfiles() {
    const { filteredProfiles, profileSearchTerm, profilesLoading } = this.state;
    
    return (
      <div className="manage-profiles-container">
        <h2 className="page-title">Manage User Profiles</h2>
        
        {/* Search form */}
        <form onSubmit={this.handleProfileSearchSubmit} className="search-form">
          <div className="profile-search-group">
            <label htmlFor="profileSearchTerm">Search:</label>
            <input 
              type="text" 
              id="profileSearchTerm"
              name="profileSearchTerm"
              value={profileSearchTerm}
              onChange={this.handleProfileSearchChange}
              placeholder="Search profiles"
              className="profile-search-input"
            />
            <button type="submit" className="filter-button">
              Filter
            </button>
          </div>
        </form>
        
        {/* Profiles table */}
        {profilesLoading ? (
          <div className="loading">Loading profiles...</div>
        ) : (
          <div className="profiles-table-container">
            <table className="profiles-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Number</th>
                  <th>Status</th>
                  <th></th> {/* For View button */}
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <tr 
                      key={profile.id || profile.name} 
                      className={profile.status === 'SUSPENDED' ? 'suspended-row' : ''}
                    >
                      <td>{profile.name}</td>
                      <td>{profile.userAccountCount !== undefined ? profile.userAccountCount : 0}</td>
                      <td>
                        <span className={`status-badge ${profile.status === 'ACTIVE' ? 'active' : 'suspended'}`}>
                          {profile.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="view-profile-button"
                          onClick={(e) => {
                            // Stop propagation to prevent any parent handlers
                            e.stopPropagation();
                            // Only view the profile, don't change status
                            this.viewProfileDetails(profile.id || profile.name);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-profiles">No profiles found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Profile details - shown when a profile is selected */}
        {this.renderProfileDetails()}
        
        {/* Profile edit modal */}
        {this.renderProfileEditModal && this.renderProfileEditModal()}
        
        {/* Add New User Profile button */}
        <div className="add-profile-button-container">
          <button 
            className="add-profile-button"
            onClick={this.navigateToAddProfile}
          >
            Add New User Profile
          </button>
        </div>
      </div>
    );
  },

  renderProfileDetails() {
    const { selectedProfile } = this.state;
    
    if (!selectedProfile) return null;
    
    // Convert permissions array from backend to an object for easy checking in JSX
    // Ensure selectedProfile.permissions is an array before calling .includes
    const permissionsArray = Array.isArray(selectedProfile.permissions) ? selectedProfile.permissions : [];
    const currentPermissions = {
      MANAGE_SERVICES: permissionsArray.includes('MANAGE_SERVICES'),
      ADMIN_PRIVILEGES: permissionsArray.includes('ADMIN_PRIVILEGES'),
      SEARCH_CLEANERS: permissionsArray.includes('SEARCH_CLEANERS'),
      VIEW_REPORTS: permissionsArray.includes('VIEW_REPORTS'),
    };
    
    // Check if status exists, default to ACTIVE if not
    const status = selectedProfile.status || 'ACTIVE';
    const userAccountCount = selectedProfile.userAccountCount !== undefined ? selectedProfile.userAccountCount : 'N/A';
    
    return (
      <div className="profile-details-container">
        <h3>Profile Details: {selectedProfile.name}</h3>
        
        <div className="profile-status">
          <strong>Status:</strong>
          <span className={`status-badge ${status === 'ACTIVE' ? 'active' : 'suspended'}`}>
            {status === 'ACTIVE' ? 'Active' : 'Suspended'}
          </span>
        </div>
        
        <div className="profile-details">
          <h4>Permissions:</h4>
          <ul className="permissions-list">
            <li className={currentPermissions.MANAGE_SERVICES ? 'enabled' : 'disabled'}>
              <span className="permission-icon">
                {currentPermissions.MANAGE_SERVICES ? '✓' : '✗'}
              </span>
              <span className="permission-name">Manage Services</span>
            </li>
            <li className={currentPermissions.ADMIN_PRIVILEGES ? 'enabled' : 'disabled'}>
              <span className="permission-icon">
                {currentPermissions.ADMIN_PRIVILEGES ? '✓' : '✗'}
              </span>
              <span className="permission-name">Admin Privileges</span>
            </li>
            <li className={currentPermissions.SEARCH_CLEANERS ? 'enabled' : 'disabled'}>
              <span className="permission-icon">
                {currentPermissions.SEARCH_CLEANERS ? '✓' : '✗'}
              </span>
              <span className="permission-name">Search Cleaners</span>
            </li>
            <li className={currentPermissions.VIEW_REPORTS ? 'enabled' : 'disabled'}>
              <span className="permission-icon">
                {currentPermissions.VIEW_REPORTS ? '✓' : '✗'}
              </span>
              <span className="permission-name">View Reports</span>
            </li>
          </ul>
        </div>
        <div className="profile-actions">
          <button 
            className="edit-button"
            onClick={this.handleEditProfile}
          >
            Edit Profile
          </button>
          <button 
            className={status === 'ACTIVE' ? 'suspend-button' : 'activate-button'}
            onClick={this.handleToggleProfileStatus}
          >
            {selectedProfile.status === 'ACTIVE' ? 'Suspend Profile' : 'Activate Profile'}
          </button>
        </div>
      </div>
    );
  },

  renderProfileEditModal() {
    const { showProfileEditModal, editProfileFormData } = this.state;

    if (!showProfileEditModal) return null;

    return (
      <div className="modal-overlay">
        <div className="edit-modal profile-edit-modal">
          <h2>Edit User Profile</h2>
          <form onSubmit={this.handleSaveProfileChanges} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="name">Profile Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editProfileFormData.name}
                onChange={this.handleProfileEditFormChange}
                required
              />
            </div>

            <div className="form-group permission-edit-group">
              <label>Permissions</label>
              <div className="edit-permissions-list">
                <div className="edit-permission-option">
                  <input
                    type="checkbox"
                    id="edit-MANAGE_SERVICES"
                    name="MANAGE_SERVICES" // Use backend enum name
                    checked={editProfileFormData.permissions.MANAGE_SERVICES}
                    onChange={this.handleProfilePermissionChange}
                  />
                  <label htmlFor="edit-MANAGE_SERVICES">Manage Services</label>
                </div>

                <div className="edit-permission-option">
                  <input
                    type="checkbox"
                    id="edit-ADMIN_PRIVILEGES"
                    name="ADMIN_PRIVILEGES" // Use backend enum name
                    checked={editProfileFormData.permissions.ADMIN_PRIVILEGES}
                    onChange={this.handleProfilePermissionChange}
                  />
                  <label htmlFor="edit-ADMIN_PRIVILEGES">Admin Privileges</label>
                </div>

                <div className="edit-permission-option">
                  <input
                    type="checkbox"
                    id="edit-SEARCH_CLEANERS"
                    name="SEARCH_CLEANERS" // Use backend enum name
                    checked={editProfileFormData.permissions.SEARCH_CLEANERS}
                    onChange={this.handleProfilePermissionChange}
                  />
                  <label htmlFor="edit-SEARCH_CLEANERS">Search Cleaners</label>
                </div>

                 <div className="edit-permission-option">
                  <input
                    type="checkbox"
                    id="edit-VIEW_REPORTS"
                    name="VIEW_REPORTS" // Use backend enum name
                    checked={editProfileFormData.permissions.VIEW_REPORTS}
                    onChange={this.handleProfilePermissionChange}
                  />
                  <label htmlFor="edit-VIEW_REPORTS">View Reports</label>
                </div>
              </div>
            </div>

            <div className="edit-buttons">
              <button type="submit" className="save-button">Save Changes</button>
              <button
                type="button"
                className="cancel-button"
                onClick={this.handleCancelProfileEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default renderingMethods;
