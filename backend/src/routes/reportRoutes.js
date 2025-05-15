const express = require('express');
const router = express.Router();
const { GenerateDailyReportController, GenerateWeeklyReportController, GenerateMonthlyReportController } = require('../controllers/reportController');

const dailyReportController = new GenerateDailyReportController();
const weeklyReportController = new GenerateWeeklyReportController();
const monthlyReportController = new GenerateMonthlyReportController();

router.get('/reports/daily', (req, res) => dailyReportController.generateDailyReport(req, res));
router.get('/reports/weekly-service-trends', (req, res) => weeklyReportController.generateWeeklyServiceTrendsReport(req, res));
router.get('/reports/monthly-revenue', (req, res) => monthlyReportController.generateMonthlyRevenueReport(req, res));

module.exports = router;