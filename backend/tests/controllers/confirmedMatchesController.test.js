const { ConfirmedMatchesController } = require('../../src/controllers/confirmedMatchesController');
const MatchServiceEntity = require('../../src/entities/matchServiceEntity');

jest.mock('../../src/entities/matchServiceEntity');

const mockRequest = (user = null, query = {}) => ({
    user, // req.user populated by auth middleware
    query, // req.query for filters
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('ConfirmedMatchesController', () => {
    let controller;
    let mockMatchServiceEntityInstance;
    let req;
    let res;

    const mockCleanerUser = {
        id: 'cleaner-user-id-123',
        username: 'testCleaner',
        profile: { name: 'Cleaner' },
    };

    const mockNonCleanerUser = {
        id: 'homeowner-user-id-456',
        username: 'testHomeowner',
        profile: { name: 'Homeowner' },
    };

    const mockMatchesData = [
        { matchId: 'match-1', serviceTitle: 'Service A', confirmationDate: new Date() }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        MatchServiceEntity.mockClear();
        
        MatchServiceEntity.mockImplementation(() => {
            return {
                fetchConfirmedMatches: jest.fn()
            };
        });
        
        controller = new ConfirmedMatchesController();
        mockMatchServiceEntityInstance = controller.matchServiceEntity;
        res = mockResponse();
    });

    describe('fetchConfirmedMatches', () => {
        it('should return matches successfully for an authenticated Cleaner with no filters', async () => {
            req = mockRequest(mockCleanerUser, {});
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(mockMatchesData);

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, {});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMatchesData);
        });

        it('should pass filters to entity if provided in query', async () => {
            const queryParams = { serviceType: 'Deep Clean', startDate: '2025-01-01', endDate: '2025-01-31' };
            req = mockRequest(mockCleanerUser, queryParams);
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(mockMatchesData);

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, queryParams);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMatchesData);
        });
        
        it('should only pass provided filters to entity', async () => {
            const queryParams = { startDate: '2025-01-01' }; // Only startDate
            const expectedFilters = { startDate: '2025-01-01' };
            req = mockRequest(mockCleanerUser, queryParams);
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(mockMatchesData);

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, expectedFilters);
        });


        it('should return "No matches found" message if entity provides it', async () => {
            req = mockRequest(mockCleanerUser, {});
            const noMatchesResponse = { message: "No confirmed matches found for selected filters" };
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(noMatchesResponse);

            await controller.fetchConfirmedMatches(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(noMatchesResponse);
        });

        it('should return 401 if user is not authenticated', async () => {
            req = mockRequest(null, {}); 

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
        });

        it('should return 403 if authenticated user is not a Cleaner', async () => {
            req = mockRequest(mockNonCleanerUser, {});

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can view their confirmed matches.' });
        });

        it('should return error from entity if fetching matches fails (e.g., invalid date format)', async () => {
            req = mockRequest(mockCleanerUser, { startDate: 'invalid-date' });
            const entityErrorResponse = { error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } };
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(entityErrorResponse);

            await controller.fetchConfirmedMatches(req, res);
            
            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, { startDate: 'invalid-date' });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid start date format. Use YYYY-MM-DD.' });
        });

        it('should return 500 on unexpected controller error (if entity method throws)', async () => {
            req = mockRequest(mockCleanerUser, {});
            const unexpectedError = new Error("Critical failure in entity method");
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockRejectedValue(unexpectedError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.fetchConfirmedMatches(req, res);
            consoleErrorSpy.mockRestore();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while fetching confirmed matches.' });
        });
    });
});
