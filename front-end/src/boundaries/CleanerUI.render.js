import React from 'react';

const renderingMethods = {
  renderCreateListing() {
    const { newListing, isCreatingListing, createListingError, createListingSuccess } = this.state;

    return (
      <div className="modal-overlay">
        <div className="edit-modal">
          <h2>Create New Service Listing</h2>
          <form onSubmit={this.handleCreateListingSubmit}>
            <div className="form-group">
              <label htmlFor="serviceCatName">Service Category:</label>
              <select
                id="serviceCatName"
                name="serviceCatName"
                value={newListing.serviceCatName}
                onChange={this.handleCreateListingInputChange}
                required
              >
                <option value="Basic Cleaning">Basic Cleaning</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Office Cleaning">Office Cleaning</option>
                <option value="Window Cleaning">Window Cleaning</option>
                <option value="Carpet Cleaning">Carpet Cleaning</option>
                <option value="Move-In/Move-Out Cleaning">Move-In/Move-Out Cleaning</option>
              </select>
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
                rows="5"
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

            <div className="modal-actions">
              <div className="modal-right-actions">
                <button 
                  type="button" 
                  onClick={() => this.setState({ showCreateForm: false })}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreatingListing} 
                  className="submit-button"
                >
                  {isCreatingListing ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </div>
          </form>
        </div>
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
                <div key={listing.id} className="listing-item">
                  <div className="listing-header">
                    <span className="service-category">{listing.serviceCatName}</span>
                    <span className="service-rate">${listing.ratePerHr}/hr</span>
                    <span className="service-by">By: {listing.cleanerUsername || 'Unknown'}</span>
                  </div>
                  <div className="listing-actions">
                    <button 
                      onClick={() => this.getListingDetails(listing.id)}
                      className="details-button"
                    >
                      View Details
                    </button>
                  </div>
                </div>
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
    const { 
      loadingListings, 
      listingsError, 
      serviceListings,
      showCreateForm,
      newListing,
      isCreatingListing,
      createListingError,
      createListingSuccess
    } = this.state;

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
                <div className="listing-header">
                  <span className="service-category">{listing.serviceCatName}</span>
                  <span className="service-rate">${listing.ratePerHr}/hr</span>
                  <span className="service-by">By: {listing.cleanerUsername || 'Unknown'}</span>
                </div>
                <div className="listing-actions">
                  <button 
                    onClick={() => this.getListingDetails(listing.id)}
                    className="details-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-listings">You haven't created any service listings yet.</div>
        )}

        <button 
          className="create-listing-button"
          onClick={() => this.setState({ showCreateForm: true })}
        >
          + Create New Listing
        </button>
        
        {this.state.showCreateForm && this.renderCreateListing()}
      </div>
    );
  },

  renderListingDetails() {
    const { listingDetails, loadingDetails, detailsError } = this.state;

    if (!listingDetails) return null;

    return (
      <div className="modal-overlay">
        <div className="details-modal">
          <h2>Listing Details</h2>
          {loadingDetails ? (
            <div className="loading">Loading details...</div>
          ) : detailsError ? (
            <div className="error-message">{detailsError}</div>
          ) : (
            <div className="details-content">
              <div className="detail-row">
                <span className="detail-label">Service Category:</span>
                <span className="detail-value">{listingDetails.serviceCatName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description:</span>
                <span className="detail-value">{listingDetails.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${listingDetails.ratePerHr}/hr</span>
              </div>
              
              <div className="modal-actions">
                <button 
                  onClick={() => this.setState({ listingDetails: null })}
                  className="cancel-button"
                  style={{ marginLeft: 'auto' }}
                >
                  Back to Listings
                </button>
              </div>
            </div>
          )}
        </div>
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
          <form onSubmit={(e) => this.handleSaveListingChanges(e)}>
            <div className="form-group">
              <label htmlFor="serviceCatName">Service Category:</label>
              <select
                id="serviceCatName"
                name="serviceCatName"
                value={editFormData.serviceCatName}
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
              <div className="modal-left-actions">
                <button 
                  type="button" 
                  onClick={() => this.handleToggleListingStatus(editFormData.id)}
                  className={editFormData.status === 'SUSPENDED' ? 'activate-button' : 'suspend-button'}
                  disabled={this.state.isSuspending}
                >
                  {this.state.isSuspending ? 'Processing...' : 
                   editFormData.status === 'SUSPENDED' ? 'Activate Listing' : 'Suspend Listing'}
                </button>
              </div>
              <div className="modal-right-actions">
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
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default renderingMethods;
