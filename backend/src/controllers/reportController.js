const UserAccountEntity = require('../entities/userAccountEntity');
const UserLoginLogEntity = require('../entities/userLoginLogEntity');
const ServiceBookingEntity = require('../entities/serviceBookingEntity');
const ServiceListingEntity = require('../entities/serviceListingEntity');

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

class WeeklyServiceTrendReport {
    constructor(reportDate, startDate, endDate, newListings, trends) {
        this.reportGeneratedAt = reportDate;
        this.periodCovered = `From ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`; // Inclusive start, exclusive end
        this.totalNewListings = newListings.length;
        this.newListingTrendsByCategory = trends; // e.g., { "Window Cleaning": 5, "Deep Cleaning": 3 }
        this.detailedNewListings = newListings.map(listing => ({ // Map to a cleaner structure if needed
            id: listing.id,
            description: listing.description,
            ratePerHr: listing.ratePerHr,
            createdAt: listing.createdAt,
            cleanerUsername: listing.cleaner?.username || 'N/A',
            serviceCategoryName: listing.serviceCategory?.serviceCatName || 'Uncategorized',
        }));
    }
}

class GenerateWeeklyReportController {
    constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to generate a weekly report on new service listings trends.
     * The controller will calculate startDate and endDate for "past week".
     */
    async generateWeeklyServiceTrendsReport(req, res) {
        try {
            // Calculate dates for the "past week" (last 7 full days)
            const reportGeneratedDate = new Date(); // Moment of generation
            const endDate = new Date(); // Today
            endDate.setUTCHours(0, 0, 0, 0); // Set to UTC midnight for consistent day boundary

            const startDate = new Date(endDate);
            startDate.setUTCDate(startDate.getUTCDate() - 7); // 7 days ago

            // 2. System retrieves the popular service trends (e.g. New Service Listings)
            const newListingsResult = await this.serviceListingEntity.getNewListingsInPeriod(startDate, endDate);

            if (newListingsResult.error) {
                return res.status(newListingsResult.error.status).json({ error: newListingsResult.error.message });
            }

            const newListings = newListingsResult;

            // Alternate flow: 2a. No user activities found
            if (newListings.length === 0) {
                return res.status(200).json({ message: "No new service listings found for the past week. No Weekly Report to be generated." });
            }

            // 3. System compiles popular service trends
            const trendsByCategory = {};
            newListings.forEach(listing => {
                const categoryName = listing.serviceCategory?.serviceCatName || 'Uncategorized';
                trendsByCategory[categoryName] = (trendsByCategory[categoryName] || 0) + 1;
            });

            // Sort trends by count, descending
            const sortedTrends = Object.entries(trendsByCategory)
                .sort(([, countA], [, countB]) => countB - countA)
                .reduce((obj, [category, count]) => {
                    obj[category] = count;
                    return obj;
                }, {});

            const report = new WeeklyServiceTrendReport(
                reportGeneratedDate,
                startDate,
                new Date(endDate.getTime() - 1), // Display end date as the previous day for "past 7 full days"
                newListings,
                sortedTrends
            );

            return res.status(200).json(report);

        } catch (error) {
            console.error("Error generating weekly service trends report:", error);
            return res.status(500).json({ error: 'An unexpected error occurred while generating the weekly report.' });
        }
    }
}

module.exports = {
    GenerateDailyReportController,
    GenerateWeeklyReportController,
};