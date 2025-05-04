const ServiceListingEntity = require('../../src/entities/serviceListingEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
    const mockPrisma = {
        serviceListing: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
        userAccount: { // Mock UserAccount for cleaner check
            findUnique: jest.fn(),
        },
    };
    // Mock the Prisma namespace and the specific error class used in the entity
    const mockPrismaNamespace = {
        PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        Prisma: mockPrismaNamespace, // Export the mocked Prisma namespace
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

    // --- Test getListingDetails ---
    describe('getListingDetails', () => {
        const listingId = 'listing-id-789';
        const ownerCleanerId = 'cleaner-id-abc';
        const otherCleanerId = 'cleaner-id-xyz';
        const mockListing = {
            id: listingId,
            serviceType: 'Gardening',
            title: 'Lawn Mowing',
            description: 'Basic lawn mowing service.',
            ratePerHr: 40,
            duration: 1.5,
            availability: new Date(),
            createdAt: new Date(),
            cleanerId: ownerCleanerId, // Belongs to ownerCleanerId
            cleaner: {
                username: 'gardenMaster'
            }
        };
         const expectedResult = {
            ...mockListing,
            cleanerUsername: mockListing.cleaner.username,
            cleaner: undefined
        };

        it('should return listing details if found and requester is the owner', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockListing);

            const result = await serviceListingEntity.getListingDetails(listingId, ownerCleanerId);

            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({
                where: { id: listingId },
                select: expect.any(Object) // Verify select is used
            });
            expect(result).toEqual(expectedResult);
        });

        it('should return 404 error if listing is not found', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(null);
            const expectedError = { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };

            const result = await serviceListingEntity.getListingDetails(listingId, ownerCleanerId);

            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({
                where: { id: listingId },
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedError);
        });

        it('should return 403 error if listing is found but requester is not the owner', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockListing); // Found the listing
            const expectedError = { error: { status: 403, error: 'Forbidden: You do not have permission to view this listing.' } };

            // Requesting user is different from the listing's cleanerId
            const result = await serviceListingEntity.getListingDetails(listingId, otherCleanerId);

            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({
                where: { id: listingId },
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedError);
        });

         it('should return 400 error for invalid listing ID format (simulated Prisma error)', async () => {
            const invalidId = 'invalid-id-format';
            const prismaError = new Error("Simulated Malformed ObjectID");
            prismaError.code = 'P2023'; // Prisma code for invalid ID format often
            mockPrismaClient.serviceListing.findUnique.mockRejectedValue(prismaError);
            const expectedError = { error: { status: 400, error: 'Invalid listing ID format.' } };

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.getListingDetails(invalidId, ownerCleanerId);
            consoleErrorSpy.mockRestore();


            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({
                where: { id: invalidId },
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedError);
        });

        it('should return 500 error on unexpected database error', async () => {
            const dbError = new Error("Unexpected DB failure");
            mockPrismaClient.serviceListing.findUnique.mockRejectedValue(dbError);
            const expectedError = { error: { status: 500, error: 'Failed to retrieve service listing due to a server error.' } };

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.getListingDetails(listingId, ownerCleanerId);
            consoleErrorSpy.mockRestore();

            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({
                where: { id: listingId },
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedError);
        });

         it('should return 400 error if listingId is not provided or not a string', async () => {
            let result = await serviceListingEntity.getListingDetails(null, ownerCleanerId);
            expect(result).toEqual({ error: { status: 400, error: 'Invalid listing ID provided.' } });

            result = await serviceListingEntity.getListingDetails(123, ownerCleanerId); // Not a string
             expect(result).toEqual({ error: { status: 400, error: 'Invalid listing ID provided.' } });
        });

         it('should return 401 error if requestingCleanerId is not provided', async () => {
            let result = await serviceListingEntity.getListingDetails(listingId, null);
            expect(result).toEqual({ error: { status: 401, error: 'Authentication required.' } });
        });
    });
});