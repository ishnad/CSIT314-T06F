const UserAccountEntity = require('../entities/userAccountEntity');
const UserLoginLogEntity = require('../entities/userLoginLogEntity');
const ServiceBookingEntity = require('../entities/serviceBookingEntity');

class DailyReportData {
    constructor(date, totalLogins, totalRegistrations, confirmedBookings) {
        this.reportGeneratedAt = date; // The time the report was generated for (end of the 24h period)
        this.periodCovered = "Last 24 hours";
        this.totalLogins = totalLogins;
        this.totalRegistrations = totalRegistrations;
        this.confirmedBookings = confirmedBookings;
    }
}

class GenerateDailyReportController {
    constructor() {
        this.userAccountEntity = new UserAccountEntity();
        this.userLoginLogEntity = new UserLoginLogEntity();
        this.serviceBookingEntity = new ServiceBookingEntity();
    }

    /**
     * Handles the HTTP request to generate a daily report for the past 24 hours.
     */
    async generateDailyReport(req, res) {
        try {
            const endDate = new Date(); // Current time is the end of the 24-hour period
            const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

            // 2. System retrieves user activities
            const totalLoginsResult = await this.userLoginLogEntity.getTotalLoginsInPeriod(startDate, endDate);
            const totalRegistrationsResult = await this.userAccountEntity.getTotalRegistrationsInPeriod(startDate, endDate);
            const confirmedBookingsResult = await this.serviceBookingEntity.getConfirmedBookingsInPeriod(startDate, endDate);

            // Handle potential errors from entity calls
            if (typeof totalLoginsResult !== 'number' && totalLoginsResult.error) {
                return res.status(totalLoginsResult.error.status).json({ error: totalLoginsResult.error.message });
            }
            if (typeof totalRegistrationsResult !== 'number' && totalRegistrationsResult.error) {
                return res.status(totalRegistrationsResult.error.status).json({ error: totalRegistrationsResult.error.message });
            }
            if (typeof confirmedBookingsResult !== 'number' && confirmedBookingsResult.error) {
                return res.status(confirmedBookingsResult.error.status).json({ error: confirmedBookingsResult.error.message });
            }

            const totalLogins = totalLoginsResult;
            const totalRegistrations = totalRegistrationsResult;
            const confirmedBookings = confirmedBookingsResult;

            // Alternate flow: 2a. No user activities found
            if (totalLogins === 0 && totalRegistrations === 0 && confirmedBookings === 0) {
                const emptyReport = new DailyReportData(endDate, 0, 0, 0);
                return res.status(200).json({ message: "No significant user activities found in the past 24 hours.", report: emptyReport });
            }

            // 3. System compiles user activities and displays it as report
            const reportData = new DailyReportData(endDate, totalLogins, totalRegistrations, confirmedBookings);

            return res.status(200).json(reportData);

        } catch (error) {
            console.error("Error generating daily report in controller:", error);
            return res.status(500).json({ error: 'An unexpected error occurred while generating the daily report.' });
        }
    }
}

module.exports = {
    GenerateDailyReportController,
};