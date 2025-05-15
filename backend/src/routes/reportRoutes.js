const express = require('express');
const router = express.Router();
const { GenerateDailyReportController } = require('../controllers/reportController');

const reportController = new GenerateDailyReportController();

router.get('/reports/daily', (req, res) => reportController.generateDailyReport(req, res));

module.exports = router;