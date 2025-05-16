const { PrismaClient, Prisma } = require('../generated/prisma');

class MatchServiceEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Fetches all confirmed matches for a cleaner
     * @param {string} cleanerId - The ID of the cleaner
     * @returns {Promise<Array<{matchId: string, confirmationDate: Date, serviceTitle: string, serviceType: string, serviceRatePerHr: number, homeownerUsername: string}>|{error: {status: number, error: string}}>}
     */
    async fetchAllConfirmedMatches(cleanerId) {
        try {
            const matches = await this.prisma.confirmedMatch.findMany({
                where: {
                    serviceListing: {
                        cleanerId: cleanerId
                    }
                },
                include: {
                    serviceListing: {
                        include: {
                            serviceCategory: true
                        }
                    },
                    homeowner: true
                },
                orderBy: {
                    confirmationDate: 'desc'
                }
            });

            return matches.map(match => ({
                matchId: match.id,
                confirmationDate: match.confirmationDate,
                serviceTitle: match.serviceListing.description,
                serviceType: match.serviceListing.serviceCategory?.serviceCatName || 'Cleaning Service',
                serviceRatePerHr: match.serviceListing.ratePerHr,
                homeownerUsername: match.homeowner.username
            }));

        } catch (error) {
            console.error('Error fetching confirmed matches:', error);
            return { error: { status: 500, error: "Failed to fetch confirmed matches" } };
        }
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
            // Set to start of day to include all matches on this date
            parsedStartDate.setUTCHours(0, 0, 0, 0);
            dateFilter.gte = parsedStartDate;
        }
        if (endDate) {
            const parsedEndDate = new Date(endDate);
            // Set to end of day to include all matches on this date
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
                            description: true,
                            ratePerHr: true,
                            serviceCategory: {
                                select: {
                                    serviceCatName: true
                                }
                            },
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
                serviceTitle: match.serviceListing.description,
                serviceType: match.serviceListing.serviceCategory?.serviceCatName || 'Cleaning Service',
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

        // Build optional filters - each is applied only if provided
        const filtersToApply = [];

        if (serviceType && typeof serviceType === 'string' && serviceType.trim() !== '') {
            filtersToApply.push({
                serviceListing: {
                    serviceCategory: {
                        is: {
                            serviceCatName: {
                                equals: serviceType.trim(),
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            });
        }

        if (status && typeof status === 'string' && status.trim() !== '') {
            const upperStatus = status.trim().toUpperCase();
            if (upperStatus !== 'CONFIRMED') {
                // Since ConfirmedMatch model has no active status field,
                // only 'CONFIRMED' is implicitly valid by querying the table.
                // Filtering by other statuses would require schema changes.
                return { message: `Filtering by status '${status.trim()}' is not currently supported or no matches found for this status.` };
            }
        }

        if (startDate || endDate) {
            const dateFilter = {};
            if (startDate) {
                const parsedStartDate = new Date(startDate);
                parsedStartDate.setUTCHours(0, 0, 0, 0); // Include whole start day
                dateFilter.gte = parsedStartDate;
            }
            if (endDate) {
                const parsedEndDate = new Date(endDate);
                parsedEndDate.setUTCHours(23, 59, 59, 999); // Include whole end day
                dateFilter.lte = parsedEndDate;
            }
            // Only add date filter if we have at least one condition
            if (Object.keys(dateFilter).length > 0) {
                filtersToApply.push({
                    confirmationDate: dateFilter
                });
            }
        }

        // Combine all filters with AND if any exist
        if (filtersToApply.length > 0) {
            whereConditions.AND = filtersToApply;
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
                            description: true,
                            ratePerHr: true,
                            serviceCategory: {
                                select: {
                                    serviceCatName: true
                                }
                            }
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
                serviceTitle: match.serviceListing.description,
                serviceType: match.serviceListing.serviceCategory?.serviceCatName || 'Cleaning Service',
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
    /**
     * Creates a new confirmed match between a homeowner and cleaner's service listing
     * @param {string} homeownerId - The ID of the homeowner
     * @param {string} serviceListingId - The ID of the service listing being booked
     * @returns {Promise<{matchId: string, confirmationDate: Date}|{error: {status: number, error: string}}>}
     */
    async createMatch(homeownerId, serviceListingId) {
        try {
            // First verify the service listing exists and is active
            const serviceListing = await this.prisma.serviceListing.findUnique({
                where: { id: serviceListingId, status: 'ACTIVE' }
            });

            if (!serviceListing) {
                return { error: { status: 404, error: "Service listing not found or inactive" } };
            }

            // Create the confirmed match
            const newMatch = await this.prisma.confirmedMatch.create({
                data: {
                    serviceListingId,
                    homeownerId,
                    // confirmationDate defaults to now()
                },
                select: {
                    id: true,
                    confirmationDate: true,
                    serviceListing: {
                        select: {
                            id: true,
                            ratePerHr: true,
                            serviceCategory: {
                                select: {
                                    serviceCatName: true
                                }
                            }
                        }
                    },
                    homeowner: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            });

            return {
                matchId: newMatch.id,
                confirmationDate: newMatch.confirmationDate,
                serviceType: newMatch.serviceListing.serviceCategory?.serviceCatName || 'Cleaning Service',
                ratePerHr: newMatch.serviceListing.ratePerHr,
                homeownerUsername: newMatch.homeowner.username
            };

        } catch (error) {
            console.error('Error creating match:', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') { // Unique constraint violation
                    return { error: { status: 409, error: "This booking already exists" } };
                }
            }
            return { error: { status: 500, error: "Failed to create booking" } };
        }
    }
    /**
     * Fetches past matches for a homeowner
     * @param {string} homeownerId - The ID of the homeowner
     * @returns {Promise<Array<{matchId: string, confirmationDate: Date, cleanerUsername: string, serviceType: string, ratePerHr: number}>|{error: {status: number, error: string}}>}
     */
    async fetchPastMatchesHomeowner(homeownerId) {
        try {
            const matches = await this.prisma.confirmedMatch.findMany({
                where: {
                    homeownerId: homeownerId,
                    confirmationDate: {
                        lt: new Date() // Only past matches
                    }
                },
                select: {
                    id: true,
                    confirmationDate: true,
                    serviceListing: {
                        select: {
                            ratePerHr: true,
                            serviceCategory: {
                                select: {
                                    serviceCatName: true
                                }
                            },
                            cleaner: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    confirmationDate: 'desc' // Newest first
                }
            });

            if (!matches.length) {
                return { error: { status: 404, error: "No past matches found" } };
            }

            return matches.map(match => ({
                matchId: match.id,
                confirmationDate: match.confirmationDate,
                cleanerUsername: match.serviceListing.cleaner.username,
                serviceType: match.serviceListing.serviceCategory?.serviceCatName || 'Cleaning Service',
                ratePerHr: match.serviceListing.ratePerHr
            }));

        } catch (error) {
            console.error('Error fetching past matches:', error);
            return { error: { status: 500, error: "Failed to fetch past matches" } };
        }
    }
}

module.exports = MatchServiceEntity;
