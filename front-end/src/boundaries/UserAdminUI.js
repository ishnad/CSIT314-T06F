import React, { Component } from 'react';
import renderingMethods from './UserAdminUI.render';
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
      currentUser: null,

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
        email: '',
        userProfile: '',
      },
      response: null,
      dropdownOpen: false,
      message: null,

      // CreateUserProfile state
      profileName: '',
      permissions: { // Corresponds to backend Permission enum
        MANAGE_SERVICES: false,
        ADMIN_PRIVILEGES: false,
        SEARCH_CLEANERS: false,
        VIEW_REPORTS: false
      },
      profileMessage: null,

      // ManageProfiles state
      profiles: [],
      filteredProfiles: [],
      profileSearchTerm: '',
      profilesLoading: false,
      selectedProfile: null,
      profileError: null,

      // Profile Edit Modal state
      showProfileEditModal: false,
      editProfileFormData: {
        name: '',
        permissions: { // Corresponds to backend Permission enum
          MANAGE_SERVICES: false,
          ADMIN_PRIVILEGES: false,
          SEARCH_CLEANERS: false,
          VIEW_REPORTS: false
        }
      },

      // Tab management
      activeTab: props.initialTab || 'manage' // 'manage', 'create', 'profile', or 'manageProfiles'
    };

    this.dropdownRef = React.createRef();

    // Bind rendering methods from the imported object to this instance
    for (const methodName in renderingMethods) {
      if (renderingMethods.hasOwnProperty(methodName)) {
        this[methodName] = renderingMethods[methodName].bind(this);
      }
    }
  }

  // Add this method to refresh data based on the active tab
  refreshActiveTabData = () => {
    const { activeTab } = this.state;

    switch (activeTab) {
      case 'manage':
        this.getAllUsers();
        break;
      case 'manageProfiles':
        this.getAllProfiles();
        break;
      default:
        // Other tabs don't need refresh
        break;
    }
  };

  componentDidMount() {
    // If authenticated, load users
    if (this.props.isAuthenticated) {
      this.getAllUsers();
      this.getAllProfiles();
    } else {
      // If not authenticated, pre-fill login form for convenience
      this.setState({
        loginUsername: 'admin',
        loginPassword: 'admin123'
      });
    }

    // Add event listener for dropdown
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  // Update active tab if initialTab prop changes
  componentDidUpdate(prevProps) {
    // Load users and profiles if user becomes authenticated
    if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
      this.getAllUsers();
      this.getAllProfiles();
    }

    // Update active tab if initialTab prop changes
    if (this.props.initialTab !== prevProps.initialTab && this.props.initialTab) {
      this.setState({ activeTab: this.props.initialTab });

      // If switching to manage profiles tab, refresh the profiles
      if (this.props.initialTab === 'manageProfiles' && prevProps.initialTab !== 'manageProfiles') {
        this.getAllProfiles();
      }
    }
  }

  // Login methods
  handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // In UserAdminUI.js, modify the handleLoginSubmit method:
handleLoginSubmit = async (e) => {
  e.preventDefault();
  this.setState({ isLoading: true, loginError: '' });

  const { loginUsername, loginPassword } = this.state;

  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        username: loginUsername, 
        password: loginPassword 
      }),
    });
      
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Login successful
    this.setState({ 
      loginUsername: '',
      loginPassword: '',
      loginError: null,
      isLoading: false,
      currentUser: data.user,
      activeTab: 'manage'
    });
      
    // Call the onLogin prop if it exists
    if (this.props.onLogin) {
      this.props.onLogin(data.user.username, data.user);
    }

  } catch (error) {
    console.error('Login error:', error);
    this.setState({ 
      loginError: error.message || 'Login failed', 
      isLoading: false 
    });
  }
};


  // Get all profiles
  getAllProfiles = async () => {
    try {
      this.setState({ profilesLoading: true, profileError: null });

      // Call the API to get all profiles
      const res = await fetch('http://localhost:3001/api/profiles');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      this.setState({
        profiles: data,
        filteredProfiles: data,
        profilesLoading: false
      });

    } catch (err) {
      this.setState({
        profileError: err.message,
        profilesLoading: false,
        message: {
          text: `Error loading profiles: ${err.message}`,
          type: 'error'
        }
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Search profiles
  searchProfiles = async (keyword) => {
    if (!keyword.trim()) {
      this.setState({ filteredProfiles: this.state.profiles });
      return;
    }

    try {
      this.setState({ profilesLoading: true });

      // Call the API to search profiles
      const res = await fetch(`http://localhost:3001/api/profiles/search?keyword=${keyword}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Handle backend message for no profiles found
      const profiles = data.message ? [] : data; // If message exists, it means no profiles found

      this.setState({
        filteredProfiles: profiles,
        profilesLoading: false,
        message: data.message ? { // Display backend message if present
          text: data.message,
          type: "info"
        } : (profiles.length === 0 ? { // Fallback message if no profiles and no backend message
          text: "No profiles found matching your search criteria",
          type: "info"
        } : null)
      });

    } catch (err) {
      this.setState({
        profileError: err.message,
        profilesLoading: false,
        message: {
          text: `Error searching profiles: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Create new profile
  createUserProfile = async (profileName, permissions) => {
    try {
      // Convert permissions object back to array of strings for API call
      const permissionsArray = Object.entries(permissions)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      // Call the API to create a new profile
      const res = await fetch('http://localhost:3001/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileName,
          permissions: permissionsArray // Send the array
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      // On success, the API returns true - use the profileName from state since we know it succeeded
      this.setState({
        profileName: '',
        permissions: { // Reset permissions object
          MANAGE_SERVICES: false,
          ADMIN_PRIVILEGES: false,
          SEARCH_CLEANERS: false,
          VIEW_REPORTS: false
        },
        profileMessage: {
          text: `Profile "${profileName}" created successfully!`,
          type: "success"
        }
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ profileMessage: null });
      }, 3000);

      // Refresh the profiles list
      this.getAllProfiles();

      return true;

    } catch (err) {
      this.setState({
        profileMessage: {
          text: `Error creating profile: ${err.message}`,
          type: "error"
        }
      });

      setTimeout(() => {
        this.setState({ profileMessage: null });
      }, 3000);

      throw err;
    }
  };

  // Edit profile
  editUserProfile = async (profileId, { name, permissions }) => {
    try {
      // Convert permissions object back to array of strings for API call
      const permissionsArray = Object.entries(permissions)
        .filter(([key, value]) => value)
        .map(([key]) => key);

      // Call the API to update the profile
      const res = await fetch(`http://localhost:3001/api/profiles/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, permissions: permissionsArray }), // Send name and permissions array
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      // On success, the API returns true - use the name from edit form since we know it succeeded
      await this.getAllProfiles();

      // Find the updated profile in the refreshed list
      const updatedProfile = this.state.profiles.find(profile => profile.id === profileId);

      // Update the selected profile if found
      if (updatedProfile) {
        this.setState({ 
          selectedProfile: updatedProfile,
          message: {
            text: `Profile ${updatedProfile.name} updated successfully!`,
            type: 'success'
          },
          showProfileEditModal: false
        });
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);

      return true;

    } catch (err) {
      this.setState({
        message: {
          text: `Error updating profile: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);

      throw err;
    }
  };

  toggleProfileStatus = async () => {
    try {
      const { selectedProfile } = this.state;
      if (!selectedProfile || !selectedProfile.id) {
        throw new Error("No profile selected or missing ID");
      }

      // Determine new status (opposite of current)
      const newStatus = selectedProfile.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      const profileId = selectedProfile.id;

      console.log(`Toggling status for profile ${profileId} from ${selectedProfile.status} to ${newStatus}`);

      // API call
      try {
        const res = await fetch(`http://localhost:3001/api/profiles/${profileId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }

        const responseData = await res.json(); // Backend returns { message, profile }

        // Update selected profile from response data
        this.setState({
          selectedProfile: responseData,
          message: {
            text: `Profile status updated to ${responseData.status}`,
            type: 'success'
          }
        });

        // Refresh profiles list
        this.getAllProfiles();

      } catch (apiError) {
        console.warn("API error, using fallback:", apiError);

        // Fallback if API fails: just update the state directly
        const updatedProfile = {
          ...selectedProfile,
          status: newStatus
        };

        // Update the profile in the profiles list
        const updatedProfiles = this.state.profiles.map(profile => {
          if (profile.id === selectedProfile.id || profile.name === selectedProfile.name) {
            return updatedProfile;
          }
          return profile;
        });

        // Update state
        this.setState({
          selectedProfile: updatedProfile,
          profiles: updatedProfiles,
          filteredProfiles: updatedProfiles, // Update filtered list too
          message: {
            text: `Profile ${selectedProfile.name} ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'} (local change only)`,
            type: 'warning'
          }
        });
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);

    } catch (err) {
      console.error("Error toggling profile status:", err);

      this.setState({
        message: {
          text: `Error updating profile status: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
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

      // Backend expects 'filter' and 'keyword'
      const res = await fetch(`http://localhost:3001/api/users/search?filter=username&keyword=${keyword}`);
      const data = await res.json();

      // Handle backend message for no users found
      const users = data.message ? [] : data; // If message exists, it means no users found

      this.setState({
        filteredUsers: users,
        loading: false,
        message: data.message ? { // Display backend message if present
          text: data.message,
          type: "info"
        } : (users.length === 0 ? { // Fallback message if no users and no backend message
          text: "No users found matching your search criteria",
          type: "info"
        } : null)
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
    e.preventDefault(); // Ensure default form submission is prevented
    const { selectedUser, editFormData } = this.state;
    if (!selectedUser) return; // Should not happen if modal is open

    try {
      // Backend expects PUT /api/users and identifies user by ID
      // Backend expects 'userProfileName'
      const payload = {
        id: selectedUser.id, // Send the original user ID for identification
        username: editFormData.username, // Send potentially updated username
        userProfileName: editFormData.userProfile, // Send profile name with correct key
        email: editFormData.email,
        status: editFormData.status // Send status string (e.g., "Active")
      };

      const res = await fetch(`http://localhost:3001/api/users`, { // Use PUT /api/users endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) // Send payload
      });

      if (!res.ok) {
        // Handle non-2xx responses
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Contains the updated user data from backend

      // Update local state with the response from API
      // Backend returns { username, userProfile, email, status }
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

  // Using Edit User endpoint (PUT /api/users) to update status
  confirmSuspend = async () => {
    const { selectedUser } = this.state;
    if (!selectedUser) return;

    // Compare against uppercase 'ACTIVE' from backend enum
    // Set newStatus to the title-case string the backend expects for the update payload
    const newStatus = selectedUser.status === 'ACTIVE' ? 'Suspended' : 'Active';
    const actionVerb = newStatus === 'Suspended' ? 'suspend' : 'activate';

    const confirmAction = window.confirm(
      `Are you sure you want to ${actionVerb} ${selectedUser.username}?`
    );

    if (!confirmAction) return;

    try {
      // Prepare payload for the PUT /api/users endpoint
      // We need id, username, userProfileName, email, and the new status
      const payload = {
        id: selectedUser.id, // Send the user ID for identification
        username: selectedUser.username, // Keep username (backend might use it for checks or logging)
        userProfileName: selectedUser.userProfile, // Send current profile name
        email: selectedUser.email, // Send current email
        status: newStatus // Send the new status
      };

      const res = await fetch(`http://localhost:3001/api/users`, { // Use the edit endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Backend returns the updated user

      // Update local state
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
  createUser = async (username, password, userProfile, email) => {
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
          email,
          userProfileName: userProfile
        }),
      });

      if (!res.ok) {
        // Handle non-2xx responses specifically for create user
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json(); // Contains the created user data
      this.setState({
        response: data,
        message: {
          text: `User ${username} created successfully!`,
          type: 'success'
        },
        newUser: {
          username: '',
          password: '',
          email: '',
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
    const { username, password, email, userProfile } = this.state.newUser; // Include email
    if (!userProfile) {
      alert("Please select a user profile.");
      return;
    }
    if (!email || !email.includes('@')) { // Basic email validation
      alert("Please enter a valid email address.");
      return;
    }
    // Pass email to createUser
    await this.createUser(username, password, userProfile, email);
  };

  // CreateUserProfile methods
  handleProfileNameChange = (e) => {
    this.setState({ profileName: e.target.value });
  };

  handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    this.setState(prevState => ({
      permissions: {
        ...prevState.permissions,
        [name]: checked
      }
    }));
  };

  handleCreateProfile = async (e) => {
    e.preventDefault();
    const { profileName, permissions } = this.state;

    if (!profileName.trim()) {
      this.setState({
        profileMessage: {
          text: "Profile name is required",
          type: "error"
        }
      });
      return;
    }

    try {
      // Create the profile via API
      await this.createUserProfile(profileName, permissions);

    } catch (err) {
      // Error is handled in the createUserProfile method
      console.error("Failed to create profile:", err);
    }
  };

  handleCancelProfile = () => {
    this.setState({
      profileName: '',
      permissions: { // Reset permissions object
        MANAGE_SERVICES: false,
        ADMIN_PRIVILEGES: false,
        SEARCH_CLEANERS: false,
        VIEW_REPORTS: false
      }
    });

    // Switch back to manage users tab
    if (this.props.onNavigate) {
      this.props.onNavigate('manage');
    } else {
      this.setState({ activeTab: 'manage' });
    }
  };

  // Handle changes to permission checkboxes in the edit modal
  handleProfilePermissionChange = (e) => {
    const { name, checked } = e.target;
    this.setState(prevState => ({
      editProfileFormData: {
        ...prevState.editProfileFormData,
        permissions: {
          ...prevState.editProfileFormData.permissions,
          [name]: checked // Update the specific permission based on checkbox name
        }
      }
    }));
  };


  handleSaveProfileChanges = async (e) => {
    e.preventDefault();
    const { selectedProfile, editProfileFormData } = this.state;

    try {
      // Pass the name and permissions object to editUserProfile
      // editUserProfile will handle converting permissions to an array
      await this.editUserProfile(selectedProfile.id, {
        name: editProfileFormData.name,
        permissions: editProfileFormData.permissions // Pass the object
      });

    } catch (err) {
      // Error is handled in the editUserProfile method
      console.error("Failed to update profile:", err);
    }
  };

  handleToggleProfileStatus = (e) => {
    // Stop event propagation to make sure it doesn't trigger other handlers
    e.stopPropagation();

    const { selectedProfile } = this.state;
    if (!selectedProfile) return;

    const action = selectedProfile.status === 'ACTIVE' ? 'suspend' : 'activate';

    const confirmToggle = window.confirm(
      `Are you sure you want to ${action} the "${selectedProfile.name}" profile?`
    );

    if (confirmToggle) {
      this.toggleProfileStatus();
    }
  };

  handleProfileSearchChange = (e) => {
    this.setState({ profileSearchTerm: e.target.value });
  };

  handleProfileSearchSubmit = (e) => {
    e.preventDefault();
    this.searchProfiles(this.state.profileSearchTerm);
  };

  // Handle edit profile button click
  handleEditProfile = () => {
    const { selectedProfile } = this.state;
    if (!selectedProfile) return;

    // Convert incoming permissions array to object for checkboxes
    const permissionsObject = {
      MANAGE_SERVICES: selectedProfile.permissions.includes('MANAGE_SERVICES'),
      ADMIN_PRIVILEGES: selectedProfile.permissions.includes('ADMIN_PRIVILEGES'),
      SEARCH_CLEANERS: selectedProfile.permissions.includes('SEARCH_CLEANERS'),
      VIEW_REPORTS: selectedProfile.permissions.includes('VIEW_REPORTS')
    };

    // Set the edit form data with the selected profile data
    this.setState({
      editProfileFormData: {
        name: selectedProfile.name,
        permissions: permissionsObject // Use the converted object
      },
      showProfileEditModal: true
    });
  };

  // Handle cancel profile edit
  handleCancelProfileEdit = () => {
    this.setState({ showProfileEditModal: false });
  };

  navigateToAddProfile = () => {
    // Navigate to the Create Profile tab
    if (this.props.onNavigate) {
      this.props.onNavigate('profile');
    } else {
      this.setState({ activeTab: 'profile' });
    }
  };

  viewProfileDetails = (profileId) => { // No longer async, no fetch
    // Find the profile from the existing list in state
    // Prefer filteredProfiles if available, otherwise fall back to all profiles
    const profilesToSearch = this.state.filteredProfiles.length > 0 ? this.state.filteredProfiles : this.state.profiles;
    const profile = profilesToSearch.find(p => p.id === profileId);

    if (profile) {
      this.setState({
        selectedProfile: profile,
        profileError: null, // Clear any previous error
        profilesLoading: false // Ensure loading is false
      });
    } else {
      console.error(`Profile with ID ${profileId} not found in local state.`);
      this.setState({
        selectedProfile: null, // Clear selected profile if not found
        profileError: `Profile with ID ${profileId} not found. Please refresh the list.`,
        profilesLoading: false, // Ensure loading is false
        message: {
          text: `Error: Profile with ID ${profileId} not found. The list might be outdated.`,
          type: 'error'
        }
      });
      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null, profileError: null });
      }, 3000);
    }
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

  // main render method
  render() {
    const { message, error, activeTab } = this.state;

    // Check explicitly for isAuthenticated being true
    if (this.props.isAuthenticated !== true) {
      // If not authenticated, call the renderLogin method (bound from external file)
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

        {/* Call the appropriate bound render method based on the active tab */}
        {activeTab === 'manage'
          ? this.renderManageUsers()
          : activeTab === 'create'
            ? this.renderCreateUser()
            : activeTab === 'profile'
              ? this.renderCreateUserProfile()
              : this.renderManageProfiles()}
      </div>
    );
  }
}

export default UserAdminUI;
