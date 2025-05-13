const express = require('express');
const shortlistController = require('../controllers/shortlistController');

const router = express.Router();
const saveShortlistController = new shortlistController.SaveShortlistController();
const searchShortlistCleaner = new shortlistController.SearchShortlistCleanerController();
const viewShortlistController = new shortlistController.ViewShortlistController();

router.post('/add', (req, res) => saveShortlistController.shortlistCleaner(req, res));
router.get('/search', (req, res) => searchShortlistCleaner.searchShortlistCleaner(req, res));
router.get('/view', (req, res) => viewShortlistController.viewCleanerProfile(req, res));

module.exports = router;