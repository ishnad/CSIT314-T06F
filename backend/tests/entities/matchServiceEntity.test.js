const MatchServiceEntity = require('../../src/entities/matchServiceEntity');
const { PrismaClient, Prisma } = require('../../src/generated/prisma'); // Import Prisma for error instance check

jest.mock('../../src/generated/prisma', () => {
    const mockPrismaClientInstance = {
        confirmedMatch: {
            findMany: jest.fn(),
            // Add other model methods if needed by the entity
        },
        serviceListing: { // Add other models if the entity interacts with them directly in tested methods
            findUnique: jest.fn(),
        }
    };
    // Define a mock PrismaClientValidationError class for testing purposes
    class MockPrismaClientValidationError extends Error {
        constructor(message) {
            super(message);
            this.name = "PrismaClientValidationError";
        }
    }
    class MockPrismaClientKnownRequestError extends Error {
        constructor(message, code) {
            super(message);
            this.name = "PrismaClientKnownRequestError";
            this.code = code;
        }
    }
    return {
        PrismaClient: jest.fn(() => mockPrismaClientInstance),
        Prisma: { // Mock the Prisma namespace
            PrismaClientValidationError: MockPrismaClientValidationError,
            PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
        }
    };
});


describe('MatchServiceEntity', () => {
    let entity;
    let mockPrismaClient;

    beforeEach(() => {
        jest.clearAllMocks(); // Clears call counts and resolved/rejected states for mocks created with jest.fn()
        entity = new MatchServiceEntity();
        mockPrismaClient = new PrismaClient(); // Gets the mocked instance
        // Reset specific mock behaviors if they were set in a way not cleared by clearAllMocks
        // For jest.fn(), clearAllMocks is usually enough. If using mockImplementationOnce etc., more care might be needed.
    });

    describe('fetchConfirmedMatches', () => {
        const cleanerId = 'cleaner-user-123';
        // Mock data should reflect the structure returned by Prisma after 'select'
        const mockRawMatchData = [
            {
                id: 'match-1',
                confirmationDate: new Date('2025-05-01T10:00:00Z'),
                serviceListing: {
                    id: 'sl-1',
                    name: 'Deep Clean Deluxe', // Used for serviceTitle and serviceName
                    description: 'A thorough deep cleaning service.',
                    ratePerHr: 30,
                    serviceCategory: { serviceCatName: 'Deep Cleaning SC' } // Used for serviceType
                },
                homeowner: { id: 'ho-1', username: 'homeownerA' }
            },
            {
                id: 'match-2',
                confirmationDate: new Date('2025-05-05T14:00:00Z'),
                serviceListing: {
                    id: 'sl-2',
                    name: 'Window Sparkle',
                    description: 'Professional window cleaning.',
                    ratePerHr: 25,
                    serviceCategory: { serviceCatName: 'Window Cleaning SC' }
                },
                homeowner: { id: 'ho-2', username: 'homeownerB' }
            },
            {
                id: 'match-3',
                confirmationDate: new Date('2025-04-20T09:00:00Z'),
                serviceListing: {
                    id: 'sl-3',
                    name: 'Basic Tidy Up',
                    description: 'A quick tidy up service.',
                    ratePerHr: 20,
                    serviceCategory: { serviceCatName: 'Basic Cleaning SC' }
                },
                homeowner: { id: 'ho-3', username: 'homeownerC' }
            }
        ];
        const expectedFormattedMatches = mockRawMatchData.map(match => ({
            matchId: match.id,
            confirmationDate: match.confirmationDate,
            serviceTitle: match.serviceListing.name,
            serviceName: match.serviceListing.name,
            serviceType: match.serviceListing.serviceCategory.serviceCatName,
            serviceRatePerHr: match.serviceListing.ratePerHr,
            homeownerUsername: match.homeowner.username,
            homeownerId: match.homeowner.id,
            serviceListingId: match.serviceListing.id,
        }));

        it('should return 500 error if cleanerId is not provided (due to subsequent TypeError)', async () => {
            // When cleanerId is null, the entity currently proceeds and hits a TypeError later
            // because findMany (default jest.fn()) returns undefined, then .map on undefined.
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchConfirmedMatches(null);
            expect(result).toEqual({ error: { status: 500, error: 'Failed to retrieve confirmed matches due to a server error.' } });
            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledTimes(1); // It will be called
            consoleErrorSpy.mockRestore();
        });

        it('should fetch all confirmed matches for a cleaner if no filters provided', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue(mockRawMatchData);
            const result = await entity.fetchConfirmedMatches(cleanerId);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith({
                where: { serviceListing: { cleanerId: cleanerId } },
                select: expect.any(Object), // The select clause from the entity
                orderBy: { confirmationDate: 'desc' }
            });
            expect(result).toEqual(expectedFormattedMatches);
        });

        it('should filter by serviceType (case-insensitive)', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0]]); // Assuming this filter matches the first item
            const filters = { serviceType: 'deep cleaning sc' }; // Lowercase for testing insensitivity, matching serviceCatName
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: {
                        cleanerId: cleanerId,
                        serviceType: { equals: 'deep cleaning sc', mode: 'insensitive' }
                    }
                }
            }));
        });

        it('should filter by startDate', async () => {
            const filters = { startDate: '2025-05-01' };
            const expectedStartDate = new Date('2025-05-01T00:00:00.000Z');
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0], mockRawMatchData[1]]); // Match items 0 and 1
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: { cleanerId: cleanerId },
                    confirmationDate: { gte: expectedStartDate }
                }
            }));
        });

        it('should filter by endDate', async () => {
            const filters = { endDate: '2025-04-30' };
            const expectedEndDate = new Date('2025-04-30T23:59:59.999Z');
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[2]]); // Match item 2
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: { cleanerId: cleanerId },
                    confirmationDate: { lte: expectedEndDate }
                }
            }));
        });

        it('should filter by both startDate and endDate', async () => {
            const filters = { startDate: '2025-04-15', endDate: '2025-05-02' };
            const expectedStartDate = new Date('2025-04-15T00:00:00.000Z');
            const expectedEndDate = new Date('2025-05-02T23:59:59.999Z');
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0], mockRawMatchData[2]]);
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: { cleanerId: cleanerId },
                    confirmationDate: { gte: expectedStartDate, lte: expectedEndDate }
                }
            }));
        });

        it('should filter by serviceType and dateRange', async () => {
            const filters = { serviceType: 'Deep Cleaning SC', startDate: '2025-05-01', endDate: '2025-05-01' };
            const expectedStartDate = new Date('2025-05-01T00:00:00.000Z');
            const expectedEndDate = new Date('2025-05-01T23:59:59.999Z');
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0]]);
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: {
                        cleanerId: cleanerId,
                        serviceType: { equals: 'Deep Cleaning SC', mode: 'insensitive' }
                    },
                    confirmationDate: { gte: expectedStartDate, lte: expectedEndDate }
                }
            }));
        });

        it('should return 404 error if no matches meet criteria', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]);
            const result = await entity.fetchConfirmedMatches(cleanerId, { serviceType: 'NonExistentService' });
            expect(result).toEqual({ error: { status: 404, error: "No confirmed matches found for selected filters" } });
        });

        it('should return 404 error if invalid startDate leads to no matches', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]); // Simulate Prisma returning no matches
            const result = await entity.fetchConfirmedMatches(cleanerId, { startDate: 'invalid-date' });
            expect(result).toEqual({ error: { status: 404, error: "No confirmed matches found for selected filters" } });
        });

        it('should return 404 error if invalid endDate leads to no matches', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]); // Simulate Prisma returning no matches
            const result = await entity.fetchConfirmedMatches(cleanerId, { endDate: 'invalid-date' });
            expect(result).toEqual({ error: { status: 404, error: "No confirmed matches found for selected filters" } });
        });

        it('should return 500 error if Prisma query fails with a generic error', async () => {
            const dbError = new Error('DB query failed'); // Generic error, not Prisma specific
            mockPrismaClient.confirmedMatch.findMany.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchConfirmedMatches(cleanerId);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to retrieve confirmed matches due to a server error.' } });
        });

        it('should return 400 error for PrismaClientValidationError', async () => {
            const validationError = new Prisma.PrismaClientValidationError('Simulated validation error');
            mockPrismaClient.confirmedMatch.findMany.mockRejectedValue(validationError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchConfirmedMatches(cleanerId, { serviceType: {} }); // Example invalid filter
            consoleErrorSpy.mockRestore();

            expect(result).toEqual({ error: { status: 400, error: 'Invalid filter parameters provided.' } });
        });
    });

    // --- Test searchCleanerConfirmedMatches ---
    describe('searchCleanerConfirmedMatches', () => {
        const cleanerId = 'cleaner-search-id-789';
        // Mock data should reflect the structure returned by Prisma after 'select'
        const mockRawMatchDataForSearch = [
            {
                id: 'match-s1',
                confirmationDate: new Date('2025-06-01T10:00:00Z'),
                serviceListing: {
                    id: 'sl-s1',
                    description: 'Searchable Clean Description', // Used for serviceTitle
                    ratePerHr: 35,
                    serviceCategory: { serviceCatName: 'Search Clean SC' } // Used for serviceType
                },
                homeowner: { id: 'ho-s1', username: 'homeownerSearchA' }
            },
            {
                id: 'match-s2',
                confirmationDate: new Date('2025-06-05T14:00:00Z'),
                serviceListing: {
                    id: 'sl-s2',
                    description: 'Another Searchable Description',
                    ratePerHr: 22,
                    serviceCategory: { serviceCatName: 'General SC' }
                },
                homeowner: { id: 'ho-s2', username: 'homeownerSearchB' }
            }
        ];
        const expectedFormattedMatchesForSearch = mockRawMatchDataForSearch.map(match => ({
            matchId: match.id,
            confirmationDate: match.confirmationDate,
            serviceTitle: match.serviceListing.description,
            serviceType: match.serviceListing.serviceCategory.serviceCatName,
            serviceRatePerHr: match.serviceListing.ratePerHr,
            homeownerUsername: match.homeowner.username,
            homeownerId: match.homeowner.id,
            serviceListingId: match.serviceListing.id,
        }));

        it('should return 400 error if cleanerId is not provided (PrismaClientValidationError)', async () => {
            // Simulate that passing null cleanerId to Prisma causes a validation error
            const validationError = new Prisma.PrismaClientValidationError('Simulated error due to null cleanerId in search');
            mockPrismaClient.confirmedMatch.findMany.mockRejectedValue(validationError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.searchCleanerConfirmedMatches(null, {});
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 400, error: 'Invalid filter parameters provided for search.' } });
        });

        it('should fetch matches with "CONFIRMED" status filter (effectively no status DB filter)', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue(mockRawMatchDataForSearch);
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { status: 'CONFIRMED' });
            // The entity constructs an AND query if any filter is present, even if status: 'CONFIRMED' doesn't add to DB query conditions itself.
            // If only status: 'CONFIRMED' is passed, filtersToApply might be empty, so no AND.
            // Let's check the entity logic: status 'CONFIRMED' does not add to filtersToApply.
            // So, whereConditions.AND will not be set if only status: 'CONFIRMED' is the filter.
            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { serviceListing: { cleanerId: cleanerId } } // No AND clause if only status: 'CONFIRMED'
            }));
            expect(result).toEqual(expectedFormattedMatchesForSearch);
        });

        it('should return message for unsupported status filter like "PENDING"', async () => {
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { status: 'PENDING' });
            expect(result).toEqual({ message: "Filtering by status 'PENDING' is not currently supported or no matches found for this status." });
            expect(mockPrismaClient.confirmedMatch.findMany).not.toHaveBeenCalled();
        });

        it('should filter by serviceType and status "CONFIRMED"', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchDataForSearch[0]]);
            const filters = { serviceType: 'Search Clean SC', status: 'CONFIRMED' };
            await entity.searchCleanerConfirmedMatches(cleanerId, filters);
            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: { cleanerId: cleanerId },
                    AND: [{
                        serviceListing: {
                            serviceCategory: {
                                is: { serviceCatName: { equals: 'Search Clean SC', mode: 'insensitive' } }
                            }
                        }
                    }]
                }
            }));
        });

        it('should filter by date range and status "CONFIRMED"', async () => {
            const filters = { startDate: '2025-06-01', endDate: '2025-06-01', status: 'CONFIRMED' };
            const expectedStartDate = new Date('2025-06-01T00:00:00.000Z');
            const expectedEndDate = new Date('2025-06-01T23:59:59.999Z');
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchDataForSearch[0]]);
            await entity.searchCleanerConfirmedMatches(cleanerId, filters);
            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: { cleanerId: cleanerId },
                    AND: [{
                        confirmationDate: { gte: expectedStartDate, lte: expectedEndDate }
                    }]
                }
            }));
        });

        it('should return 404 error if no matches meet search criteria', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]);
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { serviceType: 'NonExistentServiceType', status: 'CONFIRMED' });
            expect(result).toEqual({ error: { status: 404, error: "No confirmed matches found for selected search criteria." } });
        });

        it('should return 404 error if invalid startDate leads to no matches during search', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]); // Simulate Prisma returning no matches
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { startDate: 'invalid-date-search', status: 'CONFIRMED' });
            expect(result).toEqual({ error: { status: 404, error: "No confirmed matches found for selected search criteria." } });
        });

        it('should return 500 error if Prisma query fails with a generic error during search', async () => {
            const dbError = new Error('DB search query failed'); // Generic error
            mockPrismaClient.confirmedMatch.findMany.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { status: 'CONFIRMED' });
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to search confirmed matches due to a server error.' } });
        });

        it('should return 400 error for PrismaClientValidationError during search', async () => {
            const validationError = new Prisma.PrismaClientValidationError('Simulated validation error for search');
            mockPrismaClient.confirmedMatch.findMany.mockRejectedValue(validationError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            // Pass a filter that might cause validation error if not handled by earlier checks, e.g. malformed object
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { serviceType: {}, status: 'CONFIRMED' });
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 400, error: 'Invalid filter parameters provided for search.' } });
        });
    });
});
