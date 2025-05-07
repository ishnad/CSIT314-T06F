const { CleanerInsightsController } = require('../../src/controllers/cleanerInsightsController');
const ProfileInsightsEntity = require('../../src/entities/profileInsightsEntity');

jest.mock('../../src/entities/profileInsightsEntity');

const mockRequest = (user = null) => ({
    user, // req.user will be populated by auth middleware
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('CleanerInsightsController', () => {
    let controller;
    let mockProfileInsightsEntityInstance;
    let req;
    let res;

    const mockCleanerUser = {
        id: 'cleaner-user-id-xyz',
        username: 'testCleaner',
        profile: { name: 'Cleaner' }, // User has 'Cleaner' profile
    };

    const mockNonCleanerUser = {
        id: 'homeowner-user-id-abc',
        username: 'testHomeowner',
        profile: { name: 'Homeowner' }, // User does not have 'Cleaner' profile
    };

    beforeEach(() => {
        jest.clearAllMocks();
        ProfileInsightsEntity.mockClear(); 
        
        // Mock the constructor of ProfileInsightsEntity to return an instance
        // that has a jest.fn() for fetchViewStats.
        ProfileInsightsEntity.mockImplementation(() => {
            return {
                fetchViewStats: jest.fn()
            };
        });
        
        controller = new CleanerInsightsController();
        // The controller instantiates the entity, so we grab that instance to check its methods.
        mockProfileInsightsEntityInstance = controller.profileInsightsEntity; 
        
        res = mockResponse();
    });

    describe('fetchViewStats', () => {
        it('should return stats successfully for an authenticated Cleaner', async () => {
            req = mockRequest(mockCleanerUser);
            const mockStatsData = { totalViews: 120, dailyViewsLastWeek: [{ date: '2025-05-07', views: 10 }] };
            mockProfileInsightsEntityInstance.fetchViewStats.mockResolvedValue(mockStatsData);

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStatsData);
        });

        it('should return "No profile views yet" message if entity provides it', async () => {
            req = mockRequest(mockCleanerUser);
            const noViewsResponse = { message: "No profile views yet" };
            mockProfileInsightsEntityInstance.fetchViewStats.mockResolvedValue(noViewsResponse);

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(noViewsResponse);
        });

        it('should return 401 if user is not authenticated', async () => {
            req = mockRequest(null); // Simulates no authenticated user

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
        });

        it('should return 403 if authenticated user is not a Cleaner', async () => {
            req = mockRequest(mockNonCleanerUser); // User is authenticated but not a Cleaner

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can view profile insights.' });
        });

        it('should return error from entity if fetching stats fails (e.g., DB error in entity)', async () => {
            req = mockRequest(mockCleanerUser);
            const entityErrorResponse = { error: { status: 500, error: 'Database query failed.' } };
            mockProfileInsightsEntityInstance.fetchViewStats.mockResolvedValue(entityErrorResponse);

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database query failed.' });
        });

        it('should return 500 on unexpected controller error (if entity method throws)', async () => {
            req = mockRequest(mockCleanerUser);
            const unexpectedError = new Error("Critical failure in entity method");
            mockProfileInsightsEntityInstance.fetchViewStats.mockRejectedValue(unexpectedError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.fetchViewStats(req, res);
            consoleErrorSpy.mockRestore();

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while fetching profile view statistics.' });
        });
    });
});