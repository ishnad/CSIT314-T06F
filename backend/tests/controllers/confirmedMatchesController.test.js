const { ConfirmedMatchesController, SearchConfirmedMatchesController } = require('../../src/controllers/confirmedMatchesController');
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

// --- Test Suite for SearchConfirmedMatchesController ---
describe('SearchConfirmedMatchesController', () => {
    let searchController; // Different controller instance
    let mockSearchMatchServiceEntityInstance; // Different entity mock instance
    let searchReq;
    let searchRes;

    const mockSearchCleanerUser = {
        id: 'cleaner-search-user-456',
        username: 'testSearchCleaner',
        profile: { name: 'Cleaner' }, // Add the profile property
    };

    // Define mockNonCleanerUser for this scope as well
    const mockNonCleanerUser = {
        id: 'homeowner-user-id-search-789', // Can use a different ID or same as outer scope if appropriate
        username: 'testSearchHomeowner',
        profile: { name: 'Homeowner' }, // Correct profile name for a non-cleaner
    };

    const mockSearchMatchesData = [
        { matchId: 'match-s1', serviceTitle: 'Searchable Service', confirmationDate: new Date() }
    ];

    beforeEach(() => {
        jest.clearAllMocks(); // Clears mocks for all tests
        MatchServiceEntity.mockClear(); // Clear constructor mocks for MatchServiceEntity
        
        // Mock implementation for the entity used by SearchConfirmedMatchesController
        MatchServiceEntity.mockImplementation(() => {
            return {
                // fetchConfirmedMatches: jest.fn(), // Keep if ConfirmedMatchesController is also tested here
                searchCleanerConfirmedMatches: jest.fn() // Mock for the new search method
            };
        });
        
        searchController = new SearchConfirmedMatchesController(); // Use the directly imported controller
        mockSearchMatchServiceEntityInstance = searchController.matchServiceEntity;
        searchRes = mockResponse(); // Fresh response mock
    });

    describe('searchConfirmedMatches (new controller method)', () => {
        it('should return matches successfully for an authenticated Cleaner with status filter', async () => {
            searchReq = mockRequest(mockSearchCleanerUser, { status: 'CONFIRMED', serviceType: 'Cleaning' });
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(mockSearchMatchesData);

            await searchController.searchConfirmedMatches(searchReq, searchRes);

            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(
                mockSearchCleanerUser.id,
                { status: 'CONFIRMED', serviceType: 'Cleaning' }
            );
            expect(searchRes.status).toHaveBeenCalledWith(200);
            expect(searchRes.json).toHaveBeenCalledWith(mockSearchMatchesData);
        });

        it('should pass all filters (serviceType, dates, status) to entity', async () => {
            const queryParams = { serviceType: 'Deep Clean', startDate: '2025-02-01', endDate: '2025-02-28', status: 'CONFIRMED' };
            searchReq = mockRequest(mockSearchCleanerUser, queryParams);
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(mockSearchMatchesData);

            await searchController.searchConfirmedMatches(searchReq, searchRes);

            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(mockSearchCleanerUser.id, queryParams);
            expect(searchRes.status).toHaveBeenCalledWith(200);
            expect(searchRes.json).toHaveBeenCalledWith(mockSearchMatchesData);
        });

        it('should return message from entity if status filter is not "CONFIRMED"', async () => {
            searchReq = mockRequest(mockSearchCleanerUser, { status: 'PENDING' });
            const entityMessageResponse = { message: "Filtering by status 'PENDING' is not currently supported..." };
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(entityMessageResponse);

            await searchController.searchConfirmedMatches(searchReq, searchRes);
            
            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(mockSearchCleanerUser.id, { status: 'PENDING' });
            expect(searchRes.status).toHaveBeenCalledWith(200);
            expect(searchRes.json).toHaveBeenCalledWith(entityMessageResponse);
        });
        
        it('should return "No matches found" message from entity if applicable', async () => {
            searchReq = mockRequest(mockSearchCleanerUser, { serviceType: 'RareService', status: 'CONFIRMED' });
            const noMatchesResponse = { message: "No confirmed matches found for selected search criteria." };
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(noMatchesResponse);

            await searchController.searchConfirmedMatches(searchReq, searchRes);
            expect(searchRes.status).toHaveBeenCalledWith(200);
            expect(searchRes.json).toHaveBeenCalledWith(noMatchesResponse);
        });

        it('should return 401 if user is not authenticated for search', async () => {
            searchReq = mockRequest(null, { status: 'CONFIRMED' }); 
            await searchController.searchConfirmedMatches(searchReq, searchRes);
            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).not.toHaveBeenCalled();
            expect(searchRes.status).toHaveBeenCalledWith(401);
            expect(searchRes.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
        });

        it('should return 403 if authenticated user is not a Cleaner for search', async () => {
            searchReq = mockRequest(mockNonCleanerUser, { status: 'CONFIRMED' }); // mockNonCleanerUser defined in outer scope
            await searchController.searchConfirmedMatches(searchReq, searchRes);
            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).not.toHaveBeenCalled();
            expect(searchRes.status).toHaveBeenCalledWith(403);
            expect(searchRes.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can search their confirmed matches.' });
        });

        it('should return error from entity if search fails (e.g., invalid date format)', async () => {
            searchReq = mockRequest(mockSearchCleanerUser, { startDate: 'invalid-date-search', status: 'CONFIRMED' });
            const entityErrorResponse = { error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } };
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(entityErrorResponse);

            await searchController.searchConfirmedMatches(searchReq, searchRes);
            expect(searchRes.status).toHaveBeenCalledWith(400);
            expect(searchRes.json).toHaveBeenCalledWith({ error: 'Invalid start date format. Use YYYY-MM-DD.' });
        });

        it('should return 500 on unexpected controller error during search (if entity method throws)', async () => {
            searchReq = mockRequest(mockSearchCleanerUser, { status: 'CONFIRMED' });
            const unexpectedError = new Error("Critical failure in search entity method");
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockRejectedValue(unexpectedError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await searchController.searchConfirmedMatches(searchReq, searchRes);
            consoleErrorSpy.mockRestore();

            expect(searchRes.status).toHaveBeenCalledWith(500);
            expect(searchRes.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while searching confirmed matches.' });
        });
    });
});
