const ServiceListingEntity = require('../../src/entities/serviceListingEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
    const mockPrisma = {
        serviceListing: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(), // Ensure update and findMany are part of the initial mock
            findMany: jest.fn(),
        },
        userAccount: { // Mock UserAccount for cleaner check
            findUnique: jest.fn(),
        },
    };
    // Define mock Prisma error classes
    class MockPrismaClientValidationError extends Error {
        constructor(message) { super(message); this.name = "PrismaClientValidationError"; }
    }
    class MockPrismaClientKnownRequestError extends Error {
        constructor(message, code) { super(message); this.name = "PrismaClientKnownRequestError"; this.code = code; }
    }
    const mockPrismaNamespace = {
        PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
        PrismaClientValidationError: MockPrismaClientValidationError,
        // Add other specific error types if the entity uses them directly via Prisma.XXXError
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        Prisma: mockPrismaNamespace,
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

    // --- Test validateEditInput ---
    describe('validateEditInput', () => {
        it('should return null for valid partial input (only ratePerHr)', () => {
            expect(serviceListingEntity.validateEditInput({ ratePerHr: 30 })).toBeNull();
        });
        it('should return null for valid partial input (only availability)', () => {
            expect(serviceListingEntity.validateEditInput({ availability: new Date().toISOString() })).toBeNull();
        });
        it('should return null for valid full input', () => {
            expect(serviceListingEntity.validateEditInput({
                serviceType: 'Cleaning',
                description: 'Good clean',
                ratePerHr: 20,
                availability: new Date().toISOString()
            })).toBeNull();
        });
        it('should return null if no editable fields are provided (empty object)', () => {
            expect(serviceListingEntity.validateEditInput({})).toBeNull();
        });

        it('should validate serviceType if provided', () => {
            expect(serviceListingEntity.validateEditInput({ serviceType: '' }))
                .toEqual({ status: 400, error: 'Service Type must be a non-empty string.' });
            expect(serviceListingEntity.validateEditInput({ serviceType: '  ' }))
                .toEqual({ status: 400, error: 'Service Type must be a non-empty string.' });
            expect(serviceListingEntity.validateEditInput({ serviceType: 123 }))
                .toEqual({ status: 400, error: 'Service Type must be a non-empty string.' });
        });
        it('should validate description if provided', () => {
            expect(serviceListingEntity.validateEditInput({ description: '' }))
                .toEqual({ status: 400, error: 'Description must be a non-empty string.' });
        });
        it('should validate ratePerHr if provided', () => {
            expect(serviceListingEntity.validateEditInput({ ratePerHr: -5 }))
                .toEqual({ status: 400, error: 'Rate per hour must be a positive number.' });
            expect(serviceListingEntity.validateEditInput({ ratePerHr: 'abc' }))
                .toEqual({ status: 400, error: 'Rate per hour must be a positive number.' });
        });
        it('should validate availability if provided', () => {
            expect(serviceListingEntity.validateEditInput({ availability: 'not-a-date' }))
                .toEqual({ status: 400, error: 'Availability must be a valid ISO 8601 date string.' });
            expect(serviceListingEntity.validateEditInput({ availability: 12345 }))
                .toEqual({ status: 400, error: 'Availability must be a valid ISO 8601 date string.' });
        });
        it('should ignore fields not meant for editing (e.g. title, duration)', () => {
            expect(serviceListingEntity.validateEditInput({ title: '' })).toBeNull();
            expect(serviceListingEntity.validateEditInput({ duration: 0 })).toBeNull();
        });
    });

    // --- Test editServiceListing ---
    describe('editServiceListing', () => {
        const listingId = 'listing-to-edit-123';
        const cleanerId = 'owner-cleaner-id-456';
        const mockExistingListing = { cleanerId: cleanerId }; // For ownership check
        const validUpdateData = {
            serviceType: ' Specialized Cleaning ',
            description: ' Detailed and specific. ',
            ratePerHr: 50.0,
            availability: new Date().toISOString(),
        };
        const expectedPrismaUpdateData = {
            serviceType: 'Specialized Cleaning',
            description: 'Detailed and specific.',
            ratePerHr: 50.0,
            availability: new Date(validUpdateData.availability),
        };
        const mockUpdatedListingRaw = {
            id: listingId,
            serviceType: expectedPrismaUpdateData.serviceType,
            title: 'Original Title', // Assuming title is not changed
            description: expectedPrismaUpdateData.description,
            ratePerHr: expectedPrismaUpdateData.ratePerHr,
            duration: 2, // Assuming duration is not changed
            availability: expectedPrismaUpdateData.availability,
            createdAt: new Date(),
            updatedAt: new Date(),
            cleaner: { id: cleanerId, username: 'testCleanerOwner' }
        };
        const expectedResult = {
            ...mockUpdatedListingRaw,
            cleanerId: mockUpdatedListingRaw.cleaner.id,
            cleanerUsername: mockUpdatedListingRaw.cleaner.username,
            cleaner: undefined
        };

        beforeEach(() => {
            // Ensure 'update' is mocked on serviceListing
            if (!mockPrismaClient.serviceListing.update) {
                mockPrismaClient.serviceListing.update = jest.fn();
            }
        });

        it('should edit a service listing successfully', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockExistingListing);
            mockPrismaClient.serviceListing.update.mockResolvedValue(mockUpdatedListingRaw);

            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, validUpdateData);
            
            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({ where: { id: listingId }, select: { cleanerId: true } });
            expect(mockPrismaClient.serviceListing.update).toHaveBeenCalledWith({
                where: { id: listingId },
                data: expectedPrismaUpdateData,
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedResult);
        });

        it('should return 400 if listingId is invalid', async () => {
            const result = await serviceListingEntity.editServiceListing(null, cleanerId, validUpdateData);
            expect(result).toEqual({ error: { status: 400, error: 'Invalid listing ID provided.' } });
        });

        it('should return 401 if cleanerId is not provided', async () => {
            const result = await serviceListingEntity.editServiceListing(listingId, null, validUpdateData);
            expect(result).toEqual({ error: { status: 401, error: 'Authentication required for editing.' } });
        });
        
        it('should return 400 if no valid fields are provided for update', async () => {
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, { title: "new title" }); // title is not an allowed edit field
            expect(result).toEqual({ error: { status: 400, error: 'No valid fields provided for update.' } });
        });

        it('should return validation error if input data is invalid', async () => {
            const invalidData = { ratePerHr: -10 };
            const expectedError = { error: { status: 400, error: 'Rate per hour must be a positive number.' } };
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, invalidData);
            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.serviceListing.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.serviceListing.update).not.toHaveBeenCalled();
        });

        it('should return 404 if listing not found', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(null);
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, validUpdateData);
            expect(result).toEqual({ error: { status: 404, error: `Service listing with ID ${listingId} not found.` } });
            expect(mockPrismaClient.serviceListing.update).not.toHaveBeenCalled();
        });

        it('should return 403 if cleaner is not the owner', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue({ cleanerId: 'another-cleaner-id' });
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, validUpdateData);
            expect(result).toEqual({ error: { status: 403, error: 'Forbidden: You do not have permission to edit this listing.' } });
            expect(mockPrismaClient.serviceListing.update).not.toHaveBeenCalled();
        });
        
        it('should handle partial updates correctly (only description)', async () => {
            const partialUpdate = { description: "New Description Only" };
            const expectedPrismaPartial = { description: "New Description Only" };
            const mockUpdatedPartialRaw = { ...mockUpdatedListingRaw, description: "New Description Only" };
             const expectedPartialResult = {
                ...mockUpdatedPartialRaw,
                cleanerId: mockUpdatedPartialRaw.cleaner.id,
                cleanerUsername: mockUpdatedPartialRaw.cleaner.username,
                cleaner: undefined
            };

            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockExistingListing);
            mockPrismaClient.serviceListing.update.mockResolvedValue(mockUpdatedPartialRaw);

            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, partialUpdate);
            expect(mockPrismaClient.serviceListing.update).toHaveBeenCalledWith({
                where: { id: listingId },
                data: expectedPrismaPartial,
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedPartialResult);
        });

        it('should return 500 if Prisma update fails', async () => {
            const dbError = new Error("DB update failed");
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockExistingListing);
            mockPrismaClient.serviceListing.update.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, validUpdateData);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to edit service listing due to a server error.' } });
        });

        it('should return 400 for malformed listing ID during update (Prisma P2023)', async () => {
            const malformedIdError = new Error("Simulated Malformed ObjectID");
            malformedIdError.code = 'P2023';
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockExistingListing); // Initial find is fine
            mockPrismaClient.serviceListing.update.mockRejectedValue(malformedIdError); // Update fails
            
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, validUpdateData);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 400, error: 'Invalid listing ID format.' } });
        });
         it('should return 404 if record to update not found during update (Prisma P2025)', async () => {
            const recordNotFoundUpdateError = new Error("Record to update not found.");
            recordNotFoundUpdateError.code = 'P2025';
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockExistingListing); // Initial find is fine
            mockPrismaClient.serviceListing.update.mockRejectedValue(recordNotFoundUpdateError); // Update fails
            
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.editServiceListing(listingId, cleanerId, validUpdateData);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 404, error: `Service listing with ID ${listingId} not found for update.` } });
        });
    });

    // --- Test suspendServiceListing ---
    describe('suspendServiceListing', () => {
        const listingId = 'listing-to-suspend-789';
        const cleanerId = 'owner-cleaner-id-007';
        const mockActiveListing = { cleanerId: cleanerId, status: 'ACTIVE' };
        const mockSuspendedListing = { cleanerId: cleanerId, status: 'SUSPENDED' };

        const mockSuspendedListingRaw = {
            id: listingId,
            serviceType: 'Old Service',
            title: 'To Be Suspended',
            description: 'This service is no longer offered.',
            ratePerHr: 10,
            duration: 1,
            availability: new Date(),
            status: 'SUSPENDED',
            createdAt: new Date(),
            updatedAt: new Date(),
            cleaner: { id: cleanerId, username: 'testCleanerOwner' }
        };
        const expectedSuspendedResult = {
            ...mockSuspendedListingRaw,
            cleanerId: mockSuspendedListingRaw.cleaner.id,
            cleanerUsername: mockSuspendedListingRaw.cleaner.username,
            cleaner: undefined
        };

        it('should suspend an active service listing successfully', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockActiveListing);
            mockPrismaClient.serviceListing.update.mockResolvedValue(mockSuspendedListingRaw);

            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);

            expect(mockPrismaClient.serviceListing.findUnique).toHaveBeenCalledWith({ where: { id: listingId }, select: { cleanerId: true, status: true } });
            expect(mockPrismaClient.serviceListing.update).toHaveBeenCalledWith({
                where: { id: listingId },
                data: { status: 'SUSPENDED' },
                select: expect.any(Object)
            });
            expect(result).toEqual(expectedSuspendedResult);
        });

        it('should return 400 if listingId is invalid', async () => {
            const result = await serviceListingEntity.suspendServiceListing(null, cleanerId);
            expect(result).toEqual({ error: { status: 400, error: 'Invalid listing ID provided.' } });
        });

        it('should return 401 if cleanerId is not provided', async () => {
            const result = await serviceListingEntity.suspendServiceListing(listingId, null);
            expect(result).toEqual({ error: { status: 401, error: 'Authentication required for suspending a listing.' } });
        });

        it('should return 404 if listing not found', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(null);
            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);
            expect(result).toEqual({ error: { status: 404, error: `Service listing with ID ${listingId} not found.` } });
            expect(mockPrismaClient.serviceListing.update).not.toHaveBeenCalled();
        });

        it('should return 403 if cleaner is not the owner', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue({ cleanerId: 'another-cleaner-id', status: 'ACTIVE' });
            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);
            expect(result).toEqual({ error: { status: 403, error: 'Forbidden: You do not have permission to suspend this listing.' } });
            expect(mockPrismaClient.serviceListing.update).not.toHaveBeenCalled();
        });

        it('should return 400 if listing is already suspended', async () => {
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockSuspendedListing);
            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);
            expect(result).toEqual({ error: { status: 400, error: 'Service listing is already suspended.' } });
            expect(mockPrismaClient.serviceListing.update).not.toHaveBeenCalled();
        });
        
        it('should return 500 if Prisma update fails', async () => {
            const dbError = new Error("DB update failed for suspension");
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockActiveListing);
            mockPrismaClient.serviceListing.update.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to suspend service listing due to a server error.' } });
        });

        it('should return 400 for malformed listing ID during suspend (Prisma P2023)', async () => {
            const malformedIdError = new Error("Simulated Malformed ObjectID for suspend");
            malformedIdError.code = 'P2023';
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockActiveListing);
            mockPrismaClient.serviceListing.update.mockRejectedValue(malformedIdError);
            
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 400, error: 'Invalid listing ID format.' } });
        });
         it('should return 404 if record to update not found during suspend (Prisma P2025)', async () => {
            const recordNotFoundUpdateError = new Error("Record to update not found for suspend.");
            recordNotFoundUpdateError.code = 'P2025';
            mockPrismaClient.serviceListing.findUnique.mockResolvedValue(mockActiveListing);
            mockPrismaClient.serviceListing.update.mockRejectedValue(recordNotFoundUpdateError);
            
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.suspendServiceListing(listingId, cleanerId);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 404, error: `Service listing with ID ${listingId} not found for update.` } });
        });
    });

    // --- Test searchListings ---
    describe('searchListings', () => {
        const searcherCleanerId = 'searcher-cleaner-id-111';
        const otherCleanerId = 'other-cleaner-id-222';
        const mockListingBase = {
            id: 'listing-search-1',
            serviceType: 'General Cleaning',
            title: 'Basic Home Clean',
            description: 'A very clean home is a happy home.',
            ratePerHr: 20,
            duration: 2,
            availability: new Date('2025-06-10T10:00:00Z'),
            updatedAt: new Date(),
            cleaner: { id: otherCleanerId, username: 'otherCleanerUser' },
            status: 'ACTIVE' // Implicitly filtered by entity, but good for mock clarity
        };
        const expectedFormattedListing = {
            id: mockListingBase.id,
            serviceType: mockListingBase.serviceType,
            title: mockListingBase.title,
            description: mockListingBase.description,
            ratePerHr: mockListingBase.ratePerHr,
            duration: mockListingBase.duration,
            availability: mockListingBase.availability,
            updatedAt: mockListingBase.updatedAt,
            cleanerId: otherCleanerId,
            cleanerUsername: 'otherCleanerUser',
            status: mockListingBase.status, // Add status from mockListingBase
            cleaner: undefined, // Add cleaner: undefined as per mapping
        };

        beforeEach(() => {
            // Ensure findMany is mocked on serviceListing if not already
            if (!mockPrismaClient.serviceListing.findMany) {
                mockPrismaClient.serviceListing.findMany = jest.fn();
            }
        });

        it('should return listings matching keyword in title', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([mockListingBase]);
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { keyword: 'Home Clean' });
            expect(mockPrismaClient.serviceListing.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    status: 'ACTIVE',
                    cleanerId: { not: searcherCleanerId },
                    OR: [
                        { title: { contains: 'Home Clean', mode: 'insensitive' } },
                        { description: { contains: 'Home Clean', mode: 'insensitive' } },
                    ]
                }
            }));
            expect(result).toEqual([expectedFormattedListing]);
        });

        it('should return listings matching keyword in description', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([mockListingBase]);
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { keyword: 'happy home' });
             expect(mockPrismaClient.serviceListing.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    status: 'ACTIVE',
                    cleanerId: { not: searcherCleanerId },
                    OR: [
                        { title: { contains: 'happy home', mode: 'insensitive' } },
                        { description: { contains: 'happy home', mode: 'insensitive' } },
                    ]
                }
            }));
            expect(result).toEqual([expectedFormattedListing]);
        });

        it('should filter by serviceType (case-insensitive)', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([mockListingBase]);
            await serviceListingEntity.searchListings(searcherCleanerId, { serviceType: ' general cleaning ' });
            expect(mockPrismaClient.serviceListing.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    status: 'ACTIVE',
                    cleanerId: { not: searcherCleanerId },
                    serviceType: { equals: 'general cleaning', mode: 'insensitive' }
                }
            }));
        });

        it('should filter by minRate and maxRate', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([mockListingBase]);
            await serviceListingEntity.searchListings(searcherCleanerId, { minRate: 15, maxRate: 25 });
            expect(mockPrismaClient.serviceListing.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    status: 'ACTIVE',
                    cleanerId: { not: searcherCleanerId },
                    ratePerHr: { gte: 15, lte: 25 }
                }
            }));
        });
        
        it('should return error if maxRate is less than minRate', async () => {
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { minRate: 25, maxRate: 15 });
            expect(result).toEqual({ error: { status: 400, error: 'Maximum rate cannot be less than minimum rate.' } });
        });

        it('should filter by availabilityStartDate and availabilityEndDate', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([mockListingBase]);
            const startDate = '2025-06-01';
            const endDate = '2025-06-15';
            const expectedStartDate = new Date(startDate);
            const expectedEndDate = new Date(endDate);
            expectedEndDate.setUTCHours(23, 59, 59, 999);

            await serviceListingEntity.searchListings(searcherCleanerId, { availabilityStartDate: startDate, availabilityEndDate: endDate });
            expect(mockPrismaClient.serviceListing.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    status: 'ACTIVE',
                    cleanerId: { not: searcherCleanerId },
                    availability: { gte: expectedStartDate, lte: expectedEndDate }
                }
            }));
        });
        
        it('should return error if availabilityEndDate is before availabilityStartDate', async () => {
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { availabilityStartDate: '2025-06-15', availabilityEndDate: '2025-06-01' });
            expect(result).toEqual({ error: { status: 400, error: 'Availability end date cannot be before start date.' } });
        });
        
        it('should return error for invalid availabilityStartDate format', async () => {
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { availabilityStartDate: 'invalid-date' });
            expect(result).toEqual({ error: { status: 400, error: 'Invalid availability start date format. Use YYYY-MM-DD.' } });
        });
        
        it('should return error for invalid availabilityEndDate format', async () => {
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { availabilityEndDate: 'invalid-date' });
            expect(result).toEqual({ error: { status: 400, error: 'Invalid availability end date format. Use YYYY-MM-DD.' } });
        });

        it('should combine multiple filters correctly', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([mockListingBase]);
            const filters = {
                keyword: 'home',
                serviceType: 'General Cleaning',
                minRate: 10,
                availabilityStartDate: '2025-06-01'
            };
            const expectedStartDate = new Date(filters.availabilityStartDate);

            await serviceListingEntity.searchListings(searcherCleanerId, filters);
            expect(mockPrismaClient.serviceListing.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    status: 'ACTIVE',
                    cleanerId: { not: searcherCleanerId },
                    OR: [
                        { title: { contains: 'home', mode: 'insensitive' } },
                        { description: { contains: 'home', mode: 'insensitive' } },
                    ],
                    serviceType: { equals: 'General Cleaning', mode: 'insensitive' },
                    ratePerHr: { gte: 10 },
                    availability: { gte: expectedStartDate }
                }
            }));
        });

        it('should return "No matching listings found." if no listings match criteria', async () => {
            mockPrismaClient.serviceListing.findMany.mockResolvedValue([]);
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { keyword: 'NonExistentKeyword123' });
            expect(result).toEqual({ message: "No matching listings found." });
        });
        
        it('should return 401 if searcherCleanerId is not provided', async () => {
            const result = await serviceListingEntity.searchListings(null, {});
            expect(result).toEqual({ error: { status: 401, error: 'Authentication required to perform search.' } });
        });

        it('should return 500 if Prisma findMany fails', async () => {
            const dbError = new Error("DB search failed");
            mockPrismaClient.serviceListing.findMany.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.searchListings(searcherCleanerId, {});
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to search service listings due to a server error.' } });
        });
        
        it('should return 400 for PrismaClientValidationError', async () => {
            // Import the mocked Prisma to access its members
            const { Prisma: MockedPrisma } = require('../../src/generated/prisma');
            const validationError = new MockedPrisma.PrismaClientValidationError('Simulated validation error for search');
            mockPrismaClient.serviceListing.findMany.mockRejectedValue(validationError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceListingEntity.searchListings(searcherCleanerId, { minRate: "not-a-number" }); // Example invalid filter type
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 400, error: 'Invalid filter parameters provided for search.' } });
        });
    });
});
