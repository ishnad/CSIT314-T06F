const { PrismaClient, Prisma } = require('../generated/prisma');

class MatchServiceEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Fetches confirmed matches for a cleaner, with optional filters.
     * @param {string} cleanerId - The ID of the cleaner.
     * @param {object} filters - Optional filters.
     * @param {string} [filters.serviceType] - Filter by service type.
     * @param {string} [filters.startDate] - ISO 8601 date string for start of date range.
     * @param {string} [filters.endDate] - ISO 8601 date string for end of date range.
     * @returns {Promise<Array<{matchId: string, confirmationDate: Date, serviceTitle: string, serviceType: string, serviceRatePerHr: number, homeownerUsername: string, homeownerId: string, serviceListingId: string}>|{error: {status: number, error: string}}>} 
     *          Array of confirmed match objects, or an error object.
     */
    async fetchConfirmedMatches(cleanerId, filters = {}) {
        const { serviceType, startDate, endDate } = filters;
        const whereConditions = {
            serviceListing: {
                cleanerId: cleanerId,
            },
        };

        if (serviceType && typeof serviceType === 'string' && serviceType.trim() !== '') {
            whereConditions.serviceListing.serviceType = {
                equals: serviceType.trim(),
                mode: 'insensitive', // Case-insensitive match for service type
            };
        }

        const dateFilter = {};
        if (startDate) {
            const parsedStartDate = new Date(startDate);
            dateFilter.gte = parsedStartDate;
        }
        if (endDate) {
            const parsedEndDate = new Date(endDate);
            // To include the whole end day, set time to end of day using UTC hours
            parsedEndDate.setUTCHours(23, 59, 59, 999);
            dateFilter.lte = parsedEndDate;
        }

        if (Object.keys(dateFilter).length > 0) {
            whereConditions.confirmationDate = dateFilter;
        }

        try {
            const matches = await this.prisma.confirmedMatch.findMany({
                where: whereConditions,
                select: {
                    id: true,
                    confirmationDate: true,
                    serviceListing: {
                        select: {
                            id: true,
                            title: true,
                            serviceType: true,
                            ratePerHr: true,
                            // duration: true,
                        }
                    },
                    homeowner: {
                        select: {
                            id: true,
                            username: true, // Homeowner's username
                            // email: true, // Consider if email is needed/appropriate to expose here
                        }
                    }
                },
                orderBy: {
                    confirmationDate: 'desc', // Show most recent matches first
                }
            });

            if (matches.length === 0) {
                return { error: { status: 404, error: "No confirmed matches found for selected filters" } };
            }

            return matches.map(match => ({
                matchId: match.id,
                confirmationDate: match.confirmationDate,
                serviceTitle: match.serviceListing.title,
                serviceType: match.serviceListing.serviceType,
                serviceRatePerHr: match.serviceListing.ratePerHr,
                // serviceDuration: match.serviceListing.duration,
                homeownerUsername: match.homeowner.username,
                homeownerId: match.homeowner.id,
                serviceListingId: match.serviceListing.id,
            }));

        } catch (error) {
            console.error(`Error fetching confirmed matches for cleaner ${cleanerId}:`, error);
            if (error instanceof Prisma.PrismaClientValidationError) {
                 return { error: { status: 400, error: 'Invalid filter parameters provided.' } };
            }
            return { error: { status: 500, error: 'Failed to retrieve confirmed matches due to a server error.' } };
        }
    }

    /**
     * Searches for confirmed matches for a specific cleaner, with optional filters including status.
     * @param {string} cleanerId - The ID of the cleaner.
     * @param {object} filters - Optional filters.
     * @param {string} [filters.serviceType] - Filter by service type.
     * @param {string} [filters.startDate] - ISO 8601 date string for start of date range.
     * @param {string} [filters.endDate] - ISO 8601 date string for end of date range.
     * @param {string} [filters.status] - Filter by match status.
     * @returns {Promise<Array<{matchId: string, confirmationDate: Date, serviceTitle: string, serviceType: string, serviceRatePerHr: number, homeownerUsername: string, homeownerId: string, serviceListingId: string}>|{message: string}|{error: {status: number, error: string}}>} 
     *          Array of confirmed match objects, a message object, or an error object.
     */
    async searchCleanerConfirmedMatches(cleanerId, filters = {}) {
        const { serviceType, startDate, endDate, status } = filters;
        const whereConditions = {
            serviceListing: {
                cleanerId: cleanerId,
            },
        };

        if (serviceType && typeof serviceType === 'string' && serviceType.trim() !== '') {
            whereConditions.serviceListing.serviceType = {
                equals: serviceType.trim(),
                mode: 'insensitive',
            };
        }

        if (status && typeof status === 'string' && status.trim() !== '') {
            const upperStatus = status.trim().toUpperCase();
            if (upperStatus !== 'CONFIRMED') {
                // Since ConfirmedMatch model has no active status field,
                // only 'CONFIRMED' is implicitly valid by querying the table.
                // Filtering by other statuses would require schema changes.
                return { message: `Filtering by status '${status.trim()}' is not currently supported or no matches found for this status.` };
            }
            // If status is 'CONFIRMED', it doesn't add an explicit DB filter condition for ConfirmedMatch.status,
            // as all records in this table are considered confirmed.
        }

        const dateFilter = {};
        if (startDate) {
            const parsedStartDate = new Date(startDate);
            dateFilter.gte = parsedStartDate;
        }
        if (endDate) {
            const parsedEndDate = new Date(endDate);
            parsedEndDate.setUTCHours(23, 59, 59, 999);
            dateFilter.lte = parsedEndDate;
        }

        if (Object.keys(dateFilter).length > 0) {
            whereConditions.confirmationDate = dateFilter;
        }

        try {
            const matches = await this.prisma.confirmedMatch.findMany({
                where: whereConditions,
                select: {
                    id: true,
                    confirmationDate: true,
                    serviceListing: {
                        select: {
                            id: true,
                            title: true,
                            serviceType: true,
                            ratePerHr: true,
                            // duration
                        }
                    },
                    homeowner: {
                        select: {
                            id: true,
                            username: true,
                        }
                    }
                },
                orderBy: {
                    confirmationDate: 'desc',
                }
            });

            if (matches.length === 0) {
                return { error: { status: 404, error: "No confirmed matches found for selected search criteria." } };
            }

            return matches.map(match => ({
                matchId: match.id,
                confirmationDate: match.confirmationDate,
                serviceTitle: match.serviceListing.title,
                serviceType: match.serviceListing.serviceType,
                serviceRatePerHr: match.serviceListing.ratePerHr,
                homeownerUsername: match.homeowner.username,
                homeownerId: match.homeowner.id,
                serviceListingId: match.serviceListing.id,
            }));

        } catch (error) {
            console.error(`Error searching confirmed matches for cleaner ${cleanerId}:`, error);
            if (error instanceof Prisma.PrismaClientValidationError) {
                 return { error: { status: 400, error: 'Invalid filter parameters provided for search.' } };
            }
            return { error: { status: 500, error: 'Failed to search confirmed matches due to a server error.' } };
        }
    }
}

module.exports = MatchServiceEntity;
