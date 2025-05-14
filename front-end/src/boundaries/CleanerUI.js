import React, { useState, useEffect } from 'react';

const CleanerUI = ({ currentCleanerId }) => {
    // Insights State
    const [profileInsights, setProfileInsights] = useState(null);
    const [shortlistCount, setShortlistCount] = useState(null);
    const [insightsError, setInsightsError] = useState(null);
    const [insightsLoading, setInsightsLoading] = useState(false);

    // Create Listing State
    const [newListing, setNewListing] = useState({
        serviceType: 'Basic Cleaning',
        title: '',
        description: 'Describe your service',
        ratePerHr: 30.00,
    });
    const [createListingError, setCreateListingError] = useState(null);
    const [createListingSuccess, setCreateListingSuccess] = useState(null);
    const [isCreatingListing, setIsCreatingListing] = useState(false);

    // Service Listings State (for cleaner's own listings)
    const [serviceListings, setServiceListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);
    const [listingsError, setListingsError] = useState(null);
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [listingDetails, setListingDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    // Edit Listing State
    const [isEditingListing, setIsEditingListing] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        ratePerHr: '',
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingListingId, setEditingListingId] = useState(null);
    const [editError, setEditError] = useState(null);
    const [isSavingChanges, setIsSavingChanges] = useState(false);

    // Suspend/Abort Listing State
    const [suspendingListingId, setSuspendingListingId] = useState(null);
    const [isSuspending, setIsSuspending] = useState(false);
    const [suspensionError, setSuspensionError] = useState(null);

    // Confirmed Matches State (assuming an endpoint exists for this)
    const [confirmedMatches, setConfirmedMatches] = useState([]);
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [matchesError, setMatchesError] = useState(null);
    const [filters, setFilters] = useState({
        serviceType: '',
        startDate: '',
        endDate: '',
    });

    // Search Listings (for searching other cleaners' listings) State
    const [searchResults, setSearchResults] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [searchMessage, setSearchMessage] = useState(null);

    // General Message State
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, [currentCleanerId]);

    const fetchInitialData = async () => {
        await Promise.all([
            fetchProfileInsights(),
            fetchShortlistCount(),
            fetchServiceListings(currentCleanerId),
        ]);
    };

    // Insights Actions
    const fetchProfileInsights = async () => {
        setInsightsLoading(true);
        setInsightsError(null);
        try {
            const response = await fetch(`/api/cleaners/${currentCleanerId}/insights/views`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProfileInsights(data);
        } catch (error) {
            console.error('Error fetching profile insights:', error);
            setInsightsError(error.message);
            setMessage({ text: `Error fetching profile insights: ${error.message}`, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setInsightsLoading(false);
        }
    };

    const fetchShortlistCount = async () => {
        setInsightsLoading(true);
        setInsightsError(null);
        try {
            const response = await fetch(`/api/cleaners/${currentCleanerId}/insights/shortlist-count`); // Adjusted route
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setShortlistCount(data.count); // Assuming the count is in a 'count' property
        } catch (error) {
            console.error('Error fetching shortlist count:', error);
            setInsightsError(error.message);
            setMessage({ text: `Error fetching shortlist count: ${error.message}`, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setInsightsLoading(false);
        }
    };

    // Create Listing Actions
    const handleCreateListingInputChange = (e) => {
        const { name, value } = e.target;
        setNewListing(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateListingSubmit = async (e) => {
        e.preventDefault();
        setIsCreatingListing(true);
        setCreateListingError(null);
        setCreateListingSuccess(null);

        try {
            const response = await fetch('/api/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newListing, cleanerId: currentCleanerId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            setNewListing({ serviceType: 'Basic Cleaning', title: '', description: 'Describe your service', ratePerHr: 30.00 });
            setCreateListingSuccess('Listing created successfully!');
            fetchServiceListings(currentCleanerId); // Refresh listings
        } catch (error) {
            console.error('Error creating listing:', error);
            setCreateListingError(error.message);
            setMessage({ text: `Error creating listing: ${error.message}`, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setIsCreatingListing(false);
            setTimeout(() => setCreateListingSuccess(null), 3000);
            setTimeout(() => setCreateListingError(null), 3000);
        }
    };

    // Service Listings Actions
    const fetchServiceListings = async (currentCleanerId) => {
        setLoadingListings(true);
        setListingsError(null);
        try {
            if (!currentCleanerId) {
                // Handle case where cleanerId might not be available yet
                setListingsError("Cleaner ID not available to fetch listings.");
                setServiceListings([]);
                return;
            }

            const response = await fetch(`/api/listings/by-cleaner/${currentCleanerId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // If backend returns null or empty array, setServiceListings will handle it fine.
            setServiceListings(data || []); // Ensure data is an array
        } catch (error) {
            console.error('Error fetching service listings:', error);
            setListingsError(error.message);
            setServiceListings([]); // Clear listings on error
            setMessage({ text: `Error fetching service listings: ${error.message}`, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setLoadingListings(false);
        }
    };

    const getListingDetails = async (listingId) => {
        setSelectedListingId(listingId);
        setLoadingDetails(true);
        setDetailsError(null);
        setListingDetails(null);
        try {
            const response = await fetch(`/api/listings/${listingId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setListingDetails(data);
        } catch (error) {
            console.error(`Error fetching details for listing ${listingId}:`, error);
            setDetailsError(error.message);
            setMessage({ text: `Error fetching listing details: ${error.message}`, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Edit Listing Actions
    const openEditModal = (listing) => {
        setEditingListingId(listing.id); // Assuming your listing object has an 'id' property
        setEditFormData({
            title: listing.title || '',
            description: listing.description || '',
            ratePerHr: listing.ratePerHr ? listing.ratePerHr.toString() : '',
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingListingId(null);
        setEditError(null);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveListingChanges = async () => {
        if (!editingListingId) return;

        setIsSavingChanges(true);
        setEditError(null);

        if (!editFormData.title || !editFormData.description || !editFormData.ratePerHr) {
            setEditError("Please fill in all required fields.");
            setIsSavingChanges(false);
            return;
        }

        try {
            const response = await fetch(`/api/listings/${editingListingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            setMessage({ text: 'Changes saved successfully!', type: 'success' });
            closeEditModal();
            fetchServiceListings(currentCleanerId); // Refresh listings
        } catch (error) {
            console.error('Error updating listing:', error);
            setEditError(error.message);
            setMessage({ text: `Error updating listing: ${error.message}`, type: 'error' });
        } finally {
            setIsSavingChanges(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    // Suspend Listing Actions
    const handleSuspendListing = async (listingId) => {
        setSuspendingListingId(listingId);
        setIsSuspending(true);
        setSuspensionError(null);

        try {
            const response = await fetch(`/api/listings/${listingId}/suspend`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cleanerId: currentCleanerId }), // You might need to send cleanerId for authorization
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessage({ text: `Listing "${data.title || listingId}" suspended successfully.`, type: 'success' });
            fetchServiceListings(currentCleanerId); // Refresh listings
        } catch (error) {
            console.error('Error suspending listing:', error);
            setSuspensionError(error.message);
            setMessage({ text: `Error suspending listing: ${error.message}`, type: 'error' });
        } finally {
            setIsSuspending(false);
            setSuspendingListingId(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    // Search Listings Actions
    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setSearchLoading(true);
        setSearchError(null);
        setSearchResults([]);
        setSearchMessage(null);

        try {
            const queryParams = new URLSearchParams();
            if (searchKeyword) queryParams.append('keyword', searchKeyword);
            // Add other potential search filters here if your backend supports them

            const url = `/api/listings/search?${queryParams.toString()}`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
            if (data && data.length === 0) {
                setSearchMessage('No matching listings found.');
            }
        } catch (error) {
            console.error('Error searching listings:', error);
            setSearchError(error.message);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
            setTimeout(() => setSearchMessage(null), 3000);
            setTimeout(() => setSearchError(null), 3000);
        }
    };

    // Confirmed Matches Actions (assuming an endpoint exists)
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = async () => {
        setLoadingMatches(true);
        setMatchesError(null);
        setConfirmedMatches([]);
        try {
            const response = await fetch(`/api/cleaners/${currentCleanerId}/matches`, { // Adjust this route to your actual endpoint
                method: 'POST', // Or GET depending on your API design
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filters),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setConfirmedMatches(data);
        } catch (error) {
            console.error('Error fetching confirmed matches:', error);
            setMatchesError(error.message);
            setMessage({ text: `Error fetching confirmed matches: ${error.message}`, type: 'error' });
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setLoadingMatches(false);
        }
    };

    return (
        <div>
            <h2>Search Service Listings</h2>
            <form onSubmit={handleSearchSubmit}>
                <div>
                    <label htmlFor="keyword">Search Keyword:</label>
                    <input
                        type="text"
                        id="keyword"
                        value={searchKeyword}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <button type="submit" disabled={searchLoading}>
                    {searchLoading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {searchLoading && <p>Searching for listings...</p>}
            {searchError && <p className="error-message">Error: {searchError}</p>}
            {searchMessage && <p className="info-message">{searchMessage}</p>}

            {searchResults.length > 0 && (
                <div>
                    <h3>Search Results</h3>
                    <ul>
                        {searchResults.map(listing => (
                            <li key={listing.id}>
                                {listing.title} - Rate: ${listing.ratePerHr}/hr - By Cleaner: {listing.cleanerId}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <hr />

            <h2>Your Service Listings</h2>
            {loadingListings ? (
                <p>Loading your listings...</p>
            ) : listingsError ? (
                <p className="error-message">{listingsError}</p>
            ) : serviceListings.length > 0 ? (
                <div className="service-listings-container">
                    {serviceListings.map(listing => (
                        <div key={listing.id} className="service-listing-item">
                            <h3>{listing.title}</h3>
                            <p>Service Type: {listing.serviceType}</p>
                            <p>Rate: ${listing.ratePerHr}/hr</p>
                            <p>{listing.description}</p>
                            <button onClick={() => getListingDetails(listing.id)}>View Details</button>
                            <button onClick={() => openEditModal(listing)}>Edit</button>
                            <button onClick={() => handleSuspendListing(listing.id)} disabled={listing.status === 'SUSPENDED'}>
                                {listing.status === 'SUSPENDED' ? 'Suspended' : 'Suspend'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't created any service listings yet.</p>
            )}
        </div>
    );
};

export default CleanerUI;
