const express = require('express');
const confirmedMatchesController = require('../controllers/confirmedMatchesController');

const router = express.Router();
const viewConfirmedMatchesController = new confirmedMatchesController.ConfirmedMatchesController();
const searchConfirmedMatchesController = new confirmedMatchesController.SearchConfirmedMatchesController();
const createMatchController = new confirmedMatchesController.CreateMatchController();
const fetchPastMatchesController = new confirmedMatchesController.FetchPastMatchesController();
const homeownerServiceHistoryController = new confirmedMatchesController.HomeownerServiceHistoryController();

router.get('/cleaner/confirmed/all', (req, res) => viewConfirmedMatchesController.fetchAllConfirmedMatches(req, res));
router.get('/cleaner/confirmed', (req, res) => viewConfirmedMatchesController.fetchConfirmedMatches(req, res));
router.get('/cleaner/confirmed/search', (req, res) => searchConfirmedMatchesController.searchConfirmedMatches(req, res));
router.post('/cleaner/confirmed', (req, res) => createMatchController.createMatch(req, res));
router.get('/homeowner/past', (req, res) => fetchPastMatchesController.fetchPastMatches(req, res));
router.get('/homeowner/history', (req, res) => homeownerServiceHistoryController.getServiceHistory(req, res));

module.exports = router;
