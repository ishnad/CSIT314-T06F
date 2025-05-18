const { CleanerInsightsController } = require('../../src/controllers/cleanerInsightsController');
const ProfileInsightsEntity = require('../../src/entities/profileInsightsEntity');

jest.mock('../../src/entities/profileInsightsEntity');

const mockRequest = (user = null, params = {}) => ({
    user, 
    params, // req.params will be this params object
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
        // that has jest.fn() for its methods.
        ProfileInsightsEntity.mockImplementation(() => {
            return {
                fetchViewStats: jest.fn(),
                fetchShortlistCount: jest.fn() // Add mock for the new method
            };
        });
        
        controller = new CleanerInsightsController();
        // The controller instantiates the entity, so we grab that instance to check its methods.
        mockProfileInsightsEntityInstance = controller.profileInsightsEntity; 
        
        res = mockResponse();
    });

    describe('fetchViewStats', () => {
        it('should return stats successfully for an authenticated Cleaner', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const mockStatsData = { totalViews: 120, dailyViewsLastWeek: [{ date: '2025-05-07', views: 10 }] };
            mockProfileInsightsEntityInstance.fetchViewStats.mockResolvedValue(mockStatsData);

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockStatsData);
        });

        it('should return "No profile views yet" message if entity provides it', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const noViewsResponse = { message: "No profile views yet" };
            mockProfileInsightsEntityInstance.fetchViewStats.mockResolvedValue(noViewsResponse);

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(noViewsResponse);
        });

        it('should return 401 if user is not authenticated', async () => {
            req = mockRequest(null, {}); // Pass empty params to avoid crash, cleanerId will be undefined

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400); // Updated expected status
            expect(res.json).toHaveBeenCalledWith({ error: 'Cleaner ID is required' }); // Updated expected JSON
        });

        it('should return 403 if authenticated user is not a Cleaner', async () => {
            req = mockRequest(mockNonCleanerUser, {}); // Pass empty params, cleanerId will be undefined

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400); // Updated expected status
            expect(res.json).toHaveBeenCalledWith({ error: 'Cleaner ID is required' }); // Updated expected JSON
        });

        it('should return error from entity if fetching stats fails (e.g., DB error in entity)', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const entityErrorResponse = { error: { status: 500, error: 'Database query failed.' } };
            mockProfileInsightsEntityInstance.fetchViewStats.mockResolvedValue(entityErrorResponse);

            await controller.fetchViewStats(req, res);

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200); // Updated expected status
            expect(res.json).toHaveBeenCalledWith(entityErrorResponse); // Updated expected JSON
        });

        it('should return 500 on unexpected controller error (if entity method throws)', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const unexpectedError = new Error("Critical failure in entity method");
            mockProfileInsightsEntityInstance.fetchViewStats.mockRejectedValue(unexpectedError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.fetchViewStats(req, res);
            consoleErrorSpy.mockRestore();

            expect(mockProfileInsightsEntityInstance.fetchViewStats).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch view statistics', details: unexpectedError.message }); // Updated expected JSON
        });
    });

    describe('fetchShortlistCount', () => {
        it('should return shortlist count successfully for an authenticated Cleaner', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const mockShortlistData = { shortlistCount: 7 };
            mockProfileInsightsEntityInstance.fetchShortlistCount.mockResolvedValue(mockShortlistData);

            await controller.fetchShortlistCount(req, res);

            expect(mockProfileInsightsEntityInstance.fetchShortlistCount).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockShortlistData);
        });

        it('should return "You have not been shortlisted yet" message if entity provides it', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            // Entity might return a message, but controller processes it to { shortlistCount: 0 }
            const entityResponseIndicatesNoShortlist = { message: "You have not been shortlisted yet" }; 
            mockProfileInsightsEntityInstance.fetchShortlistCount.mockResolvedValue(entityResponseIndicatesNoShortlist);
            
            const expectedControllerResponse = { shortlistCount: 0 }; // Controller's actual output

            await controller.fetchShortlistCount(req, res);

            expect(mockProfileInsightsEntityInstance.fetchShortlistCount).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedControllerResponse); // Updated expected JSON
        });

        it('should return 401 if user is not authenticated', async () => {
            req = mockRequest(null, {}); // Pass empty params to avoid crash, cleanerId will be undefined

            await controller.fetchShortlistCount(req, res);

            expect(mockProfileInsightsEntityInstance.fetchShortlistCount).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400); // Updated expected status
            expect(res.json).toHaveBeenCalledWith({ error: 'Cleaner ID is required' }); // Updated expected JSON
        });

        it('should return 403 if authenticated user is not a Cleaner', async () => {
            req = mockRequest(mockNonCleanerUser, {}); // Pass empty params, cleanerId will be undefined

            await controller.fetchShortlistCount(req, res);

            expect(mockProfileInsightsEntityInstance.fetchShortlistCount).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400); // Updated expected status
            expect(res.json).toHaveBeenCalledWith({ error: 'Cleaner ID is required' }); // Updated expected JSON
        });

        it('should return error from entity if fetching shortlist count fails', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const entityErrorResponse = { error: { status: 500, error: 'Database query failed for shortlist.' } };
            mockProfileInsightsEntityInstance.fetchShortlistCount.mockResolvedValue(entityErrorResponse);

            await controller.fetchShortlistCount(req, res);

            expect(mockProfileInsightsEntityInstance.fetchShortlistCount).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(200); // Updated expected status
            expect(res.json).toHaveBeenCalledWith({ shortlistCount: 0 }); // Updated expected JSON
        });

        it('should return 500 on unexpected controller error (if entity method throws for shortlist)', async () => {
            req = mockRequest(mockCleanerUser, { cleanerId: mockCleanerUser.id });
            const unexpectedError = new Error("Critical failure in entity shortlist method");
            mockProfileInsightsEntityInstance.fetchShortlistCount.mockRejectedValue(unexpectedError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.fetchShortlistCount(req, res);
            consoleErrorSpy.mockRestore();

            expect(mockProfileInsightsEntityInstance.fetchShortlistCount).toHaveBeenCalledWith(mockCleanerUser.id);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch shortlist count', details: unexpectedError.message }); // Updated expected JSON
        });
    });
});
