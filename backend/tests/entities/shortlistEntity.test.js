const ShortlistEntity = require('../../src/entities/shortlistEntity');
const { PrismaClient, UserStatus } = require('../../src/generated/prisma');

// Mock lib/prismaClient by defining the mock object within the factory
jest.mock('../../src/lib/prismaClient', () => ({
    userAccount: {
        findUnique: jest.fn(),
    },
    shortlist: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
    },
    userProfile: {
        findUnique: jest.fn(),
    }
}));

jest.mock('../../src/generated/prisma', () => {
    const actualGeneratedPrisma = jest.requireActual('../../src/generated/prisma');
    return {
        ...actualGeneratedPrisma, 
        PrismaClient: jest.fn(() => require('../../src/lib/prismaClient')), // Return the same mock
    };
});


describe('ShortlistEntity', () => {
    let shortlistEntity;
    let mockPrisma;
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks(); // Ensure mocks are cleared
        // Suppress console.error for expected error handling tests
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        mockPrisma = require('../../src/lib/prismaClient');
        shortlistEntity = new ShortlistEntity();
    });

    afterEach(() => {
        // Restore console.error
        if (consoleErrorSpy) {
            consoleErrorSpy.mockRestore();
        }
        jest.clearAllMocks();
    });

    describe('shortlistCleaner', () => {
        const homeownerId = 'homeowner123';
        const cleanerId = 'cleaner456';

        it('should successfully shortlist a cleaner', async () => {
            mockPrisma.userAccount.findUnique.mockResolvedValue({ id: cleanerId, username: 'testcleaner', userProfile: { name: 'Cleaner' } });
            mockPrisma.shortlist.findFirst.mockResolvedValue(null); // Not already shortlisted
            mockPrisma.shortlist.create.mockResolvedValue({ homeownerId, cleanerId });

            const result = await shortlistEntity.shortlistCleaner(homeownerId, cleanerId);

            expect(mockPrisma.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: cleanerId }, include: { userProfile: { select: { name: true } } } });
            expect(mockPrisma.shortlist.findFirst).toHaveBeenCalledWith({ where: { homeownerId, cleanerId } });
            expect(mockPrisma.shortlist.create).toHaveBeenCalledWith({
                data: {
                    homeowner: { connect: { id: homeownerId } },
                    cleaner: { connect: { id: cleanerId } }
                }
            });
            expect(result).toBe(true);
        });

        it('should return error if cleaner is already shortlisted', async () => {
            mockPrisma.userAccount.findUnique.mockResolvedValue({ id: cleanerId, username: 'testcleaner', userProfile: { name: 'Cleaner' } });
            mockPrisma.shortlist.findFirst.mockResolvedValue({ id: 'shortlistEntry1' }); // Already exists

            const result = await shortlistEntity.shortlistCleaner(homeownerId, cleanerId);
            
            expect(mockPrisma.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: cleanerId }, include: { userProfile: { select: { name: true } } } });
            expect(result).toEqual({ error: { status: 409, error: `Cleaner 'testcleaner' is already in your shortlist` } });
            expect(mockPrisma.shortlist.create).not.toHaveBeenCalled();
        });
        
        it('should return 500 error if Prisma throws an error during userAccount.findUnique', async () => {
            mockPrisma.userAccount.findUnique.mockRejectedValue(new Error('DB error'));

            const result = await shortlistEntity.shortlistCleaner(homeownerId, cleanerId);
            
            expect(result).toEqual({ error: { status: 500, error: 'An unexpected error occurred during shortlist.' } });
        });

        it('should return 500 error if Prisma throws an error during shortlist.create', async () => {
            mockPrisma.userAccount.findUnique.mockResolvedValue({ id: cleanerId, username: 'testcleaner', userProfile: { name: 'Cleaner' } });
            mockPrisma.shortlist.findFirst.mockResolvedValue(null);
            mockPrisma.shortlist.create.mockRejectedValue(new Error('DB error on create'));

            const result = await shortlistEntity.shortlistCleaner(homeownerId, cleanerId);

            expect(result).toEqual({ error: { status: 500, error: 'An unexpected error occurred during shortlist.' } });
        });
    });

    describe('searchShortlistCleaner', () => {
        const homeownerId = 'homeowner123';
        const cleanerProfileId = 'profileCleanerId';

        beforeEach(() => {
            mockPrisma.userProfile.findUnique.mockResolvedValue({ id: cleanerProfileId });
        });

        it('should return cleaners matching the keyword', async () => {
            const keyword = 'reliable';
            const mockShortlistEntries = [
                { cleaner: { id: 'cleaner1', username: 'reliableCleaner', email: 'rc@example.com', serviceListings: [] } },
                { cleaner: { id: 'cleaner2', username: 'another', email: 'a@example.com', serviceListings: [{ description: 'very reliable service'}] } }
            ];
            mockPrisma.shortlist.findMany.mockResolvedValue(mockShortlistEntries);

            const result = await shortlistEntity.searchShortlistCleaner(homeownerId, keyword);

            expect(mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'Cleaner' }, select: { id: true } });
            expect(mockPrisma.shortlist.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    homeownerId,
                    cleaner: {
                        userProfileId: cleanerProfileId,
                        status: UserStatus.ACTIVE,
                        OR: expect.any(Array), // Check that OR condition is present
                    },
                },
            }));
            expect(result).toEqual([
                { id: 'cleaner1', username: 'reliableCleaner', email: 'rc@example.com', serviceListings: [] },
                { id: 'cleaner2', username: 'another', email: 'a@example.com', serviceListings: [{ description: 'very reliable service'}] }
            ]);
        });

        it('should return all active shortlisted cleaners if no keyword is provided', async () => {
            const keyword = "";
            const mockShortlistEntries = [
                { cleaner: { id: 'cleaner1', username: 'cleanerOne', email: 'co@example.com', serviceListings: [] } },
            ];
            mockPrisma.shortlist.findMany.mockResolvedValue(mockShortlistEntries);

            const result = await shortlistEntity.searchShortlistCleaner(homeownerId, keyword);
            
            expect(mockPrisma.shortlist.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    homeownerId,
                    cleaner: {
                        userProfileId: cleanerProfileId,
                        status: UserStatus.ACTIVE,
                        // No OR condition for keyword search
                    },
                },
            }));
            expect(result).toEqual([{ id: 'cleaner1', username: 'cleanerOne', email: 'co@example.com', serviceListings: [] }]);
        });
        
        it('should return empty array if no cleaners match', async () => {
            const keyword = 'nonexistent';
            mockPrisma.shortlist.findMany.mockResolvedValue([]);
            const result = await shortlistEntity.searchShortlistCleaner(homeownerId, keyword);
            expect(result).toEqual([]);
        });

        it('should return error if Cleaner profile is not found', async () => {
            mockPrisma.userProfile.findUnique.mockResolvedValue(null); // Cleaner profile not found

            const result = await shortlistEntity.searchShortlistCleaner(homeownerId, 'any');
            
            expect(result).toEqual({
                error: {
                    status: 500,
                    message: "An unexpected error occurred while searching your shortlist."
                }
            });
        });
        
        it('should return error if prisma.shortlist.findMany fails', async () => {
            mockPrisma.shortlist.findMany.mockRejectedValue(new Error('DB error'));
            const result = await shortlistEntity.searchShortlistCleaner(homeownerId, 'any');
            expect(result).toEqual({
                error: {
                    status: 500,
                    message: "An unexpected error occurred while searching your shortlist."
                }
            });
        });
    });

    describe('fetchAllCleanersForHomeowner', () => {
        const homeownerId = 'homeowner123';
        const cleanerProfileId = 'profileCleanerId';

        beforeEach(() => {
            mockPrisma.userProfile.findUnique.mockResolvedValue({ id: cleanerProfileId });
        });

        it('should fetch all active shortlisted cleaners for a homeowner', async () => {
            const mockEntries = [
                { addedAt: new Date(), cleaner: { id: 'c1', username: 'cleaner1', email: 'c1@e.com', serviceListings: [{ title: 'Basic Clean' }] } },
                { addedAt: new Date(), cleaner: { id: 'c2', username: 'cleaner2', email: 'c2@e.com', serviceListings: [] } }
            ];
            mockPrisma.shortlist.findMany.mockResolvedValue(mockEntries);

            const result = await shortlistEntity.fetchAllCleanersForHomeowner(homeownerId);

            expect(mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'Cleaner' }, select: { id: true } });
            expect(mockPrisma.shortlist.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    homeownerId,
                    cleaner: { userProfileId: cleanerProfileId, status: UserStatus.ACTIVE },
                },
            }));
            expect(result.length).toBe(2);
            expect(result[0]).toHaveProperty('shortlistedAt');
            expect(result[0].username).toBe('cleaner1');
        });
        
        it('should return empty array if no cleaners are shortlisted', async () => {
            mockPrisma.shortlist.findMany.mockResolvedValue([]);
            const result = await shortlistEntity.fetchAllCleanersForHomeowner(homeownerId);
            expect(result).toEqual([]);
        });

        it('should return error if Cleaner profile is not found', async () => {
            mockPrisma.userProfile.findUnique.mockResolvedValue(null);
            const result = await shortlistEntity.fetchAllCleanersForHomeowner(homeownerId);
            expect(result).toEqual({
                error: {
                    status: 500,
                    message: "An unexpected error occurred while retrieving your shortlist."
                }
            });
        });
        
        it('should return error if prisma.shortlist.findMany fails', async () => {
            mockPrisma.shortlist.findMany.mockRejectedValue(new Error('DB error'));
            const result = await shortlistEntity.fetchAllCleanersForHomeowner(homeownerId);
            expect(result).toEqual({
                error: {
                    status: 500,
                    message: "An unexpected error occurred while retrieving your shortlist."
                }
            });
        });
    });

    describe('getAllShortlistedCleaners', () => {
        const homeownerId = 'homeowner123';
        const cleanerProfileId = 'profileCleanerId';
        const mockDate = new Date();

        beforeEach(() => {
            mockPrisma.userProfile.findUnique.mockResolvedValue({ id: cleanerProfileId });
        });

        it('should fetch all shortlisted cleaners with complete details', async () => {
            const mockEntries = [
                { 
                    createdAt: mockDate,
                    cleaner: { 
                        id: 'c1', 
                        username: 'cleaner1', 
                        email: 'c1@e.com', 
                        serviceListings: [
                            { id: 'sl1', description: 'Desc 1', ratePerHr: 20, serviceCategory: { serviceCatName: 'General Cleaning' } }
                        ] 
                    } 
                }
            ];
            mockPrisma.shortlist.findMany.mockResolvedValue(mockEntries);

            const result = await shortlistEntity.getAllShortlistedCleaners(homeownerId);

            expect(mockPrisma.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'Cleaner' }, select: { id: true } });
            expect(mockPrisma.shortlist.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    homeownerId,
                    cleaner: { userProfileId: cleanerProfileId, status: 'ACTIVE' },
                },
                include: expect.any(Object) 
            }));
            expect(result.length).toBe(1);
            expect(result[0]).toEqual({
                id: 'c1',
                username: 'cleaner1',
                email: 'c1@e.com',
                serviceListings: [{ id: 'sl1', description: 'Desc 1', ratePerHr: 20, serviceCategory: { serviceCatName: 'General Cleaning' }, serviceType: 'General Cleaning' }],
                shortlistedAt: mockDate
            });
        });
        
        it('should correctly map serviceType even if serviceCategory is null', async () => {
            const mockEntries = [
                { 
                    createdAt: mockDate,
                    cleaner: { 
                        id: 'c1', 
                        username: 'cleaner1', 
                        email: 'c1@e.com', 
                        serviceListings: [
                            { id: 'sl1', description: 'Desc 1', ratePerHr: 20, serviceCategory: null } // Null category
                        ] 
                    } 
                }
            ];
            mockPrisma.shortlist.findMany.mockResolvedValue(mockEntries);
            const result = await shortlistEntity.getAllShortlistedCleaners(homeownerId);
            expect(result[0].serviceListings[0].serviceType).toBe('Cleaning'); // Default value
        });

        it('should return empty array if no cleaners are shortlisted', async () => {
            mockPrisma.shortlist.findMany.mockResolvedValue([]);
            const result = await shortlistEntity.getAllShortlistedCleaners(homeownerId);
            expect(result).toEqual([]);
        });

        it('should return error if Cleaner profile is not found', async () => {
            mockPrisma.userProfile.findUnique.mockResolvedValue(null);
            const result = await shortlistEntity.getAllShortlistedCleaners(homeownerId);
            expect(result).toEqual({
                error: {
                    status: 500,
                    message: "Failed to fetch shortlisted cleaners"
                }
            });
        });
        
        it('should return error if prisma.shortlist.findMany fails', async () => {
            mockPrisma.shortlist.findMany.mockRejectedValue(new Error('DB error'));
            const result = await shortlistEntity.getAllShortlistedCleaners(homeownerId);
            expect(result).toEqual({
                error: {
                    status: 500,
                    message: "Failed to fetch shortlisted cleaners"
                }
            });
        });
    });
});
