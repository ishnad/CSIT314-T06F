const express = require('express');
const serviceHistoryController = require('../controllers/serviceHistoryController');

const router = express.Router();

const viewServiceHistoryController = new serviceHistoryController.ViewServiceHistoryController();
const searchServiceHistoryController = new serviceHistoryController.SearchServiceHistoryController();

router.get('/', (req, res) => viewServiceHistoryController.viewServiceHistory(req, res));
router.get('/search', (req, res) => searchServiceHistoryController.searchServiceHistory(req, res));

module.exports = router;