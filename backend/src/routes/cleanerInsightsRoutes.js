const express = require('express');
const cleanerInsightsController = require('../controllers/cleanerInsightsController');

const router = express.Router();

const controllerInstance = new cleanerInsightsController.CleanerInsightsController();

router.get('/:cleanerId/views', (req, res) => controllerInstance.fetchViewStats(req, res));
router.get('/:cleanerId/shortlist-count', (req, res) => controllerInstance.fetchShortlistCount(req, res));;

module.exports = router;