const express = require('express');
const serviceListingController = require('../controllers/serviceListingController');

const router = express.Router();

// Instantiate controllers
const createServiceListingController = new serviceListingController.CreateServiceListingController();
const getServiceListingController = new serviceListingController.GetServiceListingController();
const editServiceListingController = new serviceListingController.EditServiceListingController();
const suspendServiceListingController = new serviceListingController.SuspendServiceListingController();
const searchServiceListingsController = new serviceListingController.SearchServiceListingsController();
const serviceCategoriesController = new serviceListingController.ServiceCategoriesController();

router.post('/', (req, res) => createServiceListingController.createServiceListing(req, res));
router.get('/search', (req, res) => searchServiceListingsController.searchListings(req, res));
router.get('/service-categories', (req, res) => serviceCategoriesController.getActiveServiceCategories(req, res));
router.get('/by-cleaner/:cleanerId', (req, res) => getServiceListingController.getAllListingDetails(req, res));
router.get('/:id', (req, res) => getServiceListingController.getListingDetails(req, res));
router.put('/:id', (req, res) => editServiceListingController.editServiceListing(req, res));
router.patch('/:id/toggle-status', (req, res) => suspendServiceListingController.toggleListingStatus(req, res));

module.exports = router;
