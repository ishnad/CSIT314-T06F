import React from 'react';

// This object holds all the rendering methods for HomeownerUI.
const renderingMethods = {

  // Render browse cleaners tab
  renderBrowseCleaners() {
    const { cleaners, filteredCleaners, searchTerm, loading, savedCleaners } = this.state;

    return (
      <div className="browse-cleaners-container">
        <h2 className="page-title">Browse Cleaners</h2>

        {/* Search form */}
        <form onSubmit={this.handleSearchSubmit} className="search-form">
          <div className="search-group">
            <input
              type="text"
              value={searchTerm || ''}
              onChange={this.handleSearchChange}
              placeholder="Search by name or service..."
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>

        {/* Cleaners list */}
        {loading ? (
          <div className="loading">Loading cleaners...</div>
        ) : filteredCleaners && filteredCleaners.length > 0 ? (
          <div className="cleaners-grid">
            {filteredCleaners.map(cleaner => {
              // Check if this cleaner is already saved
              const isSaved = savedCleaners && savedCleaners.some(saved => saved.id === cleaner.id);

              return (
                <div key={cleaner.id} className="cleaner-card">
                  <div className="cleaner-header">
                    <h3>{cleaner.name}</h3>
                  </div>

                  <div className="cleaner-details">
                    <p><strong>Services:</strong> {cleaner.services.join(', ')}</p>
                  </div>

                  <div className="cleaner-actions">
                    <button
                      className="view-profile-button"
                      onClick={() => this.viewCleanerProfile(cleaner.id)}
                    >
                      View Profile
                    </button>
                    {/* Only show shortlist button if not already saved */}
                    {!isSaved ? (
                      <button
                        className="save-button"
                        onClick={() => this.saveCleaner(cleaner.id)}
                      >
                        <span className="save-icon">☆</span>
                        <span className="save-text">Shortlist</span>
                      </button>
                    ) : (
                      <button
                        className="save-button saved"
                        disabled
                      >
                        <span className="save-icon">★</span>
                        <span className="save-text">Shortlisted</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">No cleaners found matching your search criteria</div>
        )}
      </div>
    );
  },

  // Render saved cleaners tab
  renderSavedCleaners() {
    const { savedCleaners, filteredSavedCleaners, savedSearchTerm, savedCleanersLoading } = this.state;

    return (
      <div className="saved-cleaners-container">
        <h2 className="page-title">Shortlisted Cleaners</h2>

        {/* Add search form for saved cleaners */}
        <form onSubmit={this.handleSavedSearchSubmit} className="search-form">
          <div className="search-group">
            <input
              type="text"
              value={savedSearchTerm || ''}
              onChange={this.handleSavedSearchChange}
              placeholder="Search saved cleaners..."
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>

        {savedCleanersLoading ? (
          <div className="loading">Loading saved cleaners...</div>
        ) : filteredSavedCleaners && filteredSavedCleaners.length > 0 ? (
          <div className="cleaners-grid">
            {filteredSavedCleaners.map(cleaner => (
              <div key={cleaner.id} className="cleaner-card">
                <div className="cleaner-header">
                  <h3>{cleaner.name || cleaner.username}</h3>
                </div>

                <div className="cleaner-details">
                  <p><strong>Services:</strong> {cleaner.services.join(', ')}</p>
                </div>

                <div className="cleaner-actions">
                  <button
                    className="view-profile-button"
                    onClick={() => this.viewCleanerProfile(cleaner.id)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : savedCleaners && savedCleaners.length > 0 ? (
          <div className="no-results">No shortlisted cleaners match your search</div>
        ) : (
          <div className="no-results">You haven't shortlisted any cleaners yet</div>
        )}
      </div>
    );
  },


  // Render history tab - UPDATED to remove interactive rating
  renderCleaningHistory() {
    const { history, filteredHistory, historySearchTerm, historyLoading } = this.state;
    
    return (
      <div className="cleaning-history-container">
        <h2 className="page-title">Cleaning History</h2>
        
        {/* Add search form for history */}
        <form onSubmit={this.handleHistorySearchSubmit} className="search-form">
          <div className="search-group">
            <input
              type="text"
              value={historySearchTerm || ''}
              onChange={this.handleHistorySearchChange}
              placeholder="Search your cleaning history..."
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>

        {historyLoading ? (
          <div className="loading">Loading your cleaning history...</div>
        ) : filteredHistory && filteredHistory.length > 0 ? (
          <div className="history-list">
            {filteredHistory.map(item => {
              // Extract data handling differences in API response format
              const id = item.id || item.matchId || item.bookingId;
              const cleanerName = item.cleaner?.name || item.cleanerName || 'Unknown Cleaner';
              const service = item.service || item.serviceType || 'Standard Service';
              const date = item.date || 
                        (item.completedDate ? new Date(item.completedDate).toLocaleDateString() : 
                        (item.scheduledTime ? new Date(item.scheduledTime).toLocaleDateString() : 'Unknown'));
              const time = item.time || 
                        (item.completedDate ? new Date(item.completedDate).toLocaleTimeString() : 
                        (item.scheduledTime ? new Date(item.scheduledTime).toLocaleTimeString() : 'Unknown'));
              const status = item.status || item.matchStatus || 'Completed';
              const rating = item.rating || item.cleanerRating || 0; // Display rating if it exists
              
              return (
                <div key={id} className="history-card">
                  <div className="history-header">
                    <h3>{service}</h3>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>
                  
                  <div className="history-details">
                    <p><strong>Cleaner:</strong> {cleanerName}</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time:</strong> {time}</p>
                    
                    {/* Show rating as read-only if it exists */}
                    {rating > 0 && (
                      <div className="rating-display">
                        <p><strong>Your Rating:</strong> {rating}/5</p>
                        <div className="stars readonly">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span 
                              key={star}
                              className={`star ${rating >= star ? 'filled' : ''}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {status === 'Completed' && (
                    <button 
                      className="book-again-button"
                      onClick={() => this.bookAgain && this.bookAgain(id)}
                    >
                      Book Again
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results">You don't have any cleaning history yet</div>
        )}
      </div>
    );
  },

  // Main render method for the homeowner UI
  renderHomeowner() {
    const { message, activeTab, showCleanerProfile, selectedCleaner } = this.state;
    console.log('Current activeTab:', activeTab); // Debug log

    return (
      <div className="app-container">
        {showCleanerProfile && selectedCleaner && (
          <div className="cleaner-profile-modal">
            <div className="modal-content">
              <button 
                className="close-button"
                onClick={this.closeCleanerProfile}
              >
                &times;
              </button>
              
              <h2>{selectedCleaner.username}'s Services</h2>
              
              {selectedCleaner.serviceListings?.length > 0 ? (
                <div className="service-listings">
                  {selectedCleaner.serviceListings.map(service => (
                    <div key={service.id} className="service-card">
                      <h3>{service.serviceType || 'Cleaning Service'}</h3>
                      <p><strong>Description:</strong> {service.description}</p>
                      <p><strong>Rate:</strong> ${service.ratePerHr}/hour</p>
                      <button 
                        className="book-service-button"
                        onClick={() => this.bookService(selectedCleaner.id, service.id)}
                      >
                        Book This Service
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>This cleaner hasn't listed any services yet.</p>
              )}
            </div>
          </div>
        )}
        <main className="app-content">
          <div className="homeowner-ui-container">
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Render the appropriate tab content */}
            {/* Using a switch statement for better tab management */}
            {(() => {
              switch(activeTab) {
                case 'browseCleaners':
                  return this.renderBrowseCleaners();
                case 'saved':
                  return this.renderSavedCleaners();
                case 'history': 
                  return this.renderCleaningHistory();
                default:
                  return this.renderBrowseCleaners(); // Fallback
              }
            })()}
          </div>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} CleanConnect</p>
        </footer>
      </div>
    );
  }
};

export default renderingMethods;
