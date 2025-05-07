const express = require('express');
const cleanerInsightsController = require('../controllers/cleanerInsightsController');

const router = express.Router();

const cleanerInsightsController = new cleanerInsightsController.CleanerInsightsController();

router.get('/profile-views', (req, res) => cleanerInsightsController.fetchViewStats(req, res));

module.exports = router;