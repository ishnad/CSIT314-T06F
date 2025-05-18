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
    // Ensure saveCleaner is bound if not using arrow function property
    this.saveCleaner = this.saveCleaner.bind(this);
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

      const cleaners = data.map(cleaner => ({
        id: cleaner.id,
        username: cleaner.username,
        name: cleaner.username, 
        email: cleaner.email,
        description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
        services: cleaner.serviceListings?.map(listing => 
          listing.serviceCategory?.serviceCatName || 'Cleaning'
        ) || ['House Cleaning'],
        availability: 'Available',
        price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}`
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
    if (this.props.currentPage !== prevProps.currentPage) {
      this.setState({ activeTab: this.props.currentPage }, () => {
        this.refreshData();
      });
    }
  }

  navigateTo = (tab) => {
    if (this.props.onNavigate) {
      this.props.onNavigate(tab);
    }
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

  // Method to load cleaning history from the backend
  loadCleaningHistory = async () => {
    try {
      this.setState({ historyLoading: true, error: null });
      const response = await fetch('http://localhost:3001/api/matches/homeowner/past', {
        headers: { 'Content-Type': 'application/json', },
        credentials: 'include'
      });
      if (!response.ok) throw new Error(`Failed to fetch cleaning history: ${response.statusText}`);
      const data = await response.json();
      const history = data.map(item => {
        try {
          const confirmationDate = item.confirmationDate ? new Date(item.confirmationDate) : new Date();
          const formattedDate = confirmationDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
          const formattedTime = confirmationDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          return {
            id: item.matchId, date: formattedDate, time: formattedTime,
            cleanerName: item.cleanerUsername, cleanerUsername: item.cleanerUsername,
            serviceName: item.serviceName, serviceType: item.serviceType,
            ratePerHr: item.ratePerHr, status: item.status || 'COMPLETED',
            originalDate: confirmationDate
          };
        } catch (error) { console.error('Error formatting history item:', error); return null; }
      }).filter(Boolean);
      this.setState({ history: history, filteredHistory: history, historyLoading: false });
    } catch (err) {
      console.error('Error loading cleaning history:', err);
      this.setState({
        error: err.message, historyLoading: false,
        message: { text: `Error loading cleaning history: ${err.message}`, type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 3000);
    }
  };

  handleHistorySearchChange = (e) => this.setState({ historySearchTerm: e.target.value });
  handleHistorySearchSubmit = (e) => { e.preventDefault(); this.searchCleaningHistory(); };

  searchCleaningHistory = async () => {
    const { history, historySearchTerm } = this.state;
    if (!historySearchTerm.trim()) { this.setState({ filteredHistory: history }); return; }
    try {
      this.setState({ historyLoading: true });
      let searchDate; let isDateSearch = false;
      const dateFormats = ['MM/dd/yyyy', 'yyyy-MM-dd', 'dd-MM-yyyy', 'MM-dd-yyyy'];
      for (const format of dateFormats) { searchDate = new Date(historySearchTerm); if (!isNaN(searchDate.getTime())) { isDateSearch = true; break; } }
      let filtered = history;
      if (isDateSearch) {
        filtered = history.filter(item => {
          const itemDate = item.originalDate;
          return itemDate.getFullYear() === searchDate.getFullYear() && itemDate.getMonth() === searchDate.getMonth() && itemDate.getDate() === searchDate.getDate();
        });
      } else {
        const searchLower = historySearchTerm.toLowerCase();
        filtered = history.filter(item => {
          const fieldsToSearch = [item.serviceName, item.serviceType, item.cleanerName, item.cleanerUsername, item.status];
          if (!isNaN(historySearchTerm)) return item.cleanerUsername && item.cleanerUsername.toString().includes(historySearchTerm);
          return fieldsToSearch.some(field => field && field.toString().toLowerCase().includes(searchLower));
        });
      }
      this.setState({ filteredHistory: filtered, historyLoading: false, message: filtered.length === 0 ? { text: "No history found matching your search", type: "info" } : null });
    } catch (err) {
      console.error('Error searching cleaning history:', err);
      this.setState({ error: err.message, historyLoading: false, message: { text: `Error searching cleaning history: ${err.message}`, type: 'error' } });
      setTimeout(() => this.setState({ message: null }), 3000);
    }
  };

  loadSavedCleaners = async () => {
    try {
      this.setState({ savedCleanersLoading: true, error: null });
      // Assuming this endpoint requires authentication or is specific to the logged-in homeowner implicitly
      const response = await fetch('http://localhost:3001/api/shortlist/all', { // Corrected port to 3001 as per other calls
        headers: { 'Content-Type': 'application/json', /* Add Authorization if needed */ },
        credentials: 'include' // Or remove if not needed / handled by Authorization header
      });
      if (!response.ok) throw new Error(`Failed to fetch saved cleaners: ${response.statusText}`);
      const data = await response.json();
      const savedCleaners = data.map(cleaner => {
        const serviceCategories = [...new Set(cleaner.serviceListings?.map(listing => listing.serviceCategory?.serviceCatName).filter(name => name))] || ['House Cleaning'];
        return {
          id: cleaner.id, name: cleaner.username, username: cleaner.username, email: cleaner.email,
          description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
          services: serviceCategories.length > 0 ? serviceCategories : ['House Cleaning'], // Ensure services is not empty
          price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}`,
          availability: 'Available', shortlistedAt: cleaner.shortlistedAt
        };
      });
      this.setState({ savedCleaners: savedCleaners, filteredSavedCleaners: savedCleaners, savedCleanersLoading: false });
    } catch (err) {
      console.error('Error loading saved cleaners:', err);
      this.setState({ error: err.message, savedCleanersLoading: false, message: { text: `Error loading saved cleaners: ${err.message}`, type: 'error' } });
      setTimeout(() => this.setState({ message: null }), 3000);
    }
  };
  
  handleSavedSearchChange = (e) => this.setState({ savedSearchTerm: e.target.value });
  handleSavedSearchSubmit = (e) => { e.preventDefault(); this.searchSavedCleaners(); };

  searchSavedCleaners = async () => {
    const { savedSearchTerm, savedCleaners } = this.state;
    if (!savedSearchTerm.trim()) { this.setState({ filteredSavedCleaners: savedCleaners, savedCleanersLoading: false }); return; }
    try {
      this.setState({ savedCleanersLoading: true, error: null });
      // Assuming this endpoint requires authentication for user-specific search
      const response = await fetch(`http://localhost:3001/api/shortlist/search?keyword=${encodeURIComponent(savedSearchTerm)}`, {
        headers: { 'Content-Type': 'application/json', /* Add Authorization if needed */ },
        credentials: 'include' // Or remove
      });
      if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
      const data = await response.json();
      if (!Array.isArray(data)) { this.setState({ filteredSavedCleaners: [], savedCleanersLoading: false, message: { text: "No cleaners found matching your search", type: "info" } }); return; }
      const filteredCleaners = data.map(cleaner => ({
        id: cleaner.id, name: cleaner.username, username: cleaner.username, email: cleaner.email,
        description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
        services: cleaner.serviceListings?.map(listing => listing.serviceCategory?.serviceCatName || 'Cleaning') || ['House Cleaning'],
        price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}`, availability: 'Available',
        shortlistedAt: cleaner.shortlistedAt
      }));
      this.setState({ filteredSavedCleaners: filteredCleaners.length > 0 ? filteredCleaners : [], savedCleanersLoading: false, message: filteredCleaners.length === 0 ? { text: "No cleaners found matching your search", type: "info" } : null });
    } catch (err) {
      console.error('Error searching saved cleaners:', err);
      this.setState({ error: err.message, savedCleanersLoading: false, message: { text: `Error searching saved cleaners: ${err.message}`, type: 'error' } });
      setTimeout(() => this.setState({ message: null }), 3000);
    }
  };

  handleSearchChange = (e) => this.setState({ searchTerm: e.target.value });
  handleSearchSubmit = (e) => { e.preventDefault(); this.searchCleaners(); };

  searchCleaners = async () => {
    const { searchTerm } = this.state;
    if (!searchTerm.trim()) { this.fetchCleaners(); return; }
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch(`http://localhost:3001/api/users/cleaners/search?keyword=${encodeURIComponent(searchTerm)}`, { // Corrected port to 3001
        method: 'GET', headers: { 'Content-Type': 'application/json', }
      });
      if (!response.ok) throw new Error(`Search failed: ${response.statusText}`);
      const data = await response.json();
      if (!Array.isArray(data)) { this.setState({ filteredCleaners: [], loading: false, message: { text: "No cleaners found matching your search", type: "info" } }); return; }
      const filteredCleaners = data.map(cleaner => ({
        id: cleaner.id, username: cleaner.username, name: cleaner.username, email: cleaner.email,
        description: cleaner.serviceListings?.[0]?.description || 'Professional cleaning services',
        services: cleaner.serviceListings?.map(listing => listing.serviceCategory?.serviceCatName || 'Cleaning') || ['House Cleaning'],
        availability: 'Available', price: `$${cleaner.serviceListings?.[0]?.ratePerHr || 20}`
      }));
      this.setState({ filteredCleaners: filteredCleaners.length > 0 ? filteredCleaners : [], loading: false, message: filteredCleaners.length === 0 ? { text: "No cleaners found matching your search", type: "info" } : null });
    } catch (err) {
      console.error('Error searching cleaners:', err);
      this.setState({ error: err.message, loading: false, message: { text: `Error searching cleaners: ${err.message}`, type: 'error' } });
      setTimeout(() => this.setState({ message: null }), 3000);
    }
  };

  // Save cleaner - MODIFIED FOR REAL-TIME UI UPDATE
  saveCleaner = async (cleanerId) => {
    const { cleaners } = this.state; // Get current list of all cleaners.

    // Find the full cleaner object from the main 'cleaners' list.
    // This object already has the structure used for display and for the 'id' comparison in 'isSaved'.
    const cleanerObjectToSave = cleaners.find(c => c.id === cleanerId);

    if (!cleanerObjectToSave) {
      console.error("Cleaner not found in the main list with ID:", cleanerId);
      this.setState({
        message: { text: "Error: Cleaner data not found to shortlist.", type: 'error' }
      });
      setTimeout(() => this.setState({ message: null }), 3000);
      return;
    }

    // Optimistically check if already saved in current state to prevent multiple adds from rapid clicks
    // The button in render should also be disabled, but this is a safeguard.
    if (this.state.savedCleaners.some(savedCleaner => savedCleaner.id === cleanerId)) {
        this.setState({
            message: { text: `${cleanerObjectToSave.name} is already shortlisted.`, type: 'info' }
        });
        setTimeout(() => this.setState({ message: null }), 3000);
        return;
    }
    
    try {
      this.setState({ loading: true });

      // TODO: Ensure `this.props.user.id` is available and correct.
      // If `this.props.user` is not passed or `id` is missing, this will fail.
      if (!this.props.user || !this.props.user.id) {
          throw new Error("User information is missing. Cannot shortlist cleaner.");
      }

      const response = await fetch('http://localhost:3001/api/shortlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if your API requires it
          // 'Authorization': `Bearer ${your_auth_token_here}`
        },
        body: JSON.stringify({
          homeownerId: this.props.user.id, 
          cleanerId: cleanerId
        }),
        // credentials: 'include' // Use if cookies are needed for auth, otherwise rely on Authorization header
      });

      if (!response.ok) {
        let errorMessage = `Failed to save cleaner: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
          else if (errorData.error) errorMessage = errorData.error;
        } catch (e) { /* Failed to parse error JSON, stick with statusText */ }
        throw new Error(errorMessage);
      }

      // const savedShortlistEntry = await response.json(); // API might return the entry or the cleaner
      // For UI update, we add the `cleanerObjectToSave` which has the correct structure.
      
      this.setState(prevState => ({
        // Add the cleaner (which has the correct structure from the 'cleaners' list)
        // to 'savedCleaners'. This will make the `isSaved` check in `renderBrowseCleaners` true.
        savedCleaners: [...prevState.savedCleaners, cleanerObjectToSave],
        // Also update filteredSavedCleaners if the "Saved" tab might be active or for consistency.
        filteredSavedCleaners: [...prevState.filteredSavedCleaners, cleanerObjectToSave],
        loading: false,
        message: {
          text: `${cleanerObjectToSave.name} saved successfully!`,
          type: "success"
        }
      }));
    } catch (err) {
      console.error('Error saving cleaner:', err);
      this.setState({
        loading: false,
        error: err.message, // Store the error message
        message: {
          text: `Error saving cleaner: ${err.message}`,
          type: 'error'
        }
      });
    }

    setTimeout(() => {
      this.setState({ message: null });
    }, 3000);
  };

  bookService = async (cleanerId, serviceListingId) => {
    try {
      this.setState({ loading: true });
      // TODO: Ensure `this.props.user.id` is available and correct.
      if (!this.props.user || !this.props.user.id) {
        throw new Error("User information is missing. Cannot book service.");
      }
      const response = await fetch('http://localhost:3001/api/matches/cleaner/confirmed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          serviceListingId,
          homeownerId: this.props.user.id 
        }),
        credentials: 'include'
      });
      if (!response.ok) {
        let errorMessage = `Failed to book service (${response.status})`;
        try { const errorData = await response.json(); if (errorData.error) errorMessage += `: ${errorData.error}`; } 
        catch (e) { errorMessage += `: ${response.statusText}`; }
        throw new Error(errorMessage);
      }
      // const data = await response.json(); // Use data if needed
      this.setState({ loading: false, showCleanerProfile: false, message: { text: "Service booked successfully!", type: "success" } });
      this.loadCleaningHistory(); // Refresh history after booking
    } catch (err) {
      console.error('Error booking service:', err);
      this.setState({ loading: false, message: { text: `Booking failed: ${err.message}`, type: 'error' } });
    }
    setTimeout(() => this.setState({ message: null }), 3000);
  };

  viewCleanerProfile = async (cleanerId) => {
    try {
      this.setState({ loading: true });
      const response = await fetch(`http://localhost:3001/api/users/${cleanerId}/profile`, {
         headers: { /* Add Authorization if needed */ }
      });
      if (!response.ok) throw new Error(`Failed to fetch cleaner profile: ${response.statusText}`);
      const profileData = await response.json();
      this.setState({ loading: false, showCleanerProfile: true, selectedCleaner: { ...profileData, id: cleanerId } });
    } catch (err) {
      console.error('Error viewing cleaner profile:', err);
      this.setState({ loading: false, message: { text: `Error: ${err.message}`, type: 'error' } });
      setTimeout(() => this.setState({ message: null }), 3000);
    }
  };

  closeCleanerProfile = () => this.setState({ showCleanerProfile: false, selectedCleaner: null });

  render() {
    // Use the renderHomeowner method from imported rendering methods
    return this.renderHomeowner();
  }
}

export default HomeownerUI;