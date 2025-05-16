import React, { Component } from 'react';
import renderingMethods from './HomeownerUI.render';
import '../HomeownerUI.css'; // Reuse existing styles

class HomeownerUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Default to browse cleaners tab
      activeTab: 'browseCleaners',

      // Cleaners data
      cleaners: [],
      filteredCleaners: [],
      searchTerm: '',

      // Saved cleaners
      savedCleaners: [],
      filteredSavedCleaners: [],
      savedSearchTerm: '',
      savedCleanersLoading: false,


      // History
      history: [],
      filteredHistory: [],
      historySearchTerm: '',
      historyLoading: false,

      // UI state
      loading: false,
      message: null,
      error: null,
      showCleanerProfile: false,
      selectedCleaner: null
    };

    // Bind rendering methods from the imported object to this instance
    for (const methodName in renderingMethods) {
      if (renderingMethods.hasOwnProperty(methodName)) {
        this[methodName] = renderingMethods[methodName].bind(this);
      }
    }
    
    // Bind API call methods
    this.bookService = this.bookService.bind(this);
  }

  componentDidMount() {
    // Load data from the backend
    this.fetchCleaners();
    this.loadSavedCleaners();
    this.loadCleaningHistory();
  }

  // Method to fetch all active cleaners from API
  fetchCleaners = async () => {
    try {
      this.setState({ loading: true, error: null });

      // Call the endpoint to get all active cleaners
      const response = await fetch('http://localhost:3001/api/users/cleaners/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cleaners: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform the API response to match what the UI expects
      const cleaners = data.map(cleaner => ({
        id: cleaner.id,
        username: cleaner.username,
        name: cleaner.username, // Using username as name if no name field exists
        email: cleaner.email,
        description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
        services: cleaner.serviceListings?.map(listing => listing.serviceType) || ['House Cleaning'],
        availability: 'Available',
        price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}` // Default to $20 if no rate
      }));

      this.setState({
        cleaners: cleaners,
        filteredCleaners: cleaners,
        loading: false
      });
    } catch (err) {
      console.error('Error loading cleaners:', err);

      this.setState({
        error: err.message,
        loading: false,
        message: {
          text: `Error loading cleaners: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Method for navigation
  componentDidUpdate(prevProps) {
    // Sync active tab with props when changed from parent
    if (this.props.currentPage !== prevProps.currentPage) {
      this.setState({ activeTab: this.props.currentPage }, () => {
        this.refreshData();
      });
    }
  }

  navigateTo = (tab) => {
    // Notify parent component of tab change
    if (this.props.onNavigate) {
      this.props.onNavigate(tab);
    }
    // Update local state
    this.setState({ activeTab: tab }, () => {
      this.refreshData();
    });
  };

  refreshData = () => {
    const { activeTab } = this.state;
    console.log('Refreshing data for tab:', activeTab);
    
    switch(activeTab) {
      case 'browseCleaners':
        this.fetchCleaners();
        break;
      case 'saved':
        this.loadSavedCleaners();
        break;
      case 'history':
        this.loadCleaningHistory();
        break;
      default:
        this.fetchCleaners();
    }
  };

  // Method to refresh data
  refreshData = () => {
    const { activeTab } = this.state;

    switch(activeTab) {
      case 'browseCleaners':
        this.fetchCleaners();
        break;
      case 'saved':
        this.loadSavedCleaners();
        break;
      case 'history':
        this.loadCleaningHistory();
        break;
      default:
        this.fetchCleaners();
    }
  };

  // Method to load cleaning history from the backend
  loadCleaningHistory = async () => {
    try {
      this.setState({ historyLoading: true, error: null });

      const response = await fetch('http://localhost:3001/api/matches/homeowner/past', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cleaning history: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform API response to match history card format
      const history = data.map(item => ({
        id: item.matchId,
        date: new Date(item.confirmationDate).toLocaleDateString(),
        time: new Date(item.confirmationDate).toLocaleTimeString(),
        cleanerName: item.cleanerUsername,
        serviceType: item.serviceType,
        ratePerHr: item.ratePerHr,
        status: 'Completed'
      }));

      this.setState({
        history: history,
        filteredHistory: history,
        historyLoading: false
      });
    } catch (err) {
      console.error('Error loading cleaning history:', err);

      this.setState({
        error: err.message,
        historyLoading: false,
        message: {
          text: `Error loading cleaning history: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Handler for history search input change
  handleHistorySearchChange = (e) => {
    this.setState({ historySearchTerm: e.target.value });
  };

  // Handler for history search form submission
  handleHistorySearchSubmit = (e) => {
    e.preventDefault();
    this.searchCleaningHistory();
  };

  // Method to search cleaning history from the backend
  searchCleaningHistory = async () => {
    const { historySearchTerm } = this.state;

    if (!historySearchTerm.trim()) {
      // If search term is empty, load all history
      this.loadCleaningHistory();
      return;
    }

    try {
      this.setState({ historyLoading: true, error: null });

      const response = await fetch(`http://localhost:3000/api/history/search?query=${encodeURIComponent(historySearchTerm)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        filteredHistory: data,
        historyLoading: false
      });
    } catch (err) {
      console.error('Error searching cleaning history:', err);

      this.setState({
        error: err.message,
        historyLoading: false,
        message: {
          text: `Error searching cleaning history: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Method to load saved cleaners from the backend
  loadSavedCleaners = async () => {
    try {
      this.setState({ savedCleanersLoading: true, error: null });

      const response = await fetch('http://localhost:3000/api/shortlist/all', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch saved cleaners: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform API response to match cleaner card format
      const savedCleaners = data.map(cleaner => {
        // Get unique service category names from all service listings
        const serviceCategories = [...new Set(
          cleaner.serviceListings
            ?.map(listing => listing.serviceCategory?.serviceCatName)
            .filter(name => name)
        )] || ['House Cleaning'];

        return {
          id: cleaner.id,
          name: cleaner.username,
          username: cleaner.username,
          email: cleaner.email,
          description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
          services: serviceCategories,
          price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}`,
          availability: 'Available',
          shortlistedAt: cleaner.shortlistedAt
        };
      });

      this.setState({
        savedCleaners: savedCleaners,
        filteredSavedCleaners: savedCleaners,
        savedCleanersLoading: false
      });
    } catch (err) {
      console.error('Error loading saved cleaners:', err);

      this.setState({
        error: err.message,
        savedCleanersLoading: false,
        message: {
          text: `Error loading saved cleaners: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Load booked cleaners from the backend

  // Handler for saved cleaners search input change
  handleSavedSearchChange = (e) => {
    this.setState({ savedSearchTerm: e.target.value });
  };

  // Handler for saved cleaners search form submission
  handleSavedSearchSubmit = (e) => {
    e.preventDefault();
    this.searchSavedCleaners();
  };

  // Method to search saved cleaners from the backend
  searchSavedCleaners = async () => {
    const { savedSearchTerm, savedCleaners } = this.state;

    if (!savedSearchTerm.trim()) {
      // If search term is empty, show all saved cleaners
      this.setState({
        filteredSavedCleaners: savedCleaners,
        savedCleanersLoading: false
      });
      return;
    }

    try {
      this.setState({ savedCleanersLoading: true, error: null });

      const response = await fetch(`http://localhost:3001/api/shortlist/search?keyword=${encodeURIComponent(savedSearchTerm)}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform API response to match cleaner card format
      const filteredCleaners = data.map(cleaner => ({
        id: cleaner.id,
        name: cleaner.username,
        username: cleaner.username,
        email: cleaner.email,
        description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
        services: cleaner.serviceListings?.map(listing => 
          listing.serviceCategory?.serviceCatName || 'Cleaning'
        ) || ['House Cleaning'],
        price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}`,
        availability: 'Available',
        shortlistedAt: cleaner.shortlistedAt
      }));

      this.setState({
        filteredSavedCleaners: filteredCleaners,
        savedCleanersLoading: false
      });
    } catch (err) {
      console.error('Error searching saved cleaners:', err);

      this.setState({
        error: err.message,
        savedCleanersLoading: false,
        message: {
          text: `Error searching saved cleaners: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Handler for booked cleaners search input change
  handleBookingSearchChange = (e) => {
    this.setState({ bookingSearchTerm: e.target.value });
  };

  // Handler for booked cleaners search form submission
  handleBookingSearchSubmit = (e) => {
    e.preventDefault();
    this.searchBookedCleaners();
  };

  // Method to search booked cleaners
  searchBookedCleaners = async () => {
    const { bookingSearchTerm } = this.state;

    if (!bookingSearchTerm.trim()) {
      // If search term is empty, load all booked cleaners
      this.loadBookedCleaners();
      return;
    }

    try {
      this.setState({ bookingsLoading: true, error: null });

      const response = await fetch(`http://localhost:3000/api/matches/cleaner/confirmed/search?query=${encodeURIComponent(bookingSearchTerm)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        filteredBookings: data,
        bookingsLoading: false
      });
    } catch (err) {
      console.error('Error searching booked cleaners:', err);

      this.setState({
        error: err.message,
        bookingsLoading: false,
        message: {
          text: `Error searching booked cleaners: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Methods for browse cleaners
  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    this.searchCleaners();
  };

  // Method to search cleaners using backend API
  searchCleaners = async () => {
    const { searchTerm } = this.state;

    if (!searchTerm.trim()) {
      // If search term is empty, load all cleaners
      this.fetchCleaners();
      return;
    }

    try {
      this.setState({ loading: true, error: null });

      // Call the cleaner-specific search endpoint
      const response = await fetch(`http://localhost:3000/api/users/cleaners/search?keyword=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform the API response
      const filteredCleaners = data.map(cleaner => ({
        id: cleaner.id,
        username: cleaner.username,
        name: cleaner.username,
        email: cleaner.email,
        description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
        services: cleaner.serviceListings?.map(listing => listing.serviceType) || ['House Cleaning'],
        availability: 'Available',
        price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}` // Default to $20 if no rate
      }));

      this.setState({
        filteredCleaners: filteredCleaners,
        loading: false
      });
    } catch (err) {
      console.error('Error searching cleaners:', err);

      this.setState({
        error: err.message,
        loading: false,
        message: {
          text: `Error searching cleaners: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Save cleaner
  saveCleaner = async (cleanerId) => {
    const { savedCleaners, cleaners } = this.state;

    try {
      this.setState({ loading: true });

      // Find the cleaner to save
      const cleanerToSave = cleaners.find(cleaner => cleaner.id === cleanerId);

      if (!cleanerToSave) {
        throw new Error("Cleaner not found");
      }

      // Call API to add cleaner to shortlist
      const response = await fetch('http://localhost:3001/api/shortlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeownerId: this.props.user.id,
          cleanerId: cleanerId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save cleaner: ${response.statusText}`);
      }

      // Get the saved cleaner from response
      const savedCleaner = await response.json();

      // Update local state
      this.setState({
        savedCleaners: [...savedCleaners, savedCleaner],
        filteredSavedCleaners: [...this.state.filteredSavedCleaners, savedCleaner],
        loading: false,
        message: {
          text: "Cleaner saved successfully",
          type: "success"
        }
      });
    } catch (err) {
      console.error('Error saving cleaner:', err);

      this.setState({
        loading: false,
        error: err.message,
        message: {
          text: `Error: ${err.message}`,
          type: 'error'
        }
      });
    }

    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };

  // Book a service from cleaner profile
  bookService = async (cleanerId, serviceListingId) => {
    try {
      this.setState({ loading: true });
      
      const response = await fetch('http://localhost:3001/api/matches/cleaner/confirmed/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceListingId,
          homeownerId: this.props.user.id
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || response.statusText);
      }

      const data = await response.json();
      
      this.setState({
        loading: false,
        showCleanerProfile: false,
        message: {
          text: "Service booked successfully!",
          type: "success"
        }
      });

      // Refresh bookings list
      this.loadBookedCleaners();

    } catch (err) {
      console.error('Error booking service:', err);
      this.setState({
        loading: false,
        message: {
          text: `Booking failed: ${err.message}`,
          type: 'error'
        }
      });
    }
  };

  // View cleaner profile
  viewCleanerProfile = async (cleanerId) => {
    try {
      this.setState({ loading: true });
      
      const response = await fetch(`http://localhost:3000/api/users/${cleanerId}/profile`, {
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch cleaner profile: ${response.statusText}`);
      }

      const profileData = await response.json();
      
      this.setState({
        loading: false,
        showCleanerProfile: true,
        selectedCleaner: {
          ...profileData,
          id: cleanerId
        }
      });

    } catch (err) {
      console.error('Error viewing cleaner profile:', err);
      this.setState({
        loading: false,
        message: {
          text: `Error: ${err.message}`,
          type: 'error'
        }
      });
    }
  };

  // Close cleaner profile modal
  closeCleanerProfile = () => {
    this.setState({
      showCleanerProfile: false,
      selectedCleaner: null
    });
  };

  // View booking details
  viewBookingDetails = (bookingId) => {
    const { bookings } = this.state;
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) return;

    // Format booking details for display based on available fields
    const cleanerName = booking.cleaner?.name || booking.cleanerName || 'Unknown';
    const service = booking.service || booking.serviceType || 'Standard Service';
    const date = booking.date || (booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleDateString() : 'Unknown');
    const time = booking.time || (booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleTimeString() : 'Unknown');
    const status = booking.status || booking.matchStatus || 'Confirmed';

    const details = `
      Booking Details:
      Cleaner: ${cleanerName}
      Service: ${service}
      Date: ${date}
      Time: ${time}
      Status: ${status}
    `;

    alert(details);
  };

  // Cancel booking
  cancelBooking = async (bookingId) => {
    const { bookings } = this.state;
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) return;

    const cleanerName = booking.cleaner?.name || booking.cleanerName || 'this cleaner';
    const confirmCancel = window.confirm(`Are you sure you want to cancel your booking with ${cleanerName}?`);

    if (confirmCancel) {
      try {
        this.setState({ loading: true });

        // Call API to cancel booking
        const response = await fetch(`http://localhost:3000/api/matches/cleaner/${bookingId}/cancel`, {
          method: 'PUT',
        });

        if (!response.ok) {
          throw new Error(`Failed to cancel booking: ${response.statusText}`);
        }

        // Refresh bookings list
        await this.loadBookedCleaners();

        this.setState({
          loading: false,
          message: {
            text: "Booking cancelled successfully",
            type: "success"
          }
        });
      } catch (err) {
        console.error('Error cancelling booking:', err);

        this.setState({
          loading: false,
          error: err.message,
          message: {
            text: `Error cancelling booking: ${err.message}`,
            type: 'error'
          }
        });
      }

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

  // Book again
  bookAgain = async (historyItemId) => {
    const { history } = this.state;
    const historyItem = history.find(item => item.id === historyItemId);

    if (!historyItem) return;

    try {
      this.setState({ loading: true });

      // Extract cleaner ID and service from the history item
      const cleanerId = historyItem.cleaner?.id || historyItem.cleanerId;
      const service = historyItem.service || historyItem.serviceType || 'Standard Service';

      if (!cleanerId) {
        throw new Error("Could not identify cleaner from history record");
      }

      // Create booking data
      const bookingData = {
        cleanerId: cleanerId,
        service: service,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: historyItem.time || "10:00 AM"
      };

      // Call API to create new booking
      const response = await fetch('http://localhost:3000/api/matches/cleaner/confirmed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(`Failed to book cleaner: ${response.statusText}`);
      }

      // Refresh the bookings
      await this.loadBookedCleaners();

      const cleanerName = historyItem.cleaner?.name || historyItem.cleanerName || 'the cleaner';

      this.setState({
        loading: false,
        message: {
          text: `Booking with ${cleanerName} confirmed for tomorrow`,
          type: "success"
        },
        activeTab: 'booked' // Switch to booked tab
      });
    } catch (err) {
      console.error('Error booking again:', err);

      this.setState({
        loading: false,
        error: err.message,
        message: {
          text: `Error creating new booking: ${err.message}`,
          type: 'error'
        }
      });
    }

    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };

  render() {
    // Use the renderHomeowner method from imported rendering methods
    return this.renderHomeowner();
  }
}

export default HomeownerUI;
