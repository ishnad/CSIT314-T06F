const express = require('express');
const serviceListingController = require('../controllers/serviceListingController');

const router = express.Router();

// Instantiate controllers
const createServiceListingController = new serviceListingController.CreateServiceListingController();

router.post('/',(req, res) => createServiceListingController.createServiceListing(req, res));

module.exports = router;