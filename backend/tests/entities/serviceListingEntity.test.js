const ServiceListingEntity = require('../../src/entities/serviceListingEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
    const mockPrisma = {
        serviceListing: {
            create: jest.fn(),
        },
        userAccount: { // Mock UserAccount for cleaner check
            findUnique: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

// --- Test Suite ---
describe('ServiceListingEntity', () => {
    let serviceListingEntity;
    let mockPrismaClient;

    beforeEach(() => {
        jest.clearAllMocks();
        serviceListingEntity = new ServiceListingEntity();
        mockPrismaClient = new PrismaClient();
    });

    // --- Test validateInput ---
    describe('validateInput', () => {
        const validData = {
            serviceType: 'Deep Clean',
            title: 'My Awesome Deep Clean Service',
            description: 'Very thorough cleaning.',
            ratePerHr: 25.50,
            duration: 3,
            availability: new Date().toISOString(),
            cleanerId: 'cleaner-user-id-123',
        };

        it('should return null for valid input', () => {
            expect(serviceListingEntity.validateInput(validData)).toBeNull();
        });

        it('should return error if title is missing (as it is checked first)', () => {
            const missingFields = { ...validData, title: undefined };
            // Because title is checked early, its specific error is returned first
            expect(serviceListingEntity.validateInput(missingFields)).toEqual({
                status: 400,
                error: 'Title must be a non-empty string.',
            });
        });

        it('should return error for invalid ratePerHr', () => {
            const invalidRate = { ...validData, ratePerHr: -10 };
            expect(serviceListingEntity.validateInput(invalidRate)).toEqual({
                status: 400,
                error: 'Rate per hour must be a positive number.',
            });
             const nonNumericRate = { ...validData, ratePerHr: 'abc' };
             expect(serviceListingEntity.validateInput(nonNumericRate)).toEqual({
                status: 400,
                error: 'Rate per hour must be a positive number.',
            });
        });

        it('should return error if duration is required but missing', () => {
           const missingDuration = { ...validData, duration: undefined };
           expect(serviceListingEntity.validateInput(missingDuration)).toEqual({
               status: 400,
               error: 'Duration is required.',
           });
        });

        it('should return error if duration is not a positive number', () => {
            const zeroDuration = { ...validData, duration: 0 };
            expect(serviceListingEntity.validateInput(zeroDuration)).toEqual({
                status: 400,
                error: 'Duration must be a positive number.',
            });
            const negativeDuration = { ...validData, duration: -1 };
            expect(serviceListingEntity.validateInput(negativeDuration)).toEqual({
                status: 400,
                error: 'Duration must be a positive number.',
            });
            const nonNumericDuration = { ...validData, duration: 'abc' };
             expect(serviceListingEntity.validateInput(nonNumericDuration)).toEqual({
                status: 400,
                error: 'Duration must be a positive number.',
            });
        });

        it('should return error for invalid availability date string', () => {
            const invalidDate = { ...validData, availability: 'not-a-date' };
            expect(serviceListingEntity.validateInput(invalidDate)).toEqual({
                status: 400,
                error: 'Availability must be a valid ISO 8601 date string.',
            });
        });

         it('should return error for empty string fields', () => {
            const emptyTitle = { ...validData, title: '   ' };
            expect(serviceListingEntity.validateInput(emptyTitle)).toEqual({
                status: 400,
                error: 'Title must be a non-empty string.',
            });
        });
    });

    // --- Test createServiceListing ---
    describe('createServiceListing', () => {
        const validDate = new Date();
        const validDateISO = validDate.toISOString();
        const listingData = {
            serviceType: ' Window Cleaning ', // With whitespace
            title: ' Sparkling Windows ', // With whitespace
            description: ' Streak-free guarantee! ', // With whitespace
            ratePerHr: 30,
            duration: 2.5,
            availability: validDateISO,
            cleanerId: 'cleaner-id-abc',
        };
        const mockCleaner = {
            id: listingData.cleanerId,
            username: 'windowCleaner',
            userProfile: { name: 'Cleaner' } // Correct profile
        };
         const mockNonCleaner = {
            id: listingData.cleanerId,
            username: 'homeownerBob',
            userProfile: { name: 'Homeowner' } // Incorrect profile
        };
        const createdListingRaw = { // Raw return from prisma.create
            id: 'listing-id-123',
            serviceType: 'Window Cleaning',
            title: 'Sparkling Windows',
            description: 'Streak-free guarantee!',
            ratePerHr: 30,
            duration: 2.5,
            availability: validDate,
            createdAt: new Date(),
            cleaner: {
                id: listingData.cleanerId,
                username: mockCleaner.username
            }
        };
        const expectedListingResult = { // Expected final result after remapping
            id: 'listing-id-123',
            serviceType: 'Window Cleaning',
            title: 'Sparkling Windows',
            description: 'Streak-free guarantee!',
            ratePerHr: 30,
            duration: 2.5,
            availability: validDate,
            createdAt: createdListingRaw.createdAt,
            cleanerId: listingData.cleanerId,
            cleanerUsername: mockCleaner.username,
        };


        it('should create a service listing successfully', async () => {
            // Mock cleaner check -> found, is Cleaner
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockCleaner);
            // Mock listing creation
            mockPrismaClient.serviceListing.create.mockResolvedValue(createdListingRaw);

            const result = await serviceListingEntity.createServiceListing(listingData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { id: listingData.cleanerId },
                include: { userProfile: true }
            });
            expect(mockPrismaClient.serviceListing.create).toHaveBeenCalledWith({
                data: {
                    serviceType: 'Window Cleaning', // Trimmed
                    title: 'Sparkling Windows', // Trimmed
                    description: 'Streak-free guarantee!', // Trimmed
                    ratePerHr: listingData.ratePerHr,
                    duration: listingData.duration,
                    availability: validDate, // Converted to Date object
                    cleanerId: listingData.cleanerId,
                },
                select: expect.any(Object), // Check that select is used
            });
            expect(result).toEqual(expectedListingResult);
        });

        it('should return validation error if input is invalid', async () => {
            const invalidData = { ...listingData, ratePerHr: -5 };
            const expectedError = { error: { status: 400, error: 'Rate per hour must be a positive number.' } };

            const result = await serviceListingEntity.createServiceListing(invalidData);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userAccount.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.serviceListing.create).not.toHaveBeenCalled();
        });

        it('should return 404 error if cleaner user is not found', async () => {
            // Mock cleaner check -> not found
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null);
            const expectedError = { error: { status: 404, error: `User with ID ${listingData.cleanerId} not found.` } };

            const result = await serviceListingEntity.createServiceListing(listingData);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { id: listingData.cleanerId },
                include: { userProfile: true }
            });
            expect(mockPrismaClient.serviceListing.create).not.toHaveBeenCalled();
        });

        it('should return 403 error if user is not a Cleaner', async () => {
            // Mock cleaner check -> found, but not Cleaner profile
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockNonCleaner);
             const expectedError = { error: { status: 403, error: `User ${mockNonCleaner.username} is not authorized to create listings (not a Cleaner).` } };

            const result = await serviceListingEntity.createServiceListing(listingData);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { id: listingData.cleanerId },
                include: { userProfile: true }
            });
            expect(mockPrismaClient.serviceListing.create).not.toHaveBeenCalled();
        });


        it('should return server error if prisma create fails', async () => {
            const prismaError = new Error("Database connection failed");
            const expectedError = { error: { status: 500, error: 'Failed to create service listing due to a server error.' } };

            // Mock cleaner check -> success
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockCleaner);
            // Mock create to throw an error
            mockPrismaClient.serviceListing.create.mockRejectedValue(prismaError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.createServiceListing(listingData);
            consoleErrorSpy.mockRestore();

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(mockPrismaClient.serviceListing.create).toHaveBeenCalled();
        });

         it('should return specific error if foreign key constraint fails', async () => {
            const prismaError = new Error("Foreign key constraint failed");
            prismaError.code = 'P2003'; // Simulate Prisma FK error code
            const expectedError = { error: { status: 400, error: `Invalid cleanerId provided.` } };

            // Mock cleaner check -> success (even though FK fails later, the check passes first)
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockCleaner);
            // Mock create to throw FK error
            mockPrismaClient.serviceListing.create.mockRejectedValue(prismaError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.createServiceListing(listingData);
            consoleErrorSpy.mockRestore();

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(mockPrismaClient.serviceListing.create).toHaveBeenCalled();
        });
    });
});
