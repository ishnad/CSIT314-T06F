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
     * @returns {Promise<Array<object>|object>} Array of match objects or an error/message object.
     */
    async fetchConfirmedMatches(cleanerId, filters = {}) {
        if (!cleanerId) {
            return { error: { status: 400, error: 'Cleaner ID is required.' } };
        }

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
            if (!isNaN(parsedStartDate)) {
                dateFilter.gte = parsedStartDate;
            } else {
                return { error: { status: 400, error: 'Invalid start date format. Use YYYY-MM-DD.' } };
            }
        }
        if (endDate) {
            const parsedEndDate = new Date(endDate);
            if (!isNaN(parsedEndDate)) {
                // To include the whole end day, set time to end of day using UTC hours
                parsedEndDate.setUTCHours(23, 59, 59, 999);
                dateFilter.lte = parsedEndDate;
            } else {
                return { error: { status: 400, error: 'Invalid end date format. Use YYYY-MM-DD.' } };
            }
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
                            duration: true,
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
                return { message: "No confirmed matches found for selected filters" };
            }

            return matches.map(match => ({
                matchId: match.id,
                confirmationDate: match.confirmationDate,
                serviceTitle: match.serviceListing.title,
                serviceType: match.serviceListing.serviceType,
                serviceRatePerHr: match.serviceListing.ratePerHr,
                serviceDuration: match.serviceListing.duration,
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
}

module.exports = MatchServiceEntity;
