const express = require('express');
const ViewServiceHistoryController = require('../controllers/viewServiceHistoryController');

const router = express.Router();

const viewServiceHistoryController = new ViewServiceHistoryController();

router.get('/', isAuthenticated, (req, res) => viewServiceHistoryController.viewServiceHistory(req, res));

module.exports = router;