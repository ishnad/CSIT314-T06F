const express = require('express');
const SearchCleanerController = require('../controllers/searchCleanerController');

const router = express.Router();

const searchCleanerController = new SearchCleanerController();

router.get('/search', isAuthenticated, (req, res) => searchCleanerController.searchCleaner(req, res));


module.exports = router;