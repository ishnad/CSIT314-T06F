const express = require('express');
const shortlistController = require('../controllers/shortlistController');

const router = express.Router();
const saveShortlistController = new shortlistController.SaveShortlistController();
const searchShortlistCleaner = new shortlistController.SearchShortlistCleanerController();

router.post('/add', (req, res) => saveShortlistController.shortlistCleaner(req, res));
router.post('/search', (req, res) => searchShortlistCleaner.searchShortlistCleaner(req, res));

module.exports = router;