// PlatformManagementUI.render.js
import React from 'react';

const styles = {
  container: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    color: '#333',
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: 'calc(100% - 12px)',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '16px',
  },
  textarea: {
    width: 'calc(100% - 12px)',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '16px',
    fontFamily: 'sans-serif',
  },
  select: {
    width: 'calc(100% - 12px)',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    color: '#666',
    cursor: 'not-allowed',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    marginRight: '10px',
  },
  successMessage: {
    color: 'green',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  searchResultsContainer: {
    marginTop: '15px',
  },
  searchResultList: {
    listStyleType: 'none',
    padding: 0,
  },
  searchResultItem: {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  detailsContainer: {
    marginTop: '15px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    backgroundColor: '#fff',
  },
  detailItem: {
    marginBottom: '8px',
  },
};

const renderingMethods = {
  createServiceCategoryUI() {
    const { newCategoryName, newCategoryDescription, creationMessage, creationError, isCreating } = this.state;
    const { handleNameChange, handleDescriptionChange, handleCreateCategory, handleBackToDashboard } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Create New Service Category</h2>
        {creationMessage && <div style={styles.successMessage}>{creationMessage}</div>}
        {creationError && <div style={styles.errorMessage}>{creationError}</div>}
        <div>
          <label htmlFor="categoryName" style={styles.label}>Name:</label>
          <input type="text" id="categoryName" style={styles.input} value={newCategoryName} onChange={handleNameChange} />
        </div>
        <div>
          <label htmlFor="categoryDescription" style={styles.label}>Description:</label>
          <textarea id="categoryDescription" style={styles.textarea} value={newCategoryDescription} onChange={handleDescriptionChange} />
        </div>
        <button style={isCreating ? styles.disabledButton : styles.button} onClick={handleCreateCategory} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create'}
        </button>
      </div>
    );
  },

  renderDailyReportSection() {
    const { dailyReportData, isGeneratingReport, reportError } = this.state;
    const { handleGenerateDailyReport } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Generate Daily Report</h2>
        <button style={isGeneratingReport ? styles.disabledButton : styles.button} onClick={handleGenerateDailyReport} disabled={isGeneratingReport}>
          {isGeneratingReport ? 'Generating Report...' : 'Generate Daily Report'}
        </button>
        {reportError && <div style={styles.errorMessage}>{reportError}</div>}
        {dailyReportData && (
          <div style={styles.detailsContainer}>
            <h3 style={styles.heading}>Daily Report for {dailyReportData.date}</h3>
            <p style={styles.detailItem}>Total Logins: {dailyReportData.totalLogins}</p>
            {/* Add other relevant daily report data */}
          </div>
        )}
      </div>
    );
  },

  renderWeeklyReportSection() {
    const { weeklyReportData, isGeneratingWeeklyReport, weeklyReportError } = this.state;
    const { handleGenerateWeeklyReport } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Generate Weekly Report (New Listings)</h2>
        <button style={isGeneratingWeeklyReport ? styles.disabledButton : styles.button} onClick={handleGenerateWeeklyReport} disabled={isGeneratingWeeklyReport}>
          {isGeneratingWeeklyReport ? 'Generating Report...' : 'Generate Weekly Report'}
        </button>
        {weeklyReportError && <div style={styles.errorMessage}>{weeklyReportError}</div>}
        {weeklyReportData && weeklyReportData.length > 0 ? (
          <div style={styles.searchResultsContainer}>
            <h3 style={styles.heading}>New Service Listings This Week</h3>
            <ul style={styles.searchResultList}>
              {weeklyReportData.map(listing => (
                <li key={listing.id} style={styles.searchResultItem}>
                  {listing.serviceCatName} - Created At: {new Date(listing.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          weeklyReportData && <p>No new service listings this week.</p>
        )}
      </div>
    );
  },

  renderMonthlyReportSection() {
    const { monthlyReportData, isGeneratingMonthlyReport, monthlyReportError } = this.state;
    const { handleGenerateMonthlyReport } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Generate Monthly Revenue Report</h2>
        <button style={isGeneratingMonthlyReport ? styles.disabledButton : styles.button} onClick={handleGenerateMonthlyReport} disabled={isGeneratingMonthlyReport}>
          {isGeneratingMonthlyReport ? 'Generating Report...' : 'Generate Monthly Report'}
        </button>
        {monthlyReportError && <div style={styles.errorMessage}>{monthlyReportError}</div>}
        {monthlyReportData && (
          <div style={styles.detailsContainer}>
            <h3 style={styles.heading}>Monthly Revenue Report</h3>
            <p style={styles.detailItem}>Total Revenue: ${monthlyReportData.totalRevenue}</p>
            <p style={styles.detailItem}>Report Date: {monthlyReportData.endDate}</p>
            {/* Add other relevant monthly revenue data */}
          </div>
        )}
      </div>
    );
  },

  renderSearchCategoriesSection() {
    const { searchFilter, searchKeyword, searchResults, isSearching, searchError } = this.state;
    const { handleSearchFilterChange, handleSearchKeywordChange, handleSearchCategories } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Search Service Categories</h2>
        <div>
          <label htmlFor="searchFilter" style={styles.label}>Filter By:</label>
          <select id="searchFilter" style={styles.select} value={searchFilter} onChange={handleSearchFilterChange}>
            <option value="">All</option>
            <option value="name">Name</option>
            <option value="description">Description</option>
          </select>
        </div>
        <div>
          <label htmlFor="searchKeyword" style={styles.label}>Keyword:</label>
          <input
            type="text"
            id="searchKeyword"
            style={styles.input}
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
          />
        </div>
        <button style={isSearching ? styles.disabledButton : styles.button} onClick={handleSearchCategories} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {searchError && <div style={styles.errorMessage}>{searchError}</div>}
        {searchResults && searchResults.length > 0 ? (
          <div style={styles.searchResultsContainer}>
            <h3 style={styles.heading}>Search Results</h3>
            <ul style={styles.searchResultList}>
              {searchResults.map(category => (
                <li key={category.serviceCatID} style={styles.searchResultItem}>
                  {category.serviceCatName} - {category.serviceCatDescription}
                  <button style={styles.button} onClick={() => this.setState({ viewCategoryId: category.serviceCatID })}>View</button>
                  <button style={styles.button} onClick={() => this.setState({ viewCategoryId: category.serviceCatID }, this.handleLoadCategoryForEdit)}>Edit</button>
                  <button style={styles.button} onClick={() => this.setState({ suspendCategoryId: category.serviceCatID }, this.handleSuspendServiceCategory)}>Suspend</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          searchResults && <p>No categories found matching your search criteria.</p>
        )}
      </div>
    );
  },

  renderViewCategoryDetailsSection() {
    const { viewCategoryId, viewCategoryDetails, isViewingCategory, viewCategoryError } = this.state;
    const { handleViewCategoryInputChange, handleViewCategoryDetails, handleLoadCategoryForEdit } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>View/Edit Service Category</h2>
        <div>
          <label htmlFor="viewCategoryId" style={styles.label}>Category ID:</label>
          <input
            type="text"
            id="viewCategoryId"
            style={styles.input}
            value={viewCategoryId}
            onChange={handleViewCategoryInputChange}
          />
          <button style={isViewingCategory ? styles.disabledButton : styles.button} onClick={handleViewCategoryDetails} disabled={isViewingCategory}>
            {isViewingCategory ? 'Loading...' : 'View Details'}
          </button>
          <button style={styles.button} onClick={handleLoadCategoryForEdit} disabled={isViewingCategory || !viewCategoryId}>
            Edit Category
          </button>
        </div>
        {viewCategoryError && <div style={styles.errorMessage}>{viewCategoryError}</div>}
        {viewCategoryDetails && (
          <div style={styles.detailsContainer}>
            <h3 style={styles.heading}>Category Details</h3>
            <p style={styles.detailItem}>ID: {viewCategoryDetails.serviceCatID}</p>
            <p style={styles.detailItem}>Name: {viewCategoryDetails.serviceCatName}</p>
            <p style={styles.detailItem}>Description: {viewCategoryDetails.serviceCatDescription}</p>
            <p style={styles.detailItem}>Status: {viewCategoryDetails.serviceCatStatus}</p>
          </div>
        )}
      </div>
    );
  },

  renderEditCategorySection() {
    const { editCategoryId, editCategoryName, editCategoryDescription, isEditingCategory, editCategoryMessage, editCategoryError } = this.state;
    const { handleEditCategoryInputChange, handleEditCategorySubmit } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Edit Service Category</h2>
        {editCategoryMessage && <div style={styles.successMessage}>{editCategoryMessage}</div>}
        {editCategoryError && <div style={styles.errorMessage}>{editCategoryError}</div>}
        <div>
          <label htmlFor="editCategoryId" style={styles.label}>Category ID:</label>
          <input type="text" id="editCategoryId" style={styles.input} value={editCategoryId} readOnly />
        </div>
        <div>
          <label htmlFor="editCategoryName" style={styles.label}>Name:</label>
          <input
            type="text"
            id="editCategoryName"
            style={styles.input}
            name="editCategoryName"
            value={editCategoryName}
            onChange={handleEditCategoryInputChange}
          />
        </div>
        <div>
          <label htmlFor="editCategoryDescription" style={styles.label}>Description:</label>
          <textarea
            id="editCategoryDescription"
            style={styles.textarea}
            name="editCategoryDescription"
            value={editCategoryDescription}
            onChange={handleEditCategoryInputChange}
          />
        </div>
        <button style={isEditingCategory ? styles.disabledButton : styles.button} onClick={handleEditCategorySubmit} disabled={isEditingCategory}>
          {isEditingCategory ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    );
  },

  renderSuspendCategorySection() {
    const { suspendCategoryId, isSuspendingCategory, suspendCategoryMessage, suspendCategoryError } = this.state;
    const { handleSuspendCategoryInputChange, handleSuspendServiceCategory } = this;

    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Suspend Service Category</h2>
        {suspendCategoryMessage && <div style={styles.successMessage}>{suspendCategoryMessage}</div>}
        {suspendCategoryError && <div style={styles.errorMessage}>{suspendCategoryError}</div>}
        <div>
          <label htmlFor="suspendCategoryId" style={styles.label}>Category ID:</label>
          <input
            type="text"
            id="suspendCategoryId"
            style={styles.input}
            value={suspendCategoryId}
            onChange={handleSuspendCategoryInputChange}
          />
        </div>
        <button style={isSuspendingCategory ? styles.disabledButton : styles.button} onClick={handleSuspendServiceCategory} disabled={isSuspendingCategory}>
          {isSuspendingCategory ? 'Suspending...' : 'Suspend Category'}
        </button>
      </div>
    );
  },
};

export default renderingMethods;
