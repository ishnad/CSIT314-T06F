const MatchServiceEntity = require('../../src/entities/matchServiceEntity');
const { PrismaClient, Prisma } = require('../../src/generated/prisma'); // Import Prisma for error instance check

jest.mock('../../src/generated/prisma', () => {
    const mockPrismaClientInstance = {
        confirmedMatch: {
            findMany: jest.fn(),
        },
    };
    // Define a mock PrismaClientValidationError class for testing purposes
    class MockPrismaClientValidationError extends Error {
        constructor(message) {
            super(message);
            this.name = "PrismaClientValidationError";
            // Add any other properties that PrismaClientValidationError might have if needed for tests
        }
    }
    return {
        PrismaClient: jest.fn(() => mockPrismaClientInstance),
        Prisma: { // Mock the Prisma namespace
            PrismaClientValidationError: MockPrismaClientValidationError, // Use the mock class
            // Add other Prisma error classes if needed by the entity, e.g.:
            // PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error { ... },
        }
    };
});


describe('MatchServiceEntity', () => {
    let entity;
    let mockPrismaClient;

    beforeEach(() => {
        jest.clearAllMocks();
        entity = new MatchServiceEntity();
        mockPrismaClient = new PrismaClient();
    });

    describe('fetchConfirmedMatches', () => {
        const cleanerId = 'cleaner-user-123';
        const mockRawMatchData = [
            {
                id: 'match-1',
                confirmationDate: new Date('2025-05-01T10:00:00Z'),
                serviceListing: { id: 'sl-1', title: 'Deep Clean Deluxe', serviceType: 'Deep Clean', ratePerHr: 30 /* duration removed */ },
                homeowner: { id: 'ho-1', username: 'homeownerA' }
            },
            {
                id: 'match-2',
                confirmationDate: new Date('2025-05-05T14:00:00Z'),
                serviceListing: { id: 'sl-2', title: 'Window Sparkle', serviceType: 'Window Cleaning', ratePerHr: 25 /* duration removed */ },
                homeowner: { id: 'ho-2', username: 'homeownerB' }
            },
            {
                id: 'match-3',
                confirmationDate: new Date('2025-04-20T09:00:00Z'),
                serviceListing: { id: 'sl-3', title: 'Basic Tidy Up', serviceType: 'Basic Clean', ratePerHr: 20 /* duration removed */ },
                homeowner: { id: 'ho-3', username: 'homeownerC' }
            }
        ];
        const expectedFormattedMatches = mockRawMatchData.map(match => ({
            matchId: match.id,
            confirmationDate: match.confirmationDate,
            serviceTitle: match.serviceListing.title,
            serviceType: match.serviceListing.serviceType,
            serviceRatePerHr: match.serviceListing.ratePerHr,
            // serviceDuration: match.serviceListing.duration, // Removed serviceDuration
            homeownerUsername: match.homeowner.username,
            homeownerId: match.homeowner.id,
            serviceListingId: match.serviceListing.id,
        }));

        it('should return error if cleanerId is not provided', async () => {
            const result = await entity.fetchConfirmedMatches(null);
            expect(result).toEqual({ error: { status: 400, error: 'Cleaner ID is required.' } });
            expect(mockPrismaClient.confirmedMatch.findMany).not.toHaveBeenCalled();
        });

        it('should fetch all confirmed matches for a cleaner if no filters provided', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue(mockRawMatchData);
            const result = await entity.fetchConfirmedMatches(cleanerId);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith({
                where: { serviceListing: { cleanerId: cleanerId } },
                select: expect.any(Object),
                orderBy: { confirmationDate: 'desc' }
            });
            expect(result).toEqual(expectedFormattedMatches);
        });

        it('should filter by serviceType (case-insensitive)', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0]]);
            const filters = { serviceType: 'deep clean' }; // Lowercase for testing insensitivity
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: {
                        cleanerId: cleanerId,
                        serviceType: { equals: 'deep clean', mode: 'insensitive' }
                    }
                }
            }));
        });

        it('should filter by startDate', async () => {
            const filters = { startDate: '2025-05-01' };
            const expectedStartDate = new Date('2025-05-01T00:00:00.000Z'); // Start of the day
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0], mockRawMatchData[1]]);
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
            const expectedEndDate = new Date('2025-04-30T23:59:59.999Z'); // End of the day
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[2]]);
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
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0], mockRawMatchData[2]]); // match-1 and match-3
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: { cleanerId: cleanerId },
                    confirmationDate: { gte: expectedStartDate, lte: expectedEndDate }
                }
            }));
        });

        it('should filter by serviceType and dateRange', async () => {
            const filters = { serviceType: 'Deep Clean', startDate: '2025-05-01', endDate: '2025-05-01' };
            const expectedStartDate = new Date('2025-05-01T00:00:00.000Z');
            const expectedEndDate = new Date('2025-05-01T23:59:59.999Z');
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([mockRawMatchData[0]]);
            await entity.fetchConfirmedMatches(cleanerId, filters);

            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: {
                        cleanerId: cleanerId,
                        serviceType: { equals: 'Deep Clean', mode: 'insensitive' }
                    },
                    confirmationDate: { gte: expectedStartDate, lte: expectedEndDate }
                }
            }));
        });

        it('should return "No confirmed matches found" message if no matches meet criteria', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]);
            const result = await entity.fetchConfirmedMatches(cleanerId, { serviceType: 'NonExistentService' });
            expect(result).toEqual({ message: "No confirmed matches found for selected filters" });
        });

        it('should return 400 error for invalid startDate format', async () => {
            const result = await entity.fetchConfirmedMatches(cleanerId, { startDate: 'invalid-date' });
            expect(result).toEqual({ error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } });
        });

        it('should return 400 error for invalid endDate format', async () => {
            const result = await entity.fetchConfirmedMatches(cleanerId, { endDate: 'invalid-date' });
            expect(result).toEqual({ error: { status: 400, error: 'Invalid end date format. Use YYYY-MM-DD.' } });
        });

        it('should return 500 error if Prisma query fails', async () => {
            const dbError = new Error('DB query failed');
            mockPrismaClient.confirmedMatch.findMany.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await entity.fetchConfirmedMatches(cleanerId);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to retrieve confirmed matches due to a server error.' } });
        });
        
        it('should return 400 error for PrismaClientValidationError', async () => {
            // Simulate a PrismaClientValidationError (e.g., bad filter structure not caught by prior checks)
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
        const mockRawMatchDataForSearch = [
            {
                id: 'match-s1',
                confirmationDate: new Date('2025-06-01T10:00:00Z'),
                serviceListing: { id: 'sl-s1', title: 'Searchable Clean', serviceType: 'Search Clean', ratePerHr: 35 },
                homeowner: { id: 'ho-s1', username: 'homeownerSearchA' }
            },
            {
                id: 'match-s2',
                confirmationDate: new Date('2025-06-05T14:00:00Z'),
                serviceListing: { id: 'sl-s2', title: 'Another Searchable', serviceType: 'General', ratePerHr: 22 },
                homeowner: { id: 'ho-s2', username: 'homeownerSearchB' }
            }
        ];
        const expectedFormattedMatchesForSearch = mockRawMatchDataForSearch.map(match => ({
            matchId: match.id,
            confirmationDate: match.confirmationDate,
            serviceTitle: match.serviceListing.title,
            serviceType: match.serviceListing.serviceType,
            serviceRatePerHr: match.serviceListing.ratePerHr,
            homeownerUsername: match.homeowner.username,
            homeownerId: match.homeowner.id,
            serviceListingId: match.serviceListing.id,
        }));

        it('should return error if cleanerId is not provided', async () => {
            const result = await entity.searchCleanerConfirmedMatches(null, {});
            expect(result).toEqual({ error: { status: 400, error: 'Cleaner ID is required for search.' } });
        });

        it('should fetch matches with "CONFIRMED" status filter (effectively no status DB filter)', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue(mockRawMatchDataForSearch);
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { status: 'CONFIRMED' });
            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { serviceListing: { cleanerId: cleanerId } } // No specific ConfirmedMatch.status clause
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
            const filters = { serviceType: 'Search Clean', status: 'CONFIRMED' };
            await entity.searchCleanerConfirmedMatches(cleanerId, filters);
            expect(mockPrismaClient.confirmedMatch.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    serviceListing: {
                        cleanerId: cleanerId,
                        serviceType: { equals: 'Search Clean', mode: 'insensitive' }
                    }
                    // No ConfirmedMatch.status clause
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
                    confirmationDate: { gte: expectedStartDate, lte: expectedEndDate }
                    // No ConfirmedMatch.status clause
                }
            }));
        });

        it('should return "No confirmed matches found" message if no matches meet search criteria', async () => {
            mockPrismaClient.confirmedMatch.findMany.mockResolvedValue([]);
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { serviceType: 'NonExistentServiceType', status: 'CONFIRMED' });
            expect(result).toEqual({ message: "No confirmed matches found for selected search criteria." });
        });
        
        it('should return 400 error for invalid startDate format during search', async () => {
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { startDate: 'invalid-date-search', status: 'CONFIRMED' });
            expect(result).toEqual({ error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } });
        });

        it('should return 500 error if Prisma query fails during search', async () => {
            const dbError = new Error('DB search query failed');
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
            const result = await entity.searchCleanerConfirmedMatches(cleanerId, { serviceType: {}, status: 'CONFIRMED' });
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 400, error: 'Invalid filter parameters provided for search.' } });
        });
    });
});