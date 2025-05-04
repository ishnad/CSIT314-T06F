const express = require('express');
const serviceListingController = require('../controllers/serviceListingController');

const router = express.Router();

// Instantiate controllers
const createServiceListingController = new serviceListingController.CreateServiceListingController();
const getServiceListingController = new serviceListingController.GetServiceListingController();

router.post('/', (req, res) => createServiceListingController.createServiceListing(req, res));
router.get('/:id', (req, res) => getServiceListingController.getListingDetails(req, res));

module.exports = router;