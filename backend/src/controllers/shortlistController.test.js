const { SaveShortlistController, SearchShortlistCleanerController, ViewShortlistController } = require('./shortlistController');
const ShortlistEntity = require('../entities/shortlistEntity');

// Mock the ShortlistEntity
jest.mock('../entities/shortlistEntity');

describe('Shortlist Controllers', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        mockReq = {
            body: {},
            query: {},
            user: { id: 'homeowner123' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        // Reset mocks for ShortlistEntity methods
        ShortlistEntity.mockClear();
    });

    describe('SaveShortlistController', () => {
        let controller;
        beforeEach(() => {
            // Clear all instances and calls to constructor and all methods:
            ShortlistEntity.mockClear();
            controller = new SaveShortlistController();
        });

        it('should successfully shortlist a cleaner and return 201 status', async () => {
            mockReq.body = { homeownerId: 'homeowner123', cleanerId: 'cleaner456' };
            const mockShortlistCleaner = jest.fn().mockResolvedValue(true);
            controller.shortlistEntity.shortlistCleaner = mockShortlistCleaner;

            await controller.shortlistCleaner(mockReq, mockRes);

            expect(mockShortlistCleaner).toHaveBeenCalledWith('homeowner123', 'cleaner456');
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(true);
        });

        it('should return error status and message if shortlisting fails with a known error', async () => {
            mockReq.body = { homeownerId: 'homeowner123', cleanerId: 'cleaner456' };
            const errorResponse = { error: { status: 409, message: 'Already shortlisted' } };
            const mockShortlistCleaner = jest.fn().mockResolvedValue(errorResponse);
            controller.shortlistEntity.shortlistCleaner = mockShortlistCleaner;

            await controller.shortlistCleaner(mockReq, mockRes);

            expect(mockShortlistCleaner).toHaveBeenCalledWith('homeowner123', 'cleaner456');
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Already shortlisted' });
        });

        it('should return 500 status for unexpected errors during shortlisting', async () => {
            mockReq.body = { homeownerId: 'homeowner123', cleanerId: 'cleaner456' };
            // Simulate an unexpected return or throw
            const mockShortlistCleaner = jest.fn().mockResolvedValue({}); // Not true, not error object
            controller.shortlistEntity.shortlistCleaner = mockShortlistCleaner;

            await controller.shortlistCleaner(mockReq, mockRes);

            expect(mockShortlistCleaner).toHaveBeenCalledWith('homeowner123', 'cleaner456');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Unexpected error occurred" });
        });
    });

    describe('SearchShortlistCleanerController', () => {
        let controller;
        beforeEach(() => {
            ShortlistEntity.mockClear();
            controller = new SearchShortlistCleanerController();
        });

        it('should return 200 and search results if cleaners are found', async () => {
            mockReq.query = { keyword: 'reliable' };
            const searchResults = [{ id: 'cleaner1', name: 'Reliable Cleaner' }];
            const mockSearchShortlistCleaner = jest.fn().mockResolvedValue(searchResults);
            controller.shortlistEntity.searchShortlistCleaner = mockSearchShortlistCleaner;

            await controller.searchShortlistCleaner(mockReq, mockRes);

            expect(mockSearchShortlistCleaner).toHaveBeenCalledWith('homeowner123', 'reliable');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(searchResults);
        });

        it('should return 200 and empty data array if no cleaners are found with a keyword', async () => {
            mockReq.query = { keyword: 'nonexistent' };
            const mockSearchShortlistCleaner = jest.fn().mockResolvedValue([]);
            controller.shortlistEntity.searchShortlistCleaner = mockSearchShortlistCleaner;
            
            await controller.searchShortlistCleaner(mockReq, mockRes);

            expect(mockSearchShortlistCleaner).toHaveBeenCalledWith('homeowner123', 'nonexistent');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ data: [] });
        });
        
        it('should return 200 and empty data array if no cleaners are found without a keyword', async () => {
            mockReq.query = {}; // No keyword
            const mockSearchShortlistCleaner = jest.fn().mockResolvedValue([]);
            controller.shortlistEntity.searchShortlistCleaner = mockSearchShortlistCleaner;

            await controller.searchShortlistCleaner(mockReq, mockRes);
        
            expect(mockSearchShortlistCleaner).toHaveBeenCalledWith('homeowner123', "");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ data: [] });
        });


        it('should return error status and message if search fails', async () => {
            mockReq.query = { keyword: 'reliable' };
            const errorResponse = { error: { status: 500, message: 'Search failed' } };
            const mockSearchShortlistCleaner = jest.fn().mockResolvedValue(errorResponse);
            controller.shortlistEntity.searchShortlistCleaner = mockSearchShortlistCleaner;

            await controller.searchShortlistCleaner(mockReq, mockRes);

            expect(mockSearchShortlistCleaner).toHaveBeenCalledWith('homeowner123', 'reliable');
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Search failed' });
        });
    });

    describe('ViewShortlistController', () => {
        let controller;
        beforeEach(() => {
            ShortlistEntity.mockClear();
            controller = new ViewShortlistController();
        });

        describe('getMyShortlistedCleaners', () => {
            it('should return 200 and the list of shortlisted cleaners', async () => {
                const shortlistedCleaners = [{ id: 'cleaner1', name: 'Cleaner One' }];
                const mockFetchAllCleaners = jest.fn().mockResolvedValue(shortlistedCleaners);
                controller.shortlistEntity.fetchAllCleanersForHomeowner = mockFetchAllCleaners;

                await controller.getMyShortlistedCleaners(mockReq, mockRes);

                expect(mockFetchAllCleaners).toHaveBeenCalledWith('homeowner123');
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith(shortlistedCleaners);
            });

            it('should return 200 and empty data array if no cleaners are shortlisted', async () => {
                const mockFetchAllCleaners = jest.fn().mockResolvedValue([]);
                controller.shortlistEntity.fetchAllCleanersForHomeowner = mockFetchAllCleaners;

                await controller.getMyShortlistedCleaners(mockReq, mockRes);

                expect(mockFetchAllCleaners).toHaveBeenCalledWith('homeowner123');
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith({ data: [] });
            });

            it('should return error status and message if fetching fails', async () => {
                const errorResponse = { error: { status: 500, message: 'Fetch failed' } };
                const mockFetchAllCleaners = jest.fn().mockResolvedValue(errorResponse);
                controller.shortlistEntity.fetchAllCleanersForHomeowner = mockFetchAllCleaners;

                await controller.getMyShortlistedCleaners(mockReq, mockRes);

                expect(mockFetchAllCleaners).toHaveBeenCalledWith('homeowner123');
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({ error: 'Fetch failed' });
            });
        });

        describe('getAllShortlistedCleaners', () => {
            it('should return 200 and all shortlisted cleaners with details', async () => {
                const allShortlisted = [{ id: 'cleaner2', name: 'Cleaner Two Details' }];
                const mockGetAllShortlisted = jest.fn().mockResolvedValue(allShortlisted);
                controller.shortlistEntity.getAllShortlistedCleaners = mockGetAllShortlisted;

                await controller.getAllShortlistedCleaners(mockReq, mockRes);

                expect(mockGetAllShortlisted).toHaveBeenCalledWith('homeowner123');
                expect(mockRes.status).toHaveBeenCalledWith(200);
                expect(mockRes.json).toHaveBeenCalledWith(allShortlisted);
            });

            it('should return error status and message if fetching all fails', async () => {
                const errorResponse = { error: { status: 500, message: 'Fetch all failed' } };
                const mockGetAllShortlisted = jest.fn().mockResolvedValue(errorResponse);
                controller.shortlistEntity.getAllShortlistedCleaners = mockGetAllShortlisted;

                await controller.getAllShortlistedCleaners(mockReq, mockRes);

                expect(mockGetAllShortlisted).toHaveBeenCalledWith('homeowner123');
                expect(mockRes.status).toHaveBeenCalledWith(500);
                expect(mockRes.json).toHaveBeenCalledWith({ error: 'Fetch all failed' });
            });
        });
    });
});
