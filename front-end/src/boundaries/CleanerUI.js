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
        serviceCatName: 'Basic Cleaning',
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
        this.fetchProfileInsights(this.props.user.id);
        this.fetchShortlistCount(this.props.user.id);
    } else {
        console.warn("CleanerUI: User ID not available on mount. Cannot fetch initial data.");
        this.setState({
            listingsError: "User ID not available. Please re-login.",
            loadingListings: false,
            insightsError: "User ID not available. Please re-login."
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
      const response = await fetch(`/api/insights/cleaner/${cleanerId}/views`);
      
      // Handle cases where there might be no views yet
      if (response.status === 404) {
        // Return empty data structure
        return {
          totalViews: 0,
          dailyViewsLastWeek: Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return {
              date: d.toISOString().split('T')[0],
              views: 0
            };
          })
        };
      }

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
      if (!cleanerId) {
        console.error('Cleaner ID not available for shortlist count');
        this.setState({ 
          shortlistCount: 0,
          insightsError: "Cleaner information not available"
        });
        return;
      }

      const response = await fetch(`/api/insights/cleaner/${cleanerId}/shortlist-count`);
      
      if (!response.ok) {
        // If 404, it's not an error - just means count is 0
        if (response.status === 404) {
          this.setState({ shortlistCount: 0 });
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ 
        shortlistCount: data.shortlistCount || 0 
      });
    } catch (error) {
      console.error('Error fetching shortlist count:', error);
      // Don't show error for empty shortlist case
      if (error.message !== "You have not been shortlisted yet") {
        this.setState({
          insightsError: error.message,
          message: { text: `Error fetching shortlist count: ${error.message}`, type: 'error' }
        });
      } else {
        this.setState({ shortlistCount: 0 });
      }
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
      this.setState({ 
        listingDetails: {
          ...data.listing,
          serviceCatName: data.listing.serviceCatName,
          description: data.listing.description,
          ratePerHr: data.listing.ratePerHr
        }
      });
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
        serviceCatName: listing.serviceCatName || 'Basic Cleaning',
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

  handleSaveListingChanges = async (e) => {
    e.preventDefault();
    if (!this.state.editingListingId) return;

    this.setState({
      isSavingChanges: true,
      editError: null
    });

    const { serviceCatName, description, ratePerHr } = this.state.editFormData;
    
    if (!serviceCatName || !description || !ratePerHr) {
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
            serviceCatName,
            description,
            ratePerHr
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

  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [name]: value
      }
    }));
  };

  handleMatchFilterSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      loadingMatches: true,
      matchesError: null
    });

    try {
      const { serviceType, startDate, endDate } = this.state.filters;
      let url = `/api/matches/cleaner/confirmed?cleanerId=${this.props.user?.id}`;
      
      if (serviceType) url += `&serviceType=${encodeURIComponent(serviceType)}`;
      if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
      if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;

      const response = await fetch(url);
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
        <style>
          {`
            .white-box {
              color: black;
            }
            .white-box h2,
            .white-box h3,
            .white-box p,
            .white-box span,
            .white-box div:not(.error-message):not(.loading) {
              color: inherit;
            }
            .matches-container .filters {
              color: initial;
            }
          `}
        </style>
        {currentPage === 'search' && this.renderSearchListings()}
        {currentPage === 'myListings' && this.renderUserListings()}
        {currentPage === 'insights' && this.renderInsights()}
        {currentPage === 'matches' && (
          <div className="matches-container">
            <h2>Confirmed Matches</h2>
            
            <div className="filters" style={{ 
              display: 'flex', 
              alignItems: 'flex-end',
              gap: '20px',
              marginBottom: '30px',
              padding: '15px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <form onSubmit={this.handleMatchFilterSubmit} style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <div className="filter-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Service Category:</label>
                  <select
                    name="serviceType"
                    value={this.state.filters.serviceType}
                    onChange={this.handleFilterChange}
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">All Services</option>
                    <option value="Basic Cleaning">Basic Cleaning</option>
                    <option value="Deep Cleaning">Deep Cleaning</option>
                    <option value="Office Cleaning">Office Cleaning</option>
                    <option value="Window Cleaning">Window Cleaning</option>
                  </select>
                </div>
                
                <div className="filter-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>From:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={this.state.filters.startDate}
                    onChange={this.handleFilterChange}
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>
                
                <div className="filter-group" style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>To:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={this.state.filters.endDate}
                    onChange={this.handleFilterChange}
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>
                
                <div className="filter-group" style={{ alignSelf: 'flex-end' }}>
                  <button 
                    type="submit" 
                    style={{ 
                      padding: '8px 20px',
                      backgroundColor: '#4a6fa5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Filter
                  </button>
                </div>
              </form>
            </div>

            {this.state.loadingMatches ? (
              <div className="loading">Loading matches...</div>
            ) : this.state.matchesError ? (
              <div className="error-message">{this.state.matchesError}</div>
            ) : this.state.confirmedMatches.length > 0 ? (
              <div className="matches-grid">
                {this.state.confirmedMatches.map(match => (
                  <div key={match.matchId} className="match-card">
                    <div className="match-header">
                      <h3>{match.serviceTitle}</h3>
                      <span className="match-type">{match.serviceType}</span>
                    </div>
                    <div className="match-details">
                      <p><strong>Homeowner:</strong> {match.homeownerUsername}</p>
                      <p><strong>Confirmed:</strong> {new Date(match.confirmationDate).toLocaleDateString()}</p>
                      <p><strong>Rate:</strong> ${match.serviceRatePerHr}/hr</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-matches">No confirmed matches found</div>
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
