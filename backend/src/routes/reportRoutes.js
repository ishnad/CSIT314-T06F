const express = require('express');
const router = express.Router();
const { GenerateDailyReportController, GenerateWeeklyReportController } = require('../controllers/reportController');

const dailyReportController = new GenerateDailyReportController();
const weeklyReportController = new GenerateWeeklyReportController();

router.get('/reports/daily', (req, res) => dailyReportController.generateDailyReport(req, res));
router.get('/reports/weekly-service-trends', (req, res) => weeklyReportController.generateWeeklyServiceTrendsReport(req, res)
);

module.exports = router;