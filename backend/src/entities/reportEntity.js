const { PrismaClient } = require('../generated/prisma');
const UserAccountEntity = require('./userAccountEntity');
const UserLoginLogEntity = require('./userLoginLogEntity');
const MatchServiceEntity = require('./matchServiceEntity');
const ServiceListingEntity = require('./serviceListingEntity');

class ReportEntity {
    constructor() {
        this.prisma = new PrismaClient();
        this.userAccountEntity = new UserAccountEntity();
        this.userLoginLogEntity = new UserLoginLogEntity();
        this.serviceBookingEntity = new MatchServiceEntity(); // Using MatchServiceEntity for bookings
        this.serviceListingEntity = new ServiceListingEntity();
    }

    async generateDailyReport(startDate, endDate) {
        try {
            const [totalLogins, totalRegistrations, confirmedBookings] = await Promise.all([
                this.userLoginLogEntity.getTotalLoginsInPeriod(startDate, endDate),
                this.userAccountEntity.getTotalRegistrationsInPeriod(startDate, endDate),
                this.serviceBookingEntity.getConfirmedBookingsInPeriod(startDate, endDate)
            ]);

            // Handle potential errors from entity calls
            if (typeof totalLogins !== 'number' && totalLogins.error) {
                throw new Error(`Failed to get logins: ${totalLogins.error.message}`);
            }
            if (typeof totalRegistrations !== 'number' && totalRegistrations.error) {
                throw new Error(`Failed to get registrations: ${totalRegistrations.error.message}`);
            }
            if (typeof confirmedBookings !== 'number' && confirmedBookings.error) {
                throw new Error(`Failed to get bookings: ${confirmedBookings.error.message}`);
            }

            return {
                reportGeneratedAt: new Date().toISOString(),
                periodStart: startDate.toISOString(),
                periodEnd: endDate.toISOString(),
                totalLogins,
                totalRegistrations,
                confirmedBookings,
                period: "daily"
            };
            
        } catch (error) {
            console.error('Error generating daily report:', error);
            throw new Error(`Daily report generation failed: ${error.message}`);
        }
    }

    async generateWeeklyServiceTrendsReport(startDate, endDate) {
        const newListings = await this.serviceListingEntity.getNewListingsInPeriod(startDate, endDate);
        
        const trendsByCategory = {};
        newListings.forEach(listing => {
            const categoryName = listing.serviceCategory?.serviceCatName || 'Uncategorized';
            trendsByCategory[categoryName] = (trendsByCategory[categoryName] || 0) + 1;
        });

        const sortedTrends = Object.entries(trendsByCategory)
            .sort(([, countA], [, countB]) => countB - countA)
            .reduce((obj, [category, count]) => {
                obj[category] = count;
                return obj;
            }, {});

        return {
            reportGeneratedAt: new Date(),
            periodCovered: `From ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
            totalNewListings: newListings.length,
            newListingTrendsByCategory: sortedTrends,
            detailedNewListings: newListings.map(listing => ({
                id: listing.id,
                name: listing.name,
                description: listing.description,
                ratePerHr: listing.ratePerHr,
                createdAt: listing.createdAt,
                cleanerUsername: listing.cleanerUsername || 'N/A',
                serviceCategoryName: listing.serviceCatName || 'Uncategorized',
            }))
        };
    }

    async generateMonthlyRevenueReport(startDate, endDate) {
        const { totalRevenue, totalBookingsCompleted } = await this.serviceBookingEntity.getRevenueInPeriod(startDate, endDate);
        
        return {
            reportTitle: "Monthly Revenue Report",
            periodCovered: `${startDate.toLocaleString('default', { month: 'long', timeZone: 'UTC' })} ${startDate.getUTCFullYear()}`,
            reportGeneratedAt: new Date(),
            dataFromDate: startDate.toISOString().split('T')[0],
            dataToDate: new Date(endDate.getTime() - 1).toISOString().split('T')[0],
            totalRevenue,
            totalBookingsCompleted
        };
    }
}

module.exports = ReportEntity;
