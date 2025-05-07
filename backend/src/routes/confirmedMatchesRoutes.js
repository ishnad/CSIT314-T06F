const express = require('express');
const confirmedMatchesController = require('../controllers/confirmedMatchesController');

const router = express.Router();
const controllerInstance = new confirmedMatchesController.ConfirmedMatchesController();

router.get('/cleaner/confirmed', (req, res) => controllerInstance.fetchConfirmedMatches(req, res));

module.exports = router;