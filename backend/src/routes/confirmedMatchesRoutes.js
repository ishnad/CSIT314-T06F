const express = require('express');
const { ConfirmedMatchesController } = require('../controllers/confirmedMatchesController');
// Assuming an authentication middleware (e.g., `authenticateToken`) is available
// and configured globally or added here to protect routes and populate `req.user`.

const router = express.Router();
const controller = new ConfirmedMatchesController();

// Route to get confirmed matches for the logged-in cleaner
// GET /api/matches/cleaner/confirmed?serviceType=Deep%20Clean&startDate=2025-01-01&endDate=2025-01-31
router.get('/cleaner/confirmed', (req, res) => controller.fetchConfirmedMatches(req, res));
// This route should be protected by an authentication middleware that populates `req.user`.

module.exports = router;
