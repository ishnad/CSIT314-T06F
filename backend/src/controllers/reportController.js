const ReportEntity = require('../entities/reportEntity');

class GenerateDailyReportController {
    constructor() {
        this.reportEntity = new ReportEntity();
    }

    async generateDailyReport(req, res) {
        try {
            const defaultEndDate = new Date();
            const defaultStartDate = new Date(defaultEndDate);
            defaultStartDate.setDate(defaultStartDate.getDate() - 1);

            // Use query params if provided, otherwise use defaults
            const startDate = req.query.start ? new Date(req.query.start) : defaultStartDate;
            const endDate = req.query.end ? new Date(req.query.end) : defaultEndDate;

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date parameters' });
            }
            
            const report = await this.reportEntity.generateDailyReport(startDate, endDate);
            return res.status(200).json(report);
            
        } catch (error) {
            console.error("Error generating daily report in controller:", error);
            return res.status(500).json({ error: 'An unexpected error occurred while generating the daily report.' });
        }
    }
}

class GenerateWeeklyReportController {
    constructor() {
        this.reportEntity = new ReportEntity();
    }

    async generateWeeklyServiceTrendsReport(req, res) {
        try {
            // Use dates from query params if provided, otherwise calculate default range
            let endDate = req.query.end ? new Date(req.query.end) : new Date();
            endDate.setUTCHours(23, 59, 59, 999); // End of day in UTC
            
            let startDate = req.query.start ? new Date(req.query.start) : new Date(endDate);
            startDate.setUTCDate(startDate.getUTCDate() - 7);
            startDate.setUTCHours(0, 0, 0, 0); // Start of day in UTC
            
            const report = await this.reportEntity.generateWeeklyServiceTrendsReport(startDate, endDate);
            return res.status(200).json(report);
            
        } catch (error) {
            console.error("Error generating weekly service trends report:", error);
            return res.status(500).json({ error: 'An unexpected error occurred while generating the weekly report.' });
        }
    }
}

class GenerateMonthlyReportController {
    constructor() {
        this.reportEntity = new ReportEntity();
    }

    async generateMonthlyRevenueReport(req, res) {
        try {
            const today = new Date();
            const currentYear = today.getUTCFullYear();
            const currentMonth = today.getUTCMonth();

            // Set end date to first day of current month at 23:59:59.999
            // Set end date to current moment
            const endDate = new Date();
            
            // Set start date to first day of current month
            const startDate = new Date(Date.UTC(currentYear, currentMonth, 1));
            
            const report = await this.reportEntity.generateMonthlyRevenueReport(startDate, endDate);
            return res.status(200).json(report);
            
        } catch (error) {
            console.error("Error generating monthly revenue report in controller:", error);
            return res.status(500).json({ error: 'An unexpected error occurred while generating the monthly revenue report.' });
        }
    }
}

module.exports = {
    GenerateDailyReportController,
    GenerateWeeklyReportController,
    GenerateMonthlyReportController
};
