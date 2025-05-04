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

      const data = await res.json();

      // Update state with success message and reset form
      this.setState({
        profileName: '',
        permissions: { // Reset permissions object
          MANAGE_SERVICES: false,
          ADMIN_PRIVILEGES: false,
          SEARCH_CLEANERS: false,
          VIEW_REPORTS: false
        },
        profileMessage: {
          text: `Profile "${data.profile.name}" created successfully!`, // Use name from response
          type: "success"
        }
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ profileMessage: null });
      }, 3000);

      // Refresh the profiles list
      this.getAllProfiles();

      return data;

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

      const data = await res.json();

      // Refresh the profiles list and update the selected profile
      await this.getAllProfiles();

      // Find the updated profile in the refreshed list
      const updatedProfile = this.state.profiles.find(profile => profile.id === profileId);

      // Update the selected profile if found
      if (updatedProfile) {
        this.setState({ selectedProfile: updatedProfile });
      }

      // Show success message
      this.setState({
        message: {
          text: `Profile ${data.profile.name} updated successfully!`, // Use name from response
          type: 'success'
        },
        showProfileEditModal: false
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);

      return data;

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

  // Delete profile
  deleteUserProfile = async (profileId) => {
    try {
      // Call the API to delete the profile
      const res = await fetch(`http://localhost:3001/api/profiles/${profileId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      // Refresh the profiles list
      await this.getAllProfiles();

      // Clear the selected profile
      this.setState({
        selectedProfile: null,
        message: {
          text: 'Profile deleted successfully!',
          type: 'success'
        }
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);

    } catch (err) {
      this.setState({
        message: {
          text: `Error deleting profile: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);

      throw err;
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

  handleDeleteProfile = async () => {
    const { selectedProfile } = this.state;
    if (!selectedProfile) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the "${selectedProfile.name}" profile? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      // Delete the profile via API
      await this.deleteUserProfile(selectedProfile.id);

    } catch (err) {
      // Error is handled in the deleteUserProfile method
      console.error("Failed to delete profile:", err);
    }
  };

  // ManageProfiles methods
  searchProfiles = (keyword) => {
    if (!keyword.trim()) {
      this.setState({ filteredProfiles: this.state.profiles });
      return;
    }

    const filtered = this.state.profiles.filter(profile =>
      profile.name.toLowerCase().includes(keyword.toLowerCase())
    );

    this.setState({
      filteredProfiles: filtered,
      message: filtered.length === 0 ? {
        text: "No profiles found matching your search criteria",
        type: "info"
      } : null
    });
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

  // Updated to work with API data and better error handling
  // Use this as a temporary fallback when the backend is not available
  viewProfileDetails = async (profileId) => {
    try {
      this.setState({ profilesLoading: true });

      // Try to call the API
      try {
        const res = await fetch(`http://localhost:3001/api/profiles/${profileId}`);

        if (res.ok) {
          const profileData = await res.json();

          // Ensure permissions object exists
          // Backend sends permissions as an array, keep it as is
          // The details view and edit modal will handle the array/object conversion

          this.setState({
            selectedProfile: profileData,
            profilesLoading: false
          });
          return;
        }
      } catch (apiError) {
        console.warn("API error, falling back to mock data:", apiError);
        // Continue to fallback if API fails
      }

      // FALLBACK: Find the profile in the current list (for demo purposes)
      const profile = this.state.profiles.find(p => p.id === profileId || p.name === profileId);

      if (profile) {
        // Backend sends permissions as an array, keep it as is
        // The details view and edit modal will handle the array/object conversion

        // Use the profile from state as a fallback
        this.setState({
          selectedProfile: profile,
          profilesLoading: false
        });
      } else {
        // Create mock data as last resort
        const mockProfile = {
          id: profileId,
          name: typeof profileId === 'string' ? profileId : `Profile ${profileId}`,
          userCount: Math.floor(Math.random() * 10) + 1,
          // Mock permissions as an array for fallback consistency
          permissions: [
            ...(Math.random() > 0.5 ? ['MANAGE_SERVICES'] : []),
            ...(Math.random() > 0.7 ? ['ADMIN_PRIVILEGES'] : []),
            ...(Math.random() > 0.3 ? ['SEARCH_CLEANERS'] : []),
            ...(Math.random() > 0.4 ? ['VIEW_REPORTS'] : [])
          ]
        };

        this.setState({
          selectedProfile: mockProfile,
          profilesLoading: false,
          message: {
            text: "Using mock data - backend API not available",
            type: "warning"
          }
        });

        setTimeout(() => {
          this.setState({ message: null });
        }, 3000);
      }
    } catch (err) {
      this.setState({
        profileError: err.message,
        profilesLoading: false,
        message: {
          text: `Error loading profile details: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
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