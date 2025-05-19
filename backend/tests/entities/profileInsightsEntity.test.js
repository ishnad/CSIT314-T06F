const ProfileInsightsEntity = require('../../src/entities/profileInsightsEntity');
const { PrismaClient } = require('../../src/generated/prisma');

jest.mock('../../src/generated/prisma', () => {
    const mockPrisma = {
        profileView: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
        shortlist: { // Add mock for shortlist
            count: jest.fn(),
        }
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

describe('ProfileInsightsEntity', () => {
    let entity;
    let mockPrismaClient;

    beforeEach(() => {
        jest.clearAllMocks();
        entity = new ProfileInsightsEntity();
        mockPrismaClient = new PrismaClient();
    });

    describe('fetchViewStats', () => {
        const cleanerUserId = 'cleaner-123';

        it('should return "No profile views yet" if total views are zero', async () => {
            mockPrismaClient.profileView.count.mockResolvedValue(0);
            // findMany might not be called if count is 0, but good to mock it returning empty
            mockPrismaClient.profileView.findMany.mockResolvedValue([]);

            // Mock Date using Jest's fake timers BEFORE calling the function under test
            jest.useFakeTimers();
            const mockCurrentDateForEmptyViews = new Date('2025-05-18T00:00:00.000Z');
            jest.setSystemTime(mockCurrentDateForEmptyViews);

            const result = await entity.fetchViewStats(cleanerUserId);

            expect(mockPrismaClient.profileView.count).toHaveBeenCalledWith({
                where: { viewedProfileId: cleanerUserId },
            });

            const expectedDailyViews = Array.from({length: 7}, (_, i) => {
                const d = new Date(mockCurrentDateForEmptyViews); // Use the mocked date for expectation
                d.setDate(mockCurrentDateForEmptyViews.getDate() - i);
                return {
                    date: d.toISOString().split('T')[0],
                    views: 0
                };
            });
            
            expect(result).toEqual({
                totalViews: 0,
                dailyViewsLastWeek: expectedDailyViews
            });
            // findMany should not be called if totalViews is 0, as per current entity logic
            expect(mockPrismaClient.profileView.findMany).not.toHaveBeenCalled();
            jest.useRealTimers();
        });

        it('should return total views and daily breakdown for the last 7 days', async () => {
            const mockTotalViews = 15;
            
            // Mock dates for consistent testing
            const baseDate = new Date('2025-05-07T12:00:00.000Z');
            const today = new Date(baseDate);
            const yesterday = new Date(baseDate);
            yesterday.setDate(baseDate.getDate() - 1);
            const threeDaysAgo = new Date(baseDate);
            threeDaysAgo.setDate(baseDate.getDate() - 3);

            const mockDbViews = [
                { viewedAt: new Date(today) }, 
                { viewedAt: new Date(yesterday) },
                { viewedAt: new Date(yesterday) }, 
                { viewedAt: new Date(threeDaysAgo) },
            ];

            mockPrismaClient.profileView.count.mockResolvedValue(mockTotalViews);
            mockPrismaClient.profileView.findMany.mockResolvedValue(mockDbViews);
            
            // Mock Date using Jest's fake timers
            jest.useFakeTimers();
            const mockCurrentDate = new Date(baseDate); // This is "today" for the map generation
            jest.setSystemTime(mockCurrentDate);

            const result = await entity.fetchViewStats(cleanerUserId);
            
            expect(mockPrismaClient.profileView.count).toHaveBeenCalledWith({
                where: { viewedProfileId: cleanerUserId },
            });

            const expectedSevenDaysAgo = new Date(mockCurrentDate);
            expectedSevenDaysAgo.setDate(mockCurrentDate.getDate() - 6);
            expectedSevenDaysAgo.setHours(0, 0, 0, 0);

            const expectedTodayEndDate = new Date(mockCurrentDate);
            expectedTodayEndDate.setHours(23, 59, 59, 999);
            
            expect(mockPrismaClient.profileView.findMany).toHaveBeenCalledWith({
                where: {
                    viewedProfileId: cleanerUserId,
                    viewedAt: {
                        gte: expectedSevenDaysAgo,
                        lte: expectedTodayEndDate,
                    },
                },
                orderBy: { viewedAt: 'asc' },
                select: { viewedAt: true }
            });
            
            expect(result.totalViews).toBe(mockTotalViews);
            expect(result.dailyViewsLastWeek).toBeInstanceOf(Array);
            expect(result.dailyViewsLastWeek.length).toBe(7);

            const todayStr = today.toISOString().split('T')[0];
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

            const todayEntry = result.dailyViewsLastWeek.find(d => d.date === todayStr);
            const yesterdayEntry = result.dailyViewsLastWeek.find(d => d.date === yesterdayStr);
            const threeDaysAgoEntry = result.dailyViewsLastWeek.find(d => d.date === threeDaysAgoStr);
            
            expect(todayEntry.views).toBe(1);
            expect(yesterdayEntry.views).toBe(2);
            expect(threeDaysAgoEntry.views).toBe(1);

            result.dailyViewsLastWeek.forEach(day => {
                expect(day).toHaveProperty('date');
                expect(day).toHaveProperty('views');
                if (day.date !== todayStr && day.date !== yesterdayStr && day.date !== threeDaysAgoStr) {
                    const isExpectedZero = !mockDbViews.some(v => v.viewedAt.toISOString().split('T')[0] === day.date);
                    if(isExpectedZero) expect(day.views).toBe(0);
                }
            });
            jest.useRealTimers();
        });
        
        it('should handle cases where there are total views but no views in the last 7 days', async () => {
            const mockTotalViews = 5;
            mockPrismaClient.profileView.count.mockResolvedValue(mockTotalViews);
            mockPrismaClient.profileView.findMany.mockResolvedValue([]);

            const baseDate = new Date('2025-05-07T12:00:00.000Z');
            jest.useFakeTimers();
            jest.setSystemTime(baseDate);

            const result = await entity.fetchViewStats(cleanerUserId);

            expect(result.totalViews).toBe(mockTotalViews);
            expect(result.dailyViewsLastWeek.length).toBe(7);
            result.dailyViewsLastWeek.forEach(day => {
                expect(day.views).toBe(0);
            });
            jest.useRealTimers();
        });

        it('should return 500 error if prisma count fails', async () => {
            const dbError = new Error('DB count error');
            mockPrismaClient.profileView.count.mockRejectedValue(dbError);
            
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchViewStats(cleanerUserId);
            consoleErrorSpy.mockRestore();

            expect(result).toEqual({ error: { status: 500, error: 'Failed to retrieve profile view statistics due to a server error.' } });
        });

        it('should return 500 error if prisma findMany fails (after count succeeds)', async () => {
            mockPrismaClient.profileView.count.mockResolvedValue(10);
            const dbError = new Error('DB findMany error');
            mockPrismaClient.profileView.findMany.mockRejectedValue(dbError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchViewStats(cleanerUserId);
            consoleErrorSpy.mockRestore();
            
            expect(result).toEqual({ error: { status: 500, error: 'Failed to retrieve profile view statistics due to a server error.' } });
        });
    });

    describe('fetchShortlistCount', () => {
        const cleanerUserId = 'cleaner-shortlist-id-456';

        it('should return shortlist count if cleaner has been shortlisted', async () => {
            const mockCount = 5;
            mockPrismaClient.shortlist.count.mockResolvedValue(mockCount);

            const result = await entity.fetchShortlistCount(cleanerUserId);

            expect(mockPrismaClient.shortlist.count).toHaveBeenCalledWith({
                where: { cleanerId: cleanerUserId },
            });
            expect(result).toEqual({ shortlistCount: mockCount });
        });

        it('should return "You have not been shortlisted yet" if count is zero', async () => {
            mockPrismaClient.shortlist.count.mockResolvedValue(0);

            const result = await entity.fetchShortlistCount(cleanerUserId);

            expect(mockPrismaClient.shortlist.count).toHaveBeenCalledWith({
                where: { cleanerId: cleanerUserId },
            });
            expect(result).toEqual({ shortlistCount: 0 });
        });

        it('should return 500 error if prisma shortlist count fails', async () => {
            const dbError = new Error('DB shortlist count error');
            mockPrismaClient.shortlist.count.mockRejectedValue(dbError);
            
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchShortlistCount(cleanerUserId);
            consoleErrorSpy.mockRestore();

            expect(mockPrismaClient.shortlist.count).toHaveBeenCalledWith({
                where: { cleanerId: cleanerUserId },
            });
            expect(result).toEqual({ error: { status: 500, error: 'Failed to retrieve shortlist count due to a server error.' } });
        });
    });
});
