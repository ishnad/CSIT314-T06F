const express = require('express');
const confirmedMatchesController = require('../controllers/confirmedMatchesController');

const router = express.Router();
const viewConfirmedMatchesController = new confirmedMatchesController.ConfirmedMatchesController();
const searchConfirmedMatchesController = new confirmedMatchesController.SearchConfirmedMatchesController();

router.get('/cleaner/confirmed', (req, res) => viewConfirmedMatchesController.fetchConfirmedMatches(req, res));
router.get('/cleaner/confirmed/search', (req, res) => searchConfirmedMatchesController.searchConfirmedMatches(req, res));

module.exports = router;