import React, { Component } from 'react';
import renderingMethods from './PlatformManagementUI.render';


class PlatformManagementUI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Service Category Creation
      newCategoryName: '',
      newCategoryDescription: '',
      creationMessage: null,
      creationError: null,
      isCreating: false,

      // Daily Report Generation
      dailyReportData: null,
      isGeneratingReport: false,
      reportError: null,

      // Weekly Report Generation
      weeklyReportData: null,
      isGeneratingWeeklyReport: false,
      weeklyReportError: null,

      // Monthly Report Generation
      monthlyReportData: null,
      isGeneratingMonthlyReport: false,
      monthlyReportError: null,

      // Search Categories
      searchFilter: '',
      searchKeyword: '',
      searchResults: null,
      isSearching: false,
      searchError: null,

      // View Category Details
      viewCategoryId: '',
      viewCategoryDetails: null,
      isViewingCategory: false,
      viewCategoryError: null,

      // Edit Category
      editCategoryId: '',
      editCategoryName: '',
      editCategoryDescription: '',
      isEditingCategory: false,
      editCategoryMessage: null,
      editCategoryError: null,

      // Suspend Category
      suspendCategoryId: '',
      isSuspendingCategory: false,
      suspendCategoryMessage: null,
      suspendCategoryError: null,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.handleBackToDashboard = this.handleBackToDashboard.bind(this);
    this.handleGenerateDailyReport = this.handleGenerateDailyReport.bind(this);
    this.handleGenerateWeeklyReport = this.handleGenerateWeeklyReport.bind(this);
    this.handleGenerateMonthlyReport = this.handleGenerateMonthlyReport.bind(this);
    this.handleSearchFilterChange = this.handleSearchFilterChange.bind(this);
    this.handleSearchKeywordChange = this.handleSearchKeywordChange.bind(this);
    this.handleSearchCategories = this.handleSearchCategories.bind(this);
    this.handleViewCategoryInputChange = this.handleViewCategoryInputChange.bind(this);
    this.handleViewCategoryDetails = this.handleViewCategoryDetails.bind(this);
    this.handleEditCategoryInputChange = this.handleEditCategoryInputChange.bind(this);
    this.handleLoadCategoryForEdit = this.handleLoadCategoryForEdit.bind(this);
    this.handleEditCategorySubmit = this.handleEditCategorySubmit.bind(this);
    this.handleSuspendCategoryInputChange = this.handleSuspendCategoryInputChange.bind(this);
    this.handleSuspendServiceCategory = this.handleSuspendServiceCategory.bind(this);
  }

  componentDidMount() {
    if (this.props.currentPage === 'searchServiceCategories') {
      this.handleSearchCategories();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentPage === 'searchServiceCategories' && prevProps.currentPage !== 'searchServiceCategories') {
      this.handleSearchCategories();
    }
  }

  handleNameChange(event) {
    this.setState({ newCategoryName: event.target.value });
  }

  handleDescriptionChange(event) {
    this.setState({ newCategoryDescription: event.target.value });
  }

  async handleCreateCategory() {
    this.setState({ isCreating: true, creationMessage: null, creationError: null });
    const { newCategoryName, newCategoryDescription } = this.state;

    try {
      const res = await fetch('http://localhost:3001/api/service-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceCatName: newCategoryName,
          serviceCatDescription: newCategoryDescription
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      this.setState({
        newCategoryName: '',
        newCategoryDescription: '',
        creationMessage: `Category "${newCategoryName}" created successfully!`
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        this.setState({ creationMessage: null });
      }, 3000);

    } catch (err) {
      this.setState({
        creationError: `Error creating category: ${err.message}`
      });

      setTimeout(() => {
        this.setState({ creationError: null });
      }, 3000);
    } finally {
      this.setState({ isCreating: false });
    }
  }

  handleBackToDashboard() {
    console.log('Back to dashboard...');
  }


  async handleGenerateDailyReport() {
    this.setState({ isGeneratingReport: true, dailyReportData: null, reportError: null });

    try {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 1); // 24 hours ago
      
      const response = await fetch(`http://localhost:3001/api/reports/daily?start=${startDate.toISOString()}&end=${endDate.toISOString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ dailyReportData: data });
      } else {
        this.setState({ reportError: data.error || 'Failed to generate daily report.' });
      }
    } catch (error) {
      console.error('Error generating daily report:', error);
      this.setState({ reportError: 'Server error while generating report.' });
    } finally {
      this.setState({ isGeneratingReport: false });
    }
  }


  async handleGenerateWeeklyReport() {
    this.setState({ isGeneratingWeeklyReport: true, weeklyReportData: null, weeklyReportError: null });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    try {
      // Get current time in UTC
      const endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999); // End of current day in UTC
      
      // Calculate start date (7 days ago) in UTC
      const startDate = new Date(endDate);
      startDate.setUTCDate(startDate.getUTCDate() - 7);
      startDate.setUTCHours(0, 0, 0, 0); // Start of day 7 days ago in UTC
      
      console.log('Fetching weekly report for UTC dates:', startDate.toISOString(), 'to', endDate.toISOString());
      const response = await fetch(`http://localhost:3001/api/reports/weekly-service-trends?start=${startDate.toISOString()}&end=${endDate.toISOString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ 
          weeklyReportData: data.detailedNewListings || [],
          weeklyReportTrends: data.newListingTrendsByCategory || {}
        });
      } else {
        this.setState({ weeklyReportError: data.error || 'Failed to generate weekly report.' });
      }
    } catch (error) {
      console.error('Error generating weekly report:', error);
      this.setState({ weeklyReportError: 'Server error while generating weekly report.' });
    } finally {
      this.setState({ isGeneratingWeeklyReport: false });
    }
  }


  async handleGenerateMonthlyReport() {
    this.setState({ isGeneratingMonthlyReport: true, monthlyReportData: null, monthlyReportError: null });

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    try {
      const response = await fetch('http://localhost:3001/api/reports/monthly-revenue', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ monthlyReportData: data });
      } else {
        this.setState({ monthlyReportError: data.error || 'Failed to generate monthly revenue report.' });
      }
    } catch (error) {
      console.error('Error generating monthly revenue report:', error);
      this.setState({ monthlyReportError: 'Server error while generating monthly revenue report.' });
    } finally {
      this.setState({ isGeneratingMonthlyReport: false });
    }
  }

  handleSearchFilterChange(event) {
    this.setState({ searchFilter: event.target.value });
  }

  handleSearchKeywordChange(event) {
    this.setState({ searchKeyword: event.target.value });
  }

  async handleSearchCategories() {
    this.setState({ isSearching: true, searchResults: null, searchError: null });
    const { searchFilter, searchKeyword } = this.state;

    try {
      // Always send the search request even with empty params
      const params = new URLSearchParams();
      params.append('filter', searchFilter);
      params.append('keyword', searchKeyword || '');
      
      const response = await fetch(`/api/service-categories/search?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ searchResults: data }); // Data is already the categories array
      } else {
        const errorText = await response.text();
        this.setState({ searchError: errorText || 'Failed to search categories.' });
      }
    } catch (error) {
      console.error('Error searching categories:', error);
      this.setState({ searchError: 'Server error while searching categories.' });
    } finally {
      this.setState({ isSearching: false });
    }
  }

  handleViewCategoryInputChange(event) {
    this.setState({ viewCategoryId: event.target.value });
  }

  async handleViewCategoryDetails() {
    this.setState({ isViewingCategory: true, viewCategoryDetails: null, viewCategoryError: null });
    const { viewCategoryId } = this.state;

    if (!viewCategoryId) {
      this.setState({ viewCategoryError: 'Please enter a Category ID.' });
      this.setState({ isViewingCategory: false });
      return;
    }

    try {
      const response = await fetch(`/api/service-categories/${viewCategoryId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ viewCategoryDetails: data.category });
      } else if (response.status === 404) {
        this.setState({ viewCategoryError: 'Category not found.' });
      } else {
        this.setState({ viewCategoryError: data.error || 'Failed to retrieve category details.' });
      }
    } catch (error) {
      console.error('Error retrieving category details:', error);
      this.setState({ viewCategoryError: 'Server error while retrieving category details.' });
    } finally {
      this.setState({ isViewingCategory: false });
    }
  }

  handleEditCategoryInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleLoadCategoryForEdit() {
    this.setState({ isViewingCategory: true, viewCategoryDetails: null, viewCategoryError: null, editCategoryMessage: null, editCategoryError: null });
    const { viewCategoryId } = this.state;

    if (!viewCategoryId) {
      this.setState({ viewCategoryError: 'Please enter a Category ID to edit.' });
      this.setState({ isViewingCategory: false });
      return;
    }

    try {
      const response = await fetch(`/api/service-categories/${viewCategoryId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({
          editCategoryId: data.category.serviceCatID,
          editCategoryName: data.category.serviceCatName,
          editCategoryDescription: data.category.serviceCatDescription,
          viewCategoryDetails: data.category, 
        });
      } else if (response.status === 404) {
        this.setState({ viewCategoryError: 'Category not found for editing.' });
      } else {
        this.setState({ viewCategoryError: data.error || 'Failed to load category for editing.' });
      }
    } catch (error) {
      console.error('Error loading category for editing:', error);
      this.setState({ viewCategoryError: 'Server error while loading category for editing.' });
    } finally {
      this.setState({ isViewingCategory: false });
    }
  }

  async handleEditCategorySubmit() {
    this.setState({ isEditingCategory: true, editCategoryMessage: null, editCategoryError: null });
    const { editCategoryId, editCategoryName, editCategoryDescription } = this.state;

    try {
      const response = await fetch(`/api/service-categories/${editCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceCatName: editCategoryName, serviceCatDescription: editCategoryDescription }),
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ editCategoryMessage: data.message || 'Category updated successfully.', viewCategoryDetails: data.category });
        // Optionally refresh category list
      } else if (response.status === 400) {
        this.setState({ editCategoryError: data.error || 'Invalid input for category update.' });
      } else if (response.status === 409) {
        this.setState({ editCategoryError: data.error || 'Service category with this name already exists.' });
      } else if (response.status === 404) {
        this.setState({ editCategoryError: 'Category not found for update.' });
      } else {
        this.setState({ editCategoryError: data.error || 'Failed to update category.' });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      this.setState({ editCategoryError: 'Server error while updating category.' });
    } finally {
      this.setState({ isEditingCategory: false });
      setTimeout(() => this.setState({ editCategoryMessage: null, editCategoryError: null }), 3000);
    }
  }

  handleSuspendCategoryInputChange(event) {
    this.setState({ suspendCategoryId: event.target.value });
  }

  async handleSuspendServiceCategory() {
    this.setState({ isSuspendingCategory: true, suspendCategoryMessage: null, suspendCategoryError: null });
    const { suspendCategoryId } = this.state;

    if (!suspendCategoryId) {
      this.setState({ suspendCategoryError: 'Please enter a Category ID to suspend.' });
      this.setState({ isSuspendingCategory: false });
      return;
    }

    try {
      const response = await fetch(`/api/service-categories/${suspendCategoryId}/suspend`, { // Adjust the API endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      if (response.ok) {
        this.setState({ suspendCategoryMessage: data.message || 'Category suspended successfully.' });
        // Optionally refresh category list or update viewed details
        if (this.state.viewCategoryDetails && this.state.viewCategoryDetails.serviceCatID === parseInt(suspendCategoryId)) {
          this.setState({ viewCategoryDetails: { ...this.state.viewCategoryDetails, serviceCatStatus: 'Suspended' } });
        }
      } else if (response.status === 404) {
        this.setState({ suspendCategoryError: 'Category not found.' });
      } else {
        this.setState({ suspendCategoryError: data.error || 'Failed to suspend category.' });
      }
    } catch (error) {
      console.error('Error suspending category:', error);
      this.setState({ suspendCategoryError: 'Server error while suspending category.' });
    } finally {
      this.setState({ isSuspendingCategory: false });
      setTimeout(() => this.setState({ suspendCategoryMessage: null, suspendCategoryError: null }), 3000);
    }
  }

  render() {
    const { currentPage } = this.props;
    
    return (
      <div>
        <h1>Platform Management</h1>
        
        {currentPage === 'createServiceCategory' && (
          <>
            {renderingMethods.createServiceCategoryUI.call(this)}
          </>
        )}

        {currentPage === 'generateReport' && (
          <>
            {renderingMethods.renderDailyReportSection.call(this)}
            <hr />
            {renderingMethods.renderWeeklyReportSection.call(this)}
            <hr />
            {renderingMethods.renderMonthlyReportSection.call(this)}
          </>
        )}

        {currentPage === 'searchServiceCategories' && (
          <>
            {renderingMethods.renderSearchCategoriesSection.call(this)}
          </>
        )}
      </div>
    );
  }
}

export default PlatformManagementUI;
