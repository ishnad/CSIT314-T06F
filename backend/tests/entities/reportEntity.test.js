const ReportEntity = require('../../src/entities/reportEntity');
const UserAccountEntity = require('../../src/entities/userAccountEntity');
const UserLoginLogEntity = require('../../src/entities/userLoginLogEntity');
const MatchServiceEntity = require('../../src/entities/matchServiceEntity');
const ServiceListingEntity = require('../../src/entities/serviceListingEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// Mock the dependencies
jest.mock('../../src/generated/prisma', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        // Mock PrismaClient methods if directly used by ReportEntity, though it seems to use other entities mostly
    }))
}));
jest.mock('../../src/entities/userAccountEntity');
jest.mock('../../src/entities/userLoginLogEntity');
jest.mock('../../src/entities/matchServiceEntity');
jest.mock('../../src/entities/serviceListingEntity');

describe('ReportEntity', () => {
    let reportEntity;
    let mockUserAccountEntity;
    let mockUserLoginLogEntity;
    let mockMatchServiceEntity; // Renamed from serviceBookingEntity for clarity as per ReportEntity constructor
    let mockServiceListingEntity;

    beforeEach(() => {
        // Reset mocks for each test
        PrismaClient.mockClear();
        UserAccountEntity.mockClear();
        UserLoginLogEntity.mockClear();
        MatchServiceEntity.mockClear();
        ServiceListingEntity.mockClear();

        // Instantiate mocks
        mockUserAccountEntity = new UserAccountEntity();
        mockUserLoginLogEntity = new UserLoginLogEntity();
        mockMatchServiceEntity = new MatchServiceEntity();
        mockServiceListingEntity = new ServiceListingEntity();

        // Assign mocked instances to the ReportEntity's dependencies
        // This ensures that when ReportEntity is instantiated, its dependencies are already our mocks.
        // However, ReportEntity instantiates its own dependencies in its constructor.
        // So, we need to mock the constructors of these entity classes to return our mocks,
        // or re-assign them after ReportEntity is instantiated.
        // The latter is simpler for this setup.
        
        reportEntity = new ReportEntity();
        // Re-assign after instantiation to ensure our mocks are used
        reportEntity.userAccountEntity = mockUserAccountEntity;
        reportEntity.userLoginLogEntity = mockUserLoginLogEntity;
        reportEntity.serviceBookingEntity = mockMatchServiceEntity; // This is how it's named in ReportEntity
        reportEntity.serviceListingEntity = mockServiceListingEntity;
    });

    describe('generateDailyReport', () => {
        it('should generate a daily report successfully', async () => {
            const startDate = new Date('2024-01-01T00:00:00.000Z');
            const endDate = new Date('2024-01-01T23:59:59.999Z');

            mockUserLoginLogEntity.getTotalLoginsInPeriod.mockResolvedValue(100);
            mockUserAccountEntity.getTotalRegistrationsInPeriod.mockResolvedValue(10);
            // Ensure the correct mock is used for getConfirmedBookingsInPeriod
            mockMatchServiceEntity.getConfirmedBookingsInPeriod.mockResolvedValue(5);

            const report = await reportEntity.generateDailyReport(startDate, endDate);

            expect(report).toHaveProperty('reportGeneratedAt');
            expect(report.periodStart).toBe(startDate.toISOString());
            expect(report.periodEnd).toBe(endDate.toISOString());
            expect(report.totalLogins).toBe(100);
            expect(report.totalRegistrations).toBe(10);
            expect(report.confirmedBookings).toBe(5);
            expect(report.period).toBe("daily");
            expect(mockUserLoginLogEntity.getTotalLoginsInPeriod).toHaveBeenCalledWith(startDate, endDate);
            expect(mockUserAccountEntity.getTotalRegistrationsInPeriod).toHaveBeenCalledWith(startDate, endDate);
            expect(mockMatchServiceEntity.getConfirmedBookingsInPeriod).toHaveBeenCalledWith(startDate, endDate);
        });

        it('should throw an error if fetching logins fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const startDate = new Date();
            const endDate = new Date();
            mockUserLoginLogEntity.getTotalLoginsInPeriod.mockResolvedValue({ error: { message: 'Login fetch failed' } });
            mockUserAccountEntity.getTotalRegistrationsInPeriod.mockResolvedValue(10);
            mockMatchServiceEntity.getConfirmedBookingsInPeriod.mockResolvedValue(5);

            await expect(reportEntity.generateDailyReport(startDate, endDate))
                .rejects
                .toThrow('Daily report generation failed: Failed to get logins: Login fetch failed');
            consoleErrorSpy.mockRestore();
        });
        
        it('should throw an error if fetching registrations fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const startDate = new Date();
            const endDate = new Date();
            mockUserLoginLogEntity.getTotalLoginsInPeriod.mockResolvedValue(100);
            mockUserAccountEntity.getTotalRegistrationsInPeriod.mockResolvedValue({ error: { message: 'Registration fetch failed' } });
            mockMatchServiceEntity.getConfirmedBookingsInPeriod.mockResolvedValue(5);

            await expect(reportEntity.generateDailyReport(startDate, endDate))
                .rejects
                .toThrow('Daily report generation failed: Failed to get registrations: Registration fetch failed');
            consoleErrorSpy.mockRestore();
        });

        it('should throw an error if fetching bookings fails', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const startDate = new Date();
            const endDate = new Date();
            mockUserLoginLogEntity.getTotalLoginsInPeriod.mockResolvedValue(100);
            mockUserAccountEntity.getTotalRegistrationsInPeriod.mockResolvedValue(10);
            mockMatchServiceEntity.getConfirmedBookingsInPeriod.mockResolvedValue({ error: { message: 'Booking fetch failed' } });
            
            await expect(reportEntity.generateDailyReport(startDate, endDate))
                .rejects
                .toThrow('Daily report generation failed: Failed to get bookings: Booking fetch failed');
            consoleErrorSpy.mockRestore();
        });
    });

    describe('generateWeeklyServiceTrendsReport', () => {
        it('should generate a weekly service trends report successfully', async () => {
            const startDate = new Date('2024-01-01T00:00:00.000Z');
            const endDate = new Date('2024-01-07T23:59:59.999Z');
            const mockListings = [
                { id: '1', name: 'Listing 1', description: 'Desc 1', ratePerHr: 20, createdAt: new Date(), cleanerUsername: 'cleanerA', serviceCategory: { serviceCatName: 'Cleaning' } },
                { id: '2', name: 'Listing 2', description: 'Desc 2', ratePerHr: 25, createdAt: new Date(), cleanerUsername: 'cleanerB', serviceCategory: { serviceCatName: 'Gardening' } },
                { id: '3', name: 'Listing 3', description: 'Desc 3', ratePerHr: 22, createdAt: new Date(), cleanerUsername: 'cleanerC', serviceCategory: { serviceCatName: 'Cleaning' } },
            ];
            mockServiceListingEntity.getNewListingsInPeriod.mockResolvedValue(mockListings);

            const report = await reportEntity.generateWeeklyServiceTrendsReport(startDate, endDate);

            expect(report).toHaveProperty('reportGeneratedAt');
            expect(report.periodCovered).toBe(`From ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
            expect(report.totalNewListings).toBe(3);
            expect(report.newListingTrendsByCategory).toEqual({ 'Cleaning': 2, 'Gardening': 1 });
            expect(report.detailedNewListings.length).toBe(3);
            expect(mockServiceListingEntity.getNewListingsInPeriod).toHaveBeenCalledWith(startDate, endDate);
        });

        it('should handle uncategorized listings', async () => {
            const startDate = new Date('2024-01-01T00:00:00.000Z');
            const endDate = new Date('2024-01-07T23:59:59.999Z');
            const mockListings = [
                { id: '1', name: 'Listing 1', createdAt: new Date() }, // No serviceCategory
            ];
            mockServiceListingEntity.getNewListingsInPeriod.mockResolvedValue(mockListings);

            const report = await reportEntity.generateWeeklyServiceTrendsReport(startDate, endDate);
            expect(report.newListingTrendsByCategory).toEqual({ 'Uncategorized': 1 });
        });
    });

    describe('generateMonthlyRevenueReport', () => {
        it('should generate a monthly revenue report successfully', async () => {
            const startDate = new Date('2024-01-01T00:00:00.000Z');
            const endDate = new Date('2024-01-31T23:59:59.999Z'); // End of Jan
            const mockRevenueData = {
                totalRevenue: 5000,
                totalBookingsCompleted: 50,
                topCategories: [
                    { categoryName: 'Cleaning', revenue: 3000 },
                    { categoryName: 'Gardening', revenue: 2000 },
                ]
            };
            mockMatchServiceEntity.getRevenueInPeriod.mockResolvedValue(mockRevenueData);

            const report = await reportEntity.generateMonthlyRevenueReport(startDate, endDate);
            
            expect(report.reportTitle).toBe("Monthly Revenue Report");
            expect(report.periodCovered).toBe(`${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`);
            expect(report).toHaveProperty('reportGeneratedAt');
            expect(report.dataFromDate).toBe(startDate.toISOString().split('T')[0]);
            // For endDate, the report subtracts 1ms, so we need to adjust our expectation
            const expectedEndDate = new Date(endDate.getTime() - 1).toISOString().split('T')[0];
            expect(report.dataToDate).toBe(expectedEndDate);
            expect(report.totalRevenue).toBe(5000);
            expect(report.totalBookingsCompleted).toBe(50);
            expect(report.topCategories).toEqual([
                { categoryName: 'Cleaning', revenue: 3000 },
                { categoryName: 'Gardening', revenue: 2000 },
            ]);
            expect(mockMatchServiceEntity.getRevenueInPeriod).toHaveBeenCalledWith(startDate, endDate);
        });

        it('should handle empty topCategories', async () => {
            const startDate = new Date('2024-02-01T00:00:00.000Z');
            const endDate = new Date('2024-02-29T23:59:59.999Z');
             const mockRevenueData = {
                totalRevenue: 0,
                totalBookingsCompleted: 0,
                topCategories: [] // or null/undefined as per actual implementation
            };
            mockMatchServiceEntity.getRevenueInPeriod.mockResolvedValue(mockRevenueData);

            const report = await reportEntity.generateMonthlyRevenueReport(startDate, endDate);
            expect(report.topCategories).toEqual([]);
        });
    });
});
