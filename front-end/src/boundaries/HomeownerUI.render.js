import React from 'react';

// This object holds all the rendering methods for HomeownerUI.
const renderingMethods = {
  // Render the homeowner navbar with your requested tabs
  renderHomeownerNavbar() {
    const { activeTab } = this.state;
    const { username } = this.props;

    return (
      <nav className="navbar homeowner-navbar">
        <ul className="navbar-nav">
          <li className={`nav-item ${activeTab === 'browseCleaners' ? 'active' : ''}`}>
            <button
              className="nav-link"
              onClick={() => this.navigateTo('browseCleaners')}
            >
              Browse Cleaners
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'saved' ? 'active' : ''}`}>
            <button
              className="nav-link"
              onClick={() => this.navigateTo('saved')}
            >
              Saved
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'booked' ? 'active' : ''}`}>
            <button
              className="nav-link"
              onClick={() => this.navigateTo('booked')}
            >
              Booked
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}>
            <button
              className="nav-link"
              onClick={() => this.navigateTo('history')}
            >
              My History
            </button>
          </li>
        </ul>

        <div className="navbar-user">
          <span className="user-greeting">Welcome, {username}</span>
          <button className="logout-button" onClick={this.props.onLogout}>
            Logout
          </button>
        </div>
      </nav>
    );
  },

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
                    <span className="cleaner-rating">★ {cleaner.rating}/5</span>
                  </div>

                  <div className="cleaner-details">
                    <p><strong>Rate/hour:</strong> {cleaner.price}</p>
                    <p><strong>Description:</strong> {cleaner.description}</p>
                    <p><strong>Services:</strong> {cleaner.services.join(', ')}</p>
                    <p><strong>Status:</strong> {cleaner.availability}</p>
                  </div>

                  <div className="cleaner-actions">
                    <button
                      className="book-button"
                      onClick={() => this.bookCleaner(cleaner.id)}
                    >
                      Book Now
                    </button>
                    {/* Only show save button if not already saved */}
                    {!isSaved ? (
                      <button
                        className="save-button"
                        onClick={() => this.saveCleaner(cleaner.id)}
                      >
                        <span className="save-icon">☆</span>
                        <span className="save-text">Save</span>
                      </button>
                    ) : (
                      <button
                        className="save-button saved"
                        disabled
                      >
                        <span className="save-icon">★</span>
                        <span className="save-text">Saved</span>
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
        <h2 className="page-title">Saved Cleaners</h2>

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
                  <h3>{cleaner.name}</h3>
                  <span className="cleaner-rating">★ {cleaner.rating}/5</span>
                </div>

                <div className="cleaner-details">
                  <p><strong>Rate/hour:</strong> {cleaner.price}</p>
                  <p><strong>Description:</strong> {cleaner.description || 'No description available'}</p>
                  <p><strong>Services:</strong> {Array.isArray(cleaner.services) ? cleaner.services.join(', ') : 'No services listed'}</p>
                  <p><strong>Status:</strong> {cleaner.availability || 'Unknown'}</p>
                </div>

                <div className="cleaner-actions">
                  <button
                    className="book-button full-width"
                    onClick={() => this.bookCleaner(cleaner.id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : savedCleaners && savedCleaners.length > 0 ? (
          <div className="no-results">No saved cleaners match your search</div>
        ) : (
          <div className="no-results">You haven't saved any cleaners yet</div>
        )}
      </div>
    );
  },

  // Render booked cleanings tab
  renderBookedCleanings() {
    const { bookings, filteredBookings, bookingSearchTerm, bookingsLoading } = this.state;
    
    // Filter for only upcoming bookings (Confirmed or Pending)
    const upcomingBookings = filteredBookings && filteredBookings.filter(b => {
      const status = b.status || b.matchStatus || '';
      return status === 'Confirmed' || status === 'Pending';
    });

    return (
      <div className="booked-cleanings-container">
        <h2 className="page-title">Booked Cleanings</h2>

        {/* Add search form for bookings */}
        <form onSubmit={this.handleBookingSearchSubmit} className="search-form">
          <div className="search-group">
            <input
              type="text"
              value={bookingSearchTerm || ''}
              onChange={this.handleBookingSearchChange}
              placeholder="Search by cleaner or service..."
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>

        {bookingsLoading ? (
          <div className="loading">Loading your bookings...</div>
        ) : upcomingBookings && upcomingBookings.length > 0 ? (
          <div className="bookings-list">
            {upcomingBookings.map(booking => {
              // Extract data handling differences in API response format
              const id = booking.id || booking.matchId;
              const cleanerName = booking.cleaner?.name || booking.cleanerName || 'Unknown Cleaner';
              const service = booking.service || booking.serviceType || 'Standard Service';
              const date = booking.date || (booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleDateString() : 'Unknown');
              const time = booking.time || (booking.scheduledTime ? new Date(booking.scheduledTime).toLocaleTimeString() : 'Unknown');
              const status = booking.status || booking.matchStatus || 'Confirmed';
              
              return (
                <div key={id} className="booking-card">
                  <div className="booking-header">
                    <h3>{service}</h3>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </div>

                  <div className="booking-details">
                    <p><strong>Cleaner:</strong> {cleanerName}</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Time:</strong> {time}</p>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="view-details-button"
                      onClick={() => this.viewBookingDetails && this.viewBookingDetails(id)}
                    >
                      View Details
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => this.cancelBooking && this.cancelBooking(id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : bookings && bookings.some(b => {
          const status = b.status || b.matchStatus || '';
          return status === 'Confirmed' || status === 'Pending';
        }) ? (
          <div className="no-results">No bookings match your search</div>
        ) : (
          <div className="no-results">You don't have any upcoming bookings</div>
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
    const { message, activeTab } = this.state;

    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Homeowner Dashboard</h1>
        </header>

        {/* Homeowner navbar */}
        {this.renderHomeownerNavbar()}

        <main className="app-content">
          <div className="homeowner-ui-container">
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Render the appropriate tab content */}
            {activeTab === 'browseCleaners' && this.renderBrowseCleaners()}
            {activeTab === 'saved' && this.renderSavedCleaners()}
            {activeTab === 'booked' && this.renderBookedCleanings()}
            {activeTab === 'history' && this.renderCleaningHistory()}
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