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

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, { serviceType: '', startDate: '', endDate: '' });
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
        
        it('should only pass provided filters to entity, with defaults for others', async () => {
            const queryParams = { startDate: '2025-01-01' }; // Only startDate
            const expectedFilters = { serviceType: '', startDate: '2025-01-01', endDate: '' };
            req = mockRequest(mockCleanerUser, queryParams);
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(mockMatchesData);

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, expectedFilters);
        });


        it('should return "No matches found" message if entity provides it', async () => {
            req = mockRequest(mockCleanerUser, { serviceType: '', startDate: '', endDate: '' }); // Pass empty filters
            const noMatchesResponse = { message: "No confirmed matches found for selected filters" };
            // Ensure the entity is mocked to return this specific response for this call
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(noMatchesResponse);


            await controller.fetchConfirmedMatches(req, res);
            
            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, { serviceType: '', startDate: '', endDate: '' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(noMatchesResponse);
        });

        it('should return 400 if user is not authenticated (cleanerId is missing)', async () => {
            req = mockRequest(null, {}); 

            await controller.fetchConfirmedMatches(req, res);

            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Cleaner ID is required' });
        });

        it('should proceed and call entity if authenticated user is not a Cleaner, as controller has no role check', async () => {
            req = mockRequest(mockNonCleanerUser, {}); // User is 'Homeowner'
            // Mock entity call for this scenario
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(mockMatchesData);

            await controller.fetchConfirmedMatches(req, res);

            // Entity IS called because controller doesn't check profile.name
            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockNonCleanerUser.id, { serviceType: '', startDate: '', endDate: '' });
            // Controller returns 200 with whatever entity gives for that ID
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMatchesData);
        });

        it('should return error from entity if fetching matches fails (e.g., invalid date format)', async () => {
            req = mockRequest(mockCleanerUser, { startDate: 'invalid-date' });
            const entityErrorResponse = { error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } };
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockResolvedValue(entityErrorResponse);

            await controller.fetchConfirmedMatches(req, res);
            
            expect(mockMatchServiceEntityInstance.fetchConfirmedMatches).toHaveBeenCalledWith(mockCleanerUser.id, { serviceType: '', startDate: 'invalid-date', endDate: '' });
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid start date format. Use YYYY-MM-DD.' });
        });

        it('should reject if entity method throws, and controller does not catch', async () => {
            req = mockRequest(mockCleanerUser, {});
            const unexpectedError = new Error("Critical failure in entity method");
            mockMatchServiceEntityInstance.fetchConfirmedMatches.mockRejectedValue(unexpectedError);

            await expect(controller.fetchConfirmedMatches(req, res)).rejects.toThrow("Critical failure in entity method");
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
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
            const queryParams = { serviceType: 'RareService', status: 'CONFIRMED' };
            searchReq = mockRequest(mockSearchCleanerUser, queryParams);
            const noMatchesResponse = { message: "No confirmed matches found for selected search criteria." };
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(noMatchesResponse);

            await searchController.searchConfirmedMatches(searchReq, searchRes);

            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(mockSearchCleanerUser.id, queryParams);
            expect(searchRes.status).toHaveBeenCalledWith(200);
            expect(searchRes.json).toHaveBeenCalledWith(noMatchesResponse);
        });

        it('should call entity with undefined cleanerId and handle entity error if user is not authenticated for search', async () => {
            const queryParams = { status: 'CONFIRMED' };
            searchReq = mockRequest(null, queryParams); 
            const entityError = { error: { status: 400, error: 'Entity requires Cleaner ID for search' } };
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(entityError);

            await searchController.searchConfirmedMatches(searchReq, searchRes);

            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(undefined, queryParams);
            expect(searchRes.status).toHaveBeenCalledWith(400);
            expect(searchRes.json).toHaveBeenCalledWith({ error: 'Entity requires Cleaner ID for search' });
        });

        it('should proceed and call entity if authenticated user is not a Cleaner for search, as controller has no role check', async () => {
            const queryParams = { status: 'CONFIRMED' };
            searchReq = mockRequest(mockNonCleanerUser, queryParams); // mockNonCleanerUser is 'Homeowner'
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(mockSearchMatchesData);
            
            await searchController.searchConfirmedMatches(searchReq, searchRes);

            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(mockNonCleanerUser.id, queryParams);
            expect(searchRes.status).toHaveBeenCalledWith(200);
            expect(searchRes.json).toHaveBeenCalledWith(mockSearchMatchesData);
        });

        it('should return error from entity if search fails (e.g., invalid date format)', async () => {
            const queryParams = { startDate: 'invalid-date-search', status: 'CONFIRMED' };
            searchReq = mockRequest(mockSearchCleanerUser, queryParams);
            const entityErrorResponse = { error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } };
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockResolvedValue(entityErrorResponse);

            await searchController.searchConfirmedMatches(searchReq, searchRes);

            expect(mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches).toHaveBeenCalledWith(mockSearchCleanerUser.id, queryParams);
            expect(searchRes.status).toHaveBeenCalledWith(400);
            expect(searchRes.json).toHaveBeenCalledWith({ error: 'Invalid start date format. Use YYYY-MM-DD.' });
        });

        it('should reject if entity method throws during search, and controller does not catch', async () => {
            searchReq = mockRequest(mockSearchCleanerUser, { status: 'CONFIRMED' });
            const unexpectedError = new Error("Critical failure in search entity method");
            mockSearchMatchServiceEntityInstance.searchCleanerConfirmedMatches.mockRejectedValue(unexpectedError);

            await expect(searchController.searchConfirmedMatches(searchReq, searchRes)).rejects.toThrow("Critical failure in search entity method");
            expect(searchRes.status).not.toHaveBeenCalled();
            expect(searchRes.json).not.toHaveBeenCalled();
        });
    });
});
