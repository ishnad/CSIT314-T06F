const express = require('express');
const ViewServiceHistoryController = require('../controllers/viewServiceHistoryController');
const SearchServiceHistoryController = require('../controllers/searchServiceHistoryController');

const router = express.Router();

const viewServiceHistoryController = new ViewServiceHistoryController();
const searchServiceHistoryController = new SearchServiceHistoryController();

router.get('/', (req, res) => viewServiceHistoryController.viewServiceHistory(req, res));
router.get('/search', (req, res) => searchServiceHistoryController.searchServiceHistory(req, res));

module.exports = router;