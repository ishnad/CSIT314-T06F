import React from 'react';

const renderingMethods = {
  renderCreateListing() {
    const { newListing, isCreatingListing, createListingError, createListingSuccess } = this.state;

    return (
      <div className="create-listing-container">
        <h2>Create New Service Listing</h2>
        <form onSubmit={this.handleCreateListingSubmit}>
          <div className="form-group">
            <label htmlFor="serviceType">Service Type:</label>
            <select
              id="serviceType"
              name="serviceType"
              value={newListing.serviceType}
              onChange={this.handleCreateListingInputChange}
              required
            >
              <option value="Basic Cleaning">Basic Cleaning</option>
              <option value="Deep Cleaning">Deep Cleaning</option>
              <option value="Office Cleaning">Office Cleaning</option>
              <option value="Window Cleaning">Window Cleaning</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newListing.title}
              onChange={this.handleCreateListingInputChange}
              placeholder="Listing title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={newListing.description}
              onChange={this.handleCreateListingInputChange}
              placeholder="Describe your service in detail"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ratePerHr">Rate per hour ($):</label>
            <input
              type="number"
              id="ratePerHr"
              name="ratePerHr"
              value={newListing.ratePerHr}
              onChange={this.handleCreateListingInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          {createListingError && <div className="error-message">{createListingError}</div>}
          {createListingSuccess && <div className="success-message">{createListingSuccess}</div>}

          <button type="submit" disabled={isCreatingListing} className="submit-button">
            {isCreatingListing ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    );
  },
  renderSearchListings() {
    const { searchKeyword, searchLoading, searchError, searchMessage, searchResults } = this.state;

    return (
      <div className="search-listings-container">
        <h2>{this.state.searchKeyword ? 'Search Results' : 'All Listings'}</h2>
        <form onSubmit={this.handleSearchSubmit}>
          <div className="search-group">
            <label htmlFor="keyword">Search Keyword:</label>
            <input
              type="text"
              id="keyword"
              value={searchKeyword}
              onChange={this.handleSearchInputChange}
              placeholder="Search for services..."
            />
            <button type="submit" disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searchLoading && <div className="loading">Searching for listings...</div>}
        {searchError && <div className="error-message">Error: {searchError}</div>}
        {searchMessage && <div className="info-message">{searchMessage}</div>}

        {searchResults.length > 0 ? (
          <div className="search-results">
            <h3>{searchKeyword ? 'Search Results' : 'Available Listings'}</h3>
            <ul className="results-list">
              {searchResults.map(listing => (
                <li key={listing.id} className="listing-item">
                  <h4>{listing.title}</h4>
                  <p>Service Type: {listing.serviceType}</p>
                  <p>Rate: ${listing.ratePerHr}/hr</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          !searchLoading && <div className="no-listings">
            {searchKeyword ? 'No matching listings found' : 'No listings available at this time'}
          </div>
        )}
      </div>
    );
  },

  renderUserListings() {
    const { loadingListings, listingsError, serviceListings } = this.state;

    return (
      <div className="user-listings-container">
        <h2>Your Service Listings</h2>
        
        {loadingListings ? (
          <div className="loading">Loading your listings...</div>
        ) : listingsError ? (
          <div className="error-message">{listingsError}</div>
        ) : serviceListings.length > 0 ? (
          <div className="listings-grid">
            {serviceListings.map(listing => (
              <div key={listing.id} className="listing-card">
                <h3>{listing.title}</h3>
                <p className="service-type">Service Type: {listing.serviceType}</p>
                <p className="rate">Rate: ${listing.ratePerHr}/hr</p>
                <p className="description">{listing.description}</p>
                <div className="listing-actions">
                  <button 
                    onClick={() => this.getListingDetails(listing.id)}
                    className="details-button"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => this.openEditModal(listing)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => this.handleToggleListingStatus(listing.id)}
                    className={listing.status === 'SUSPENDED' ? 'activate-button' : 'suspend-button'}
                  >
                    {listing.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">You haven't created any service listings yet.</div>
        )}
      </div>
    );
  },

  renderListingDetails() {
    const { listingDetails, loadingDetails, detailsError } = this.state;

    if (!listingDetails) return null;

    return (
      <div className="listing-details-container">
        <h3>Listing Details</h3>
        {loadingDetails ? (
          <div className="loading">Loading details...</div>
        ) : detailsError ? (
          <div className="error-message">{detailsError}</div>
        ) : (
          <div className="details-content">
            <h4>{listingDetails.title}</h4>
            <p><strong>Service Type:</strong> {listingDetails.serviceType}</p>
            <p><strong>Rate:</strong> ${listingDetails.ratePerHr}/hr</p>
            <p><strong>Description:</strong> {listingDetails.description}</p>
            <p><strong>Status:</strong> {listingDetails.status}</p>
          </div>
        )}
      </div>
    );
  },

  renderEditModal() {
    const { showEditModal, editFormData, isSavingChanges, editError } = this.state;

    if (!showEditModal) return null;

    return (
      <div className="modal-overlay">
        <div className="edit-modal">
          <h2>Edit Listing</h2>
          <form onSubmit={this.handleSaveListingChanges}>
            <div className="form-group">
              <label htmlFor="serviceType">Service Type:</label>
              <select
                id="serviceType"
                name="serviceType"
                value={editFormData.serviceType}
                onChange={this.handleEditInputChange}
                required
              >
                <option value="Basic Cleaning">Basic Cleaning</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Office Cleaning">Office Cleaning</option>
                <option value="Window Cleaning">Window Cleaning</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editFormData.title}
                onChange={this.handleEditInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={this.handleEditInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ratePerHr">Rate per hour ($)</label>
              <input
                type="number"
                id="ratePerHr"
                name="ratePerHr"
                value={editFormData.ratePerHr}
                onChange={this.handleEditInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            {editError && <div className="error-message">{editError}</div>}
            <div className="modal-actions">
              <button 
                type="submit" 
                disabled={isSavingChanges}
                className="save-button"
              >
                {isSavingChanges ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                onClick={this.closeEditModal}
                className="cancel-button"
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
