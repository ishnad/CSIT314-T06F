import React, { Component } from 'react';
import renderingMethods from './UserAdminUI.render';
import '../UserAdminUI.css';

class UserAdminUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      editDropdownOpen: false,
      statusDropdownOpen: false,

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
      return data;

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

      // On success, the API returns true
      const createdProfileName = profileName; // Store before clearing
      this.setState({
        profileName: '',
        permissions: { 
          MANAGE_SERVICES: false,
          ADMIN_PRIVILEGES: false,
          SEARCH_CLEANERS: false,
          VIEW_REPORTS: false
        },
        profileMessage: {
          text: `Profile "${createdProfileName}" created successfully!`,
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
        body: JSON.stringify({ name, permissions: permissionsArray }), 
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      // Backend returns true, not the updated object.
      // We need to refresh the profiles list and update selectedProfile manually.
      this.setState({
        message: {
          text: `Profile ${name} updated successfully!`, // Use name from input
          type: 'success'
        },
        showProfileEditModal: false
      });
      
      const updatedProfilesList = await this.getAllProfiles(); // Re-fetch all profiles and get the list

      // After re-fetching, try to find and set the updated selectedProfile
      // Use the directly returned list for finding the profile
      if (updatedProfilesList) {
        const freshlyFetchedProfile = updatedProfilesList.find(p => p.id === profileId);
        if (freshlyFetchedProfile) {
          this.setState({ selectedProfile: freshlyFetchedProfile });
        } else {
          this.setState({ selectedProfile: null }); // Profile might have been deleted
        }
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

        // Optimistically update selectedProfile with the new status
        // This will make the UI reflect the change immediately
        const optimisticallyUpdatedProfile = {
          ...selectedProfile, // Spread existing selectedProfile data
          status: newStatus   // Apply the new status
        };

        this.setState({
          selectedProfile: optimisticallyUpdatedProfile, // Update selectedProfile first
          message: {
            text: `Profile ${optimisticallyUpdatedProfile.name} status updated to ${newStatus}`,
            type: 'success'
          }
        });

        // Now, refresh the entire list and ensure selectedProfile is fully up-to-date
        // from the server, in case other details changed or for general consistency.
        const updatedProfilesList = await this.getAllProfiles();

        // After re-fetching, ensure selectedProfile in state is the one from the (now updated) profiles list
        // Use the directly returned list for finding the profile
        if (updatedProfilesList) {
            const freshlyFetchedProfile = updatedProfilesList.find(p => p.id === profileId);
            if (freshlyFetchedProfile) {
              // This second setState for selectedProfile ensures it has all fields from the server
              this.setState({ selectedProfile: freshlyFetchedProfile });
            } else {
              // Profile might have been deleted by another admin in the meantime,
              // or if the optimistic update was for a profile that got filtered out by getAllProfiles.
              // If it's not in the main list, it shouldn't be selected.
              this.setState({ selectedProfile: null });
            }
        } else {
            // If getAllProfiles failed, selectedProfile might be stale but UI showed optimistic update.
            console.error("Failed to reconcile profile list after status toggle.");
        }

      } catch (apiError) {
        console.error("Error toggling profile status API call:", apiError);
        this.setState({
          message: {
            text: `Error updating profile status: ${apiError.message}`,
            type: 'error'
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
      return data;

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
    e.preventDefault();
    const { selectedUser, editFormData } = this.state;
    if (!selectedUser) return;

    // Input validation
    if (!editFormData.username || editFormData.username.trim().length < 3) {
      this.setState({
        error: "Username must be at least 3 characters",
        message: {
          text: "Username must be at least 3 characters",
          type: "error"
        }
      });
      return;
    }

    if (!editFormData.userProfile) {
      this.setState({
        error: "User profile is required",
        message: {
          text: "Please select a user profile",
          type: "error"
        }
      });
      return;
    }

    if (!editFormData.email || !editFormData.email.includes('@')) {
      this.setState({
        error: "Valid email is required",
        message: {
          text: "Please enter a valid email address",
          type: "error"
        }
      });
      return;
    }

    if (!editFormData.status) {
      this.setState({
        error: "Status is required",
        message: {
          text: "Please select a status",
          type: "error"
        }
      });
      return;
    }

    try {
      // Backend expects PUT /api/users and identifies user by ID
      // Backend expects 'userProfileName'
      const payload = {
        id: selectedUser.id,
        username: editFormData.username,
        userProfileName: editFormData.userProfile,
        email: editFormData.email,
        status: editFormData.status.toUpperCase() // Ensure status is uppercase to match enum
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

      // Instead of mapping manually, we'll re-fetch and then find the user
      // This ensures consistency if the backend returns slightly different structure
      // or if other fields were updated by the backend.
      this.setState({
        showEditModal: false,
        message: {
          text: `User ${editFormData.username} updated successfully!`, // Use username from form data for message
          type: 'success'
        }
      });

      const freshUsersList = await this.getAllUsers();
      if (freshUsersList) {
        const freshlyUpdatedUser = freshUsersList.find(u => u.id === selectedUser.id);
        if (freshlyUpdatedUser) {
          this.setState({ selectedUser: freshlyUpdatedUser });
        } else {
          this.setState({ selectedUser: null }); // User might have been deleted
        }
      }

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
      
      // Optimistically update selectedUser
      const optimisticallyUpdatedUser = {
        ...selectedUser,
        status: data.status // Use status from backend response for the optimistic update
      };

      this.setState({
        selectedUser: optimisticallyUpdatedUser, // Update selectedUser first
        message: {
          text: `User ${optimisticallyUpdatedUser.username} ${optimisticallyUpdatedUser.status === 'ACTIVE' ? 'activated' : 'suspended'} successfully!`,
          type: 'success'
        }
      });

      // Now, refresh the entire list and ensure selectedUser is fully up-to-date
      const freshUsersList = await this.getAllUsers();
      if (freshUsersList) {
        const freshlyUpdatedUser = freshUsersList.find(u => u.id === selectedUser.id);
        if (freshlyUpdatedUser) {
          this.setState({ selectedUser: freshlyUpdatedUser });
        } else {
          this.setState({ selectedUser: null });
        }
      } else {
        console.error("Failed to reconcile user list after status toggle.");
      }

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

  // Handles changes in the profile edit modal form fields (e.g., name)
  handleProfileEditFormChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editProfileFormData: {
        ...prevState.editProfileFormData,
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
    const { username, password, email, userProfile } = this.state.newUser;

    // Input validation
    if (!username || username.trim().length < 3) {
      this.setState({
        error: "Username must be at least 3 characters",
        message: {
          text: "Username must be at least 3 characters",
          type: "error"
        }
      });
      return;
    }

    if (!password || password.length < 6) {
      this.setState({
        error: "Password must be at least 6 characters",
        message: {
          text: "Password must be at least 6 characters",
          type: "error"
        }
      });
      return;
    }

    if (!email || !email.includes('@')) {
      this.setState({
        error: "Valid email is required",
        message: {
          text: "Please enter a valid email address",
          type: "error"
        }
      });
      return;
    }

    if (!userProfile) {
      this.setState({
        error: "User profile is required",
        message: {
          text: "Please select a user profile",
          type: "error"
        }
      });
      return;
    }

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

    if (!editProfileFormData.name || editProfileFormData.name.trim() === '') {
      this.setState({
        message: {
          text: "Profile name cannot be empty.",
          type: "error"
        }
      });
      setTimeout(() => this.setState({ message: null }), 3000);
      return;
    }

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
    // Ensure selectedProfile.permissions is an array before calling .includes
    const permissionsArray = Array.isArray(selectedProfile.permissions) ? selectedProfile.permissions : [];
    const permissionsObject = {
      MANAGE_SERVICES: permissionsArray.includes('MANAGE_SERVICES'),
      ADMIN_PRIVILEGES: permissionsArray.includes('ADMIN_PRIVILEGES'),
      SEARCH_CLEANERS: permissionsArray.includes('SEARCH_CLEANERS'),
      VIEW_REPORTS: permissionsArray.includes('VIEW_REPORTS')
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

    // UserAdminUI should only be rendered when authenticated, as per App.js logic.
    // If somehow rendered without authentication, show a fallback.
    if (this.props.isAuthenticated !== true) {
      return (
        <div className="user-admin-ui-container">
          <p>Loading or not authenticated...</p>
        </div>
      );
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
