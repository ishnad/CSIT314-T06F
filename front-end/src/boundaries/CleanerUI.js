import React, { Component } from 'react'; // Removed useState, useEffect
import renderingMethods from './CleanerUI.render';

class CleanerUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Insights State
      profileInsights: null,
      shortlistCount: null,
      insightsError: null,
      insightsLoading: false,

      // Create Listing State
      showCreateForm: false,
      newListing: {
        serviceType: 'Basic Cleaning',
        description: 'Describe your service',
        ratePerHr: 30.00
      },
      createListingError: null,
      createListingSuccess: null,
      isCreatingListing: false,

      // Service Listings State
      serviceListings: [],
      loadingListings: false,
      listingsError: null,
      selectedListingId: null,
      listingDetails: null,
      loadingDetails: false,
      detailsError: null,

      // Edit Listing State
      isEditingListing: false,
      editFormData: {
        serviceType: '',
        description: '',
        ratePerHr: '',
      },
      showEditModal: false,
      editingListingId: null,
      editError: null,
      isSavingChanges: false,

      // Suspend Listing State
      suspendingListingId: null,
      isSuspending: false,
      suspensionError: null,

      // Confirmed Matches State
      confirmedMatches: [],
      loadingMatches: false,
      matchesError: null,
      filters: {
        serviceType: '',
        startDate: '',
        endDate: '',
      },

      // Search Listings State
      searchResults: [],
      searchKeyword: '',
      searchLoading: false,
      searchError: null,
      searchMessage: null,

      // General Message State
      message: null
    }; // End of this.state

    // Bind rendering methods to this instance - MOVED INSIDE CONSTRUCTOR
    for (const methodName in renderingMethods) {
      if (renderingMethods.hasOwnProperty(methodName)) {
        this[methodName] = renderingMethods[methodName].bind(this);
      }
    }
  } // End of constructor

  componentDidMount() {
    // Ensure user and user.id are available before fetching
    if (this.props.user && this.props.user.id) {
        this.fetchInitialData(this.props.user.id);
        this.handleSearchSubmit(); // Load initial search results
    } else {
        console.warn("CleanerUI: User ID not available on mount. Cannot fetch initial data.");
        this.setState({
            listingsError: "User ID not available. Please re-login.", // Or a more appropriate message
            loadingListings: false, // Ensure loading is stopped
            // Potentially set similar errors for insights if they also depend on this ID
        });
    }
  }

  componentDidUpdate(prevProps) {
    // Check if user.id has changed and is available
    if (this.props.user && this.props.user.id && (prevProps.user?.id !== this.props.user.id)) {
        this.fetchInitialData(this.props.user.id);
    }
  }

  fetchInitialData = async (cleanerId) => {
    if (!cleanerId) {
        this.setState({ listingsError: "Cannot fetch data: Cleaner ID is missing.", loadingListings: false });
        return;
    }
    this.setState({ loadingListings: true, insightsLoading: true }); // Set loading for all
    await Promise.all([
        this.fetchProfileInsights(cleanerId),
        this.fetchShortlistCount(cleanerId),
        this.fetchServiceListings(cleanerId),
    ]);
  };

  // Insights Actions
  fetchProfileInsights = async (cleanerId) => {
    this.setState({
      insightsLoading: true,
      insightsError: null
    });
    try {
      if (!cleanerId) throw new Error("Cleaner ID not available for profile insights.");
      const response = await fetch(`/api/cleaners/${cleanerId}/insights/views`);
      
      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ profileInsights: data });
    } catch (error) {
      console.error('Error fetching profile insights:', error);
      this.setState({
        insightsError: error.message,
        message: { text: `Error fetching profile insights: ${error.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    } finally {
      this.setState({ insightsLoading: false });
    }
  };

  fetchShortlistCount = async (cleanerId) => {
    this.setState({
      insightsLoading: true,
      insightsError: null
    });
    try {
      if (!cleanerId) throw new Error("Cleaner ID not available for shortlist count.");
      const response = await fetch(`/api/cleaners/${cleanerId}/insights/shortlist-count`);
      
      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ shortlistCount: data.count });
    } catch (error) {
      console.error('Error fetching shortlist count:', error);
      this.setState({
        insightsError: error.message,
        message: { text: `Error fetching shortlist count: ${error.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    } finally {
      this.setState({ insightsLoading: false });
    }
  };

  // Create Listing Actions
  handleCreateListingInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newListing: {
        ...prevState.newListing,
        [name]: value
      }
    }));
  };

  handleCreateListingSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      isCreatingListing: true,
      createListingError: null,
      createListingSuccess: null
    });

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...this.state.newListing,
          cleanerId: this.props.user?.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      this.setState({
        showCreateForm: false,
        newListing: { 
          serviceType: 'Basic Cleaning', 
          title: '', 
          description: 'Describe your service', 
          ratePerHr: 30.00,
          duration: 2,
          availability: 'Mon-Fri 9am-5pm, Sat 10am-2pm'
        },
        createListingSuccess: 'Listing created successfully!'
      });
      this.fetchServiceListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      this.setState({
        createListingError: error.message,
        message: { text: `Error creating listing: ${error.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    } finally {
      this.setState({ isCreatingListing: false });
      setTimeout(() => this.setState({ createListingSuccess: null }), 3000);
      setTimeout(() => this.setState({ createListingError: null }), 3000);
    }
  };

  // Service Listings Actions
  fetchServiceListings = async () => {
    this.setState({
      loadingListings: true,
      listingsError: null
    });
    try {
      const cleanerId = this.props.user?.id;
      if (!cleanerId) {
        this.setState({
          listingsError: "Cleaner ID not available to fetch listings.",
          serviceListings: []
        });
        return;
      }
      const response = await fetch(`/api/listings/by-cleaner/${cleanerId}`);
      
      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ 
        serviceListings: data.listings || [], 
        loadingListings: false 
      });
    } catch (error) {
      console.error('Error fetching service listings:', error);
      this.setState({
        listingsError: error.message,
        serviceListings: [],
        message: { text: `Error fetching service listings: ${error.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    } finally {
      this.setState({ loadingListings: false });
    }
  };

  getListingDetails = async (listingId) => {
    this.setState({
      selectedListingId: listingId,
      loadingDetails: true,
      detailsError: null,
      listingDetails: null
    });
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ listingDetails: data });
    } catch (error) {
      console.error(`Error fetching details for listing ${listingId}:`, error);
      this.setState({
        detailsError: error.message,
        message: { text: `Error fetching listing details: ${error.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    } finally {
      this.setState({ loadingDetails: false });
    }
  };

  // Edit Listing Actions
  openEditModal = (listing) => {
    this.setState({
      editingListingId: listing.id,
      editFormData: {
        id: listing.id,
        serviceType: listing.serviceType || 'Basic Cleaning',
        title: listing.title || '',
        description: listing.description || '',
        ratePerHr: listing.ratePerHr ? listing.ratePerHr.toString() : '0',
        status: listing.status || 'ACTIVE'
      },
      showEditModal: true
    });
  };

  closeEditModal = () => {
    this.setState({
      showEditModal: false,
      editingListingId: null,
      editError: null,
      isSuspending: false,
      suspendingListingId: null
    });
  };

  handleEditInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editFormData: {
        ...prevState.editFormData,
        [name]: value
      }
    }));
  };

  handleSaveListingChanges = async () => {
    if (!this.state.editingListingId) return;

    this.setState({
      isSavingChanges: true,
      editError: null
    });

    if (!this.state.editFormData.title || !this.state.editFormData.description || !this.state.editFormData.ratePerHr) {
      this.setState({
        editError: "Please fill in all required fields.",
        isSavingChanges: false
      });
      return;
    }

    try {
      const response = await fetch(`/api/listings/${this.state.editingListingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serviceType: this.state.editFormData.serviceType,
            title: this.state.editFormData.title,
            description: this.state.editFormData.description,
            ratePerHr: this.state.editFormData.ratePerHr
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      this.setState({
        message: { text: 'Changes saved successfully!', type: 'success' }
      });
      this.closeEditModal();
      this.fetchServiceListings();
    } catch (error) {
      console.error('Error updating listing:', error);
      this.setState({
        editError: error.message,
        message: { text: `Error updating listing: ${error.message}`, type: 'error' }
      });
    } finally {
      this.setState({ isSavingChanges: false });
      setTimeout(() => this.setState({ message: null }), 5000);
    }
  };

  // Suspend Listing Actions
  handleToggleListingStatus = async (listingId) => {
    this.setState({
      suspendingListingId: listingId,
      isSuspending: true,
      suspensionError: null,
      editError: null
    });

    try {
      const response = await fetch(`/api/listings/${listingId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cleanerId: this.props.user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Update the edit form's status if open
      if (this.state.editingListingId === listingId) {
        this.setState(prevState => ({
          editFormData: {
            ...prevState.editFormData,
            status: data.newStatus
          }
        }));
      }

      // Update local listings status
      this.setState(prevState => ({
        serviceListings: prevState.serviceListings.map(listing => 
          listing.id === listingId 
            ? { ...listing, status: data.newStatus } 
            : listing
        ),
        message: {
          text: `Listing status changed to ${data.newStatus.toLowerCase()} successfully.`,
          type: 'success'
        }
      }));
    } catch (error) {
      console.error('Error suspending listing:', error);
      this.setState({
        suspensionError: error.message,
        message: { text: `Error suspending listing: ${error.message}`, type: 'error' }
      });
    } finally {
      this.setState({
        isSuspending: false,
        suspendingListingId: null
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    }
  };

  // Search Listings Actions
  handleSearchInputChange = (e) => {
    this.setState({ searchKeyword: e.target.value });
  };

  handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    this.setState({
      searchLoading: true,
      searchError: null,
      searchMessage: null
    });

    try {
      let url = '/api/listings/search';
      if (this.state.searchKeyword) {
        url += `?keyword=${encodeURIComponent(this.state.searchKeyword)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({
        searchResults: Array.isArray(data) ? data : [],
        searchMessage: this.state.searchKeyword && data.length === 0 
          ? 'No matching listings found.' 
          : data.length === 0
          ? 'No listings available at this time.'
          : null
      });
    } catch (error) {
      console.error('Error searching listings:', error);
      this.setState({
        searchError: error.message,
        searchResults: []
      });
    } finally {
      this.setState({ searchLoading: false });
      setTimeout(() => this.setState({ searchMessage: null }), 3000);
      setTimeout(() => this.setState({ searchError: null }), 3000);
    }
  };

  // Confirmed Matches Actions (assuming an endpoint exists)
  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [name]: value
      }
    }));
  };

  applyFilters = async () => {
    this.setState({
      loadingMatches: true,
      matchesError: null,
      confirmedMatches: []
    });
    try {
      const response = await fetch(`/api/cleaners/${this.props.currentCleanerId}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.filters),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ confirmedMatches: data });
    } catch (error) {
      console.error('Error fetching confirmed matches:', error);
      this.setState({
        matchesError: error.message,
        message: { text: `Error fetching confirmed matches: ${error.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 5000);
    } finally {
      this.setState({ loadingMatches: false });
    }
  };
  // NOTE: The misplaced loop and extra brace were here. They have been moved to the constructor.

  render() {
    const { currentPage } = this.props;

    return (
      <div className="cleaner-ui-container">
        {currentPage === 'search' && this.renderSearchListings()}
        {currentPage === 'myListings' && this.renderUserListings()}
        {currentPage === 'matches' && (
          <div className="matches-container">
            <h2>Confirmed Matches</h2>
            <div className="filters">
              <form onSubmit={(e) => {
                e.preventDefault();
                this.applyFilters();
              }}>
                <div className="filter-group">
                  <label>Service Type:</label>
                  <input
                    type="text"
                    name="serviceType"
                    value={this.state.filters.serviceType}
                    onChange={this.handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={this.state.filters.startDate}
                    onChange={this.handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={this.state.filters.endDate}
                    onChange={this.handleFilterChange}
                  />
                </div>
                <button type="submit" disabled={this.state.loadingMatches}>
                  Apply Filters
                </button>
              </form>
            </div>

            {this.state.loadingMatches && <div className="loading">Loading matches...</div>}
            {this.state.matchesError && <div className="error-message">{this.state.matchesError}</div>}

            {this.state.confirmedMatches.length > 0 ? (
              <div className="matches-list">
                {this.state.confirmedMatches.map(match => (
                  <div key={match.id} className="match-card">
                    <h3>{match.serviceListing?.title || 'Untitled Service'}</h3>
                    <p>Client: {match.client?.username || 'Unknown'}</p>
                    <p>Date: {new Date(match.date).toLocaleDateString()}</p>
                    <p>Status: {match.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              !this.state.loadingMatches && <div className="no-matches">No confirmed matches found</div>
            )}
          </div>
        )}
        {this.renderListingDetails()}
        {this.renderEditModal()}
      </div>
    );
  }
}

export default CleanerUI;
