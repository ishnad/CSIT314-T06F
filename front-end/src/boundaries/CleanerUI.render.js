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
              <label htmlFor="name">Listing Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newListing.name}
                onChange={this.handleCreateListingInputChange}
                placeholder="Name your service listing"
                required
                minLength="2"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serviceCatName">Service Category:</label>
              <select
                id="serviceCatName"
                name="serviceCatName"
                value={newListing.serviceCatName}
                onChange={this.handleCreateListingInputChange}
                required
              >
                {this.state.serviceCategories?.map(category => (
                  <option key={category.id} value={category.serviceCatName}>
                    {category.serviceCatName}
                  </option>
                ))}
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
        <h2>{searchKeyword ? 'Search Results' : 'All Listings'}</h2>
        
        <div className="filters" style={{ 
          display: 'flex', 
          alignItems: 'flex-end',
          gap: '20px',
          marginBottom: '30px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          color: 'black'
        }}>
          <form onSubmit={this.handleSearchSubmit} style={{ display: 'flex', gap: '20px', width: '100%' }}>
            <div className="search-group" style={{ flex: 2, alignSelf: 'flex-end' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'black' }}>Search:</label>
              <input
                type="text"
                id="keyword"
                value={searchKeyword}
                onChange={this.handleSearchInputChange}
                placeholder="Search service types or descriptions..."
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            <div className="filter-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Service Category:</label>
              <select
                name="serviceType"
                value={this.state.searchFilters.serviceType || ''}
                onChange={this.handleSearchFilterChange}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="">All Services</option>
                {this.state.serviceCategories?.map(category => (
                  <option key={category.id} value={category.serviceCatName}>
                    {category.serviceCatName}
                  </option>
                ))}
              </select>
            </div>

            <div className="price-range-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Min $</label>
                <input
                  type="number"
                  name="minRate"
                  value={this.state.searchFilters.minRate || ''}
                  onChange={this.handleSearchFilterChange}
                  min="0"
                  step="0.01"
                  style={{ width: '80px', padding: '8px' }}
                />
              </div>
              <span>-</span>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Max $</label>
                <input
                  type="number"
                  name="maxRate"
                  value={this.state.searchFilters.maxRate || ''}
                  onChange={this.handleSearchFilterChange}
                  min="0"
                  step="0.01"
                  style={{ width: '80px', padding: '8px' }}
                />
              </div>
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
                disabled={searchLoading}
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

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
                    <span className="service-category">{listing.name}</span>
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
      showCreateForm, // Destructured showCreateForm for consistency
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
                  <span className="service-category">{listing.name}</span>
                  <span className="service-rate">${listing.ratePerHr}/hr</span>
                  <span className="service-by">By: {listing.cleanerUsername || 'You'}</span>
                </div>
                <div className="listing-actions">
                  <button
                    onClick={() => this.getListingDetails(listing.id)}
                    className="details-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => this.openEditModal(listing)} // Ensure openEditModal is bound and available
                    className="edit-button" // Added a class for styling
                    style={{ marginLeft: '10px' }} // Example styling
                  >
                    Edit
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

        {/* Use destructured variable 'showCreateForm' */}
        {showCreateForm && this.renderCreateListing()}
      </div>
    );
  },

  renderListingDetails() {
    const { listingDetails, loadingDetails, detailsError } = this.state;

    // Early return if no listingDetails, or if it's selected but not yet loaded.
    // The `selectedListingId` state in CleanerUI.js indicates a request to show details.
    // This function should only render if listingDetails is populated.
    if (!this.state.selectedListingId || (!listingDetails && !loadingDetails && !detailsError)) {
        return null;
    }
    // If loading or error, modal structure might still be useful
    if (!listingDetails && !loadingDetails && detailsError) {
       // To show error within modal
    } else if (!listingDetails && !loadingDetails) {
        return null; // Nothing to show yet
    }


    return (
      <div className="modal-overlay">
        <div className="details-modal">
          <h2>Listing Details</h2>
          {loadingDetails ? (
            <div className="loading">Loading details...</div>
          ) : detailsError ? (
            <div className="error-message">{detailsError}</div>
          ) : listingDetails ? ( // Ensure listingDetails is not null before accessing its properties
            <div className="details-content">
              <div className="detail-row">
                <h3 style={{ margin: '0 0 10px 0' }}>{listingDetails.name}</h3>
              </div>
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
                  onClick={() => this.setState({ selectedListingId: null, listingDetails: null })} // Clear selectedListingId too
                  className="cancel-button"
                  style={{ marginLeft: 'auto' }}
                >
                  Back to Listings
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  },

  renderInsights() {
    const { profileInsights, shortlistCount, insightsLoading, insightsError } = this.state;

    return (
      <div className="insights-container">
        <div className="white-box" style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          margin: '20px 0',
          '.insight-chart': {
            display: 'flex',
            justifyContent: 'space-between',
            height: '150px',
            marginTop: '20px',
            '.chart-bar': {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '12%',
              '.bar-container': {
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                position: 'relative'
              },
              '.bar-fill': {
                width: '100%',
                transition: 'height 0.3s ease',
                borderRadius: '4px 4px 0 0'
              },
              '.bar-value': {
                position: 'absolute',
                top: '-25px',
                fontSize: '12px',
                fontWeight: 'bold'
              },
              '.bar-label': {
                marginTop: '5px',
                fontSize: '12px',
                fontWeight: 'bold'
              }
            }
          }
        }}>
          <h2>Profile Insights</h2>

          {insightsLoading ? (
            <div className="loading">Loading insights...</div>
          ) : insightsError ? (
            <div className="error-message">{insightsError}</div>
          ) : (
            <div className="insights-grid">
              <div className="insight-card">
                <h3>Profile Views</h3>
                {profileInsights && profileInsights.totalViews !== undefined ? (
                  <>
                    <div className="insight-value">{profileInsights.totalViews}</div>
                    <div className="insight-label">Total Views</div>
                    <div className="insight-chart">
                      {profileInsights.dailyViewsLastWeek && profileInsights.dailyViewsLastWeek.map((day, index) => {
                        const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(day.date).getDay()];
                        const hasViews = day.views > 0;
                        // Calculate bar height based on the maximum views in the week to normalize heights
                        const maxViews = Math.max(...profileInsights.dailyViewsLastWeek.map(d => d.views), 1);
                        const barHeight = Math.max(10, (day.views / maxViews) * 100);
                        return (
                          <div key={day.date || index} className="chart-bar">
                            <div className="bar-container">
                              <div
                                className="bar-fill"
                                style={{ 
                                  height: `${barHeight}%`,
                                  backgroundColor: hasViews ? '#4a6fa5' : '#e0e0e0'
                                }}
                              ></div>
                              {hasViews && (
                                <div className="bar-value">{day.views}</div>
                              )}
                            </div>
                            <div className="bar-label">
                              {dayName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="no-data">No view data available</div>
                )}
              </div>

              <div className="insight-card">
                <h3>Shortlisted By</h3>
                {/* shortlistCount from state is directly the number after fetchShortlistCount */}
                {shortlistCount !== null && shortlistCount !== undefined ? (
                  <>
                    {/* Corrected: shortlistCount is the value itself */}
                    <div className="insight-value">{shortlistCount}</div>
                    <div className="insight-label">Homeowners</div>
                  </>
                ) : (
                  <div className="no-data">No shortlist data available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div> // Missing closing div for insights-container, assuming it was intended here or above.
            // Based on indentation, it seems the one for insights-white-box is the one before this comment.
            // The outer one for insights-container is likely missing if this is the end of the function.
            // Correcting this:
    ); // This parenthesis closes the return statement. The div for insights-container is the outermost.
  }, // This comma was missing if renderInsights was the last method before renderEditModal. Add if necessary.

  renderEditModal() {
    // Ensure editFormData in CleanerUI's state is populated with id and status by openEditModal
    const { showEditModal, editFormData, isSavingChanges, editError, editingListingId, isSuspending } = this.state;

    if (!showEditModal || !editFormData) return null; // Add check for editFormData

    return (
      <div className="modal-overlay">
        <div className="edit-modal">
          <h2>Edit Listing</h2>
          {/* Pass the event to handleSaveListingChanges if it uses e.preventDefault() */}
          <form onSubmit={this.handleSaveListingChanges}>
            <div className="form-group">
              <label htmlFor="editName">Listing Name:</label>
              <input
                type="text"
                id="editName"
                name="name"
                value={editFormData.name || ''}
                onChange={this.handleEditInputChange}
                required
                minLength="2"
                maxLength="100"
                disabled={isSavingChanges} // Disable while saving
              />
            </div>

            <div className="form-group">
              <label htmlFor="editServiceCatName">Service Category:</label> {/* Changed id to avoid conflict if create form is also in DOM */}
              <select
                id="editServiceCatName"
                name="serviceCatName"
                value={editFormData.serviceCatName || ''}
                onChange={this.handleEditInputChange}
                required
              >
                {this.state.serviceCategories?.map(category => (
                  <option key={category.id} value={category.serviceCatName}>
                    {category.serviceCatName}
                  </option>
                ))}
              </select>
            </div>

            {/* Add title field if it's editable */}
            {/* Example for title:
            <div className="form-group">
              <label htmlFor="editTitle">Title:</label>
              <input
                type="text"
                id="editTitle"
                name="title"
                value={editFormData.title || ''}
                onChange={this.handleEditInputChange}
                required
              />
            </div>
            */}

            <div className="form-group">
              <label htmlFor="editDescription">Description</label>
              <textarea
                id="editDescription"
                name="description"
                value={editFormData.description || ''}
                onChange={this.handleEditInputChange}
                required
                rows="4" // Example
              />
            </div>
            <div className="form-group">
              <label htmlFor="editRatePerHr">Rate per hour ($)</label>
              <input
                type="number"
                id="editRatePerHr"
                name="ratePerHr"
                value={editFormData.ratePerHr || ''}
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
                  // Use editingListingId for the action, and editFormData.status for display logic
                  onClick={() => this.handleToggleListingStatus(editingListingId)}
                  className={editFormData.status === 'SUSPENDED' ? 'activate-button' : 'suspend-button'}
                  disabled={isSuspending} // Use isSuspending from state
                >
                  {isSuspending ? 'Processing...' :
                    editFormData.status === 'SUSPENDED' ? 'Activate Listing' : 'Suspend Listing'}
                </button>
              </div>
              <div className="modal-right-actions">
                <button
                  type="submit"
                  disabled={isSavingChanges}
                  className="save-button" // Changed from submit-button to save-button for clarity
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
  } // No comma if this is the last method in the object
};

export default renderingMethods;
