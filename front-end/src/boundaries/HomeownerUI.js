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

      // Bookings
      bookings: [],
      filteredBookings: [],
      bookingSearchTerm: '',
      bookingsLoading: false,

      // History
      history: [],
      filteredHistory: [],
      historySearchTerm: '',
      historyLoading: false,

      // UI state
      loading: false,
      message: null,
      error: null
    };

    // Bind rendering methods from the imported object to this instance
    for (const methodName in renderingMethods) {
      if (renderingMethods.hasOwnProperty(methodName)) {
        this[methodName] = renderingMethods[methodName].bind(this);
      }
    }
  }

  componentDidMount() {
    // Load data from the backend
    this.fetchCleaners();
    this.loadSavedCleaners();
    this.loadBookedCleaners();
    this.loadCleaningHistory();
  }

  // Method to fetch cleaners from API
  fetchCleaners = async () => {
    try {
      this.setState({ loading: true, error: null });

      const response = await fetch('http://localhost:3000/api/cleaners');

      if (!response.ok) {
        throw new Error(`Failed to fetch cleaners: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        cleaners: data,
        filteredCleaners: data,
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
  navigateTo = (tab) => {
    // Refresh data based on which tab we're navigating to
    if (tab === 'browseCleaners') {
      this.fetchCleaners();
    } else if (tab === 'saved') {
      this.loadSavedCleaners();
    } else if (tab === 'booked') {
      this.loadBookedCleaners();
    } else if (tab === 'history') {
      this.loadCleaningHistory();
    }

    this.setState({ activeTab: tab });
  };

  // Method to refresh data
  refreshData = () => {
    const { activeTab } = this.state;

    if (activeTab === 'browseCleaners') {
      this.fetchCleaners();
    } else if (activeTab === 'saved') {
      this.loadSavedCleaners();
    } else if (activeTab === 'booked') {
      this.loadBookedCleaners();
    } else if (activeTab === 'history') {
      this.loadCleaningHistory();
    }
  };

  // Method to load cleaning history from the backend
  loadCleaningHistory = async () => {
    try {
      this.setState({ historyLoading: true, error: null });

      const response = await fetch('http://localhost:3000/api/history/');

      if (!response.ok) {
        throw new Error(`Failed to fetch cleaning history: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        history: data,
        filteredHistory: data,
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

      const response = await fetch('http://localhost:3000/api/shortlist/');

      if (!response.ok) {
        throw new Error(`Failed to fetch saved cleaners: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        savedCleaners: data,
        filteredSavedCleaners: data,
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
  loadBookedCleaners = async () => {
    try {
      this.setState({ bookingsLoading: true, error: null });

      const response = await fetch('http://localhost:3000/api/matches/cleaner/confirmed');

      if (!response.ok) {
        throw new Error(`Failed to fetch booked cleaners: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        bookings: data,
        filteredBookings: data,
        bookingsLoading: false
      });
    } catch (err) {
      console.error('Error loading booked cleaners:', err);

      this.setState({
        error: err.message,
        bookingsLoading: false,
        message: {
          text: `Error loading booked cleaners: ${err.message}`,
          type: 'error'
        }
      });

      setTimeout(() => {
        this.setState({ message: null });
      }, 3000);
    }
  };

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
    const { savedSearchTerm } = this.state;

    if (!savedSearchTerm.trim()) {
      // If search term is empty, load all saved cleaners
      this.loadSavedCleaners();
      return;
    }

    try {
      this.setState({ savedCleanersLoading: true, error: null });

      const response = await fetch(`http://localhost:3000/api/shortlist/search?query=${encodeURIComponent(savedSearchTerm)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        filteredSavedCleaners: data,
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

  // Method to search cleaners
  searchCleaners = async () => {
    const { searchTerm } = this.state;

    if (!searchTerm.trim()) {
      // If search term is empty, load all cleaners
      this.fetchCleaners();
      return;
    }

    try {
      this.setState({ loading: true, error: null });

      const response = await fetch(`http://localhost:3000/api/cleaners/search?query=${encodeURIComponent(searchTerm)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();

      this.setState({
        filteredCleaners: data,
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
      const response = await fetch('http://localhost:3000/api/shortlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanerToSave),
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

  // Book cleaner
  bookCleaner = async (cleanerId) => {
    const { cleaners, savedCleaners } = this.state;

    // Try to find the cleaner in both the cleaners list and savedCleaners list
    const cleaner = cleaners.find(c => c.id === cleanerId) ||
      savedCleaners.find(c => c.id === cleanerId);

    if (!cleaner) return;

    try {
      this.setState({ loading: true });

      // Create a new booking via API
      const bookingData = {
        cleanerId: cleaner.id,
        service: cleaner.services ? cleaner.services[0] : 'Standard Service', // Default to first service or standard
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: "10:00 AM"
      };

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

      // Get the created booking from response
      const newBooking = await response.json();

      // Update state and show success message
      this.setState({
        loading: false,
        message: {
          text: `Booking with ${cleaner.name} confirmed for tomorrow at 10:00 AM`,
          type: "success"
        },
        activeTab: 'booked' // Switch to booked tab
      });

      // Refresh the bookings list to include the new booking
      this.loadBookedCleaners();

    } catch (err) {
      console.error('Error booking cleaner:', err);

      this.setState({
        loading: false,
        error: err.message,
        message: {
          text: `Error booking cleaner: ${err.message}`,
          type: 'error'
        }
      });
    }

    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
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