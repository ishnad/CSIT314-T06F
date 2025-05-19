const { UserStatus } = require('../generated/prisma');
const prisma = require('../lib/prismaClient');

class ShortlistEntity {
    constructor() {
        this.prisma = prisma;
    }

    /**
     * Adds a cleaner to a homeowner's shortlist.
     * Checks if the cleaner exists and is indeed a cleaner.
     * Checks if the cleaner is already shortlisted by this homeowner.
     *
     * @param {string} homeownerId - The ID of the homeowner.
     * @param {string} cleanerId - The ID of the cleaner (UserAccount ID) to shortlist.
     * @returns {Promise<true|{error: {status: number, message: string}}>} True if successful, or an error object.
     */
    async shortlistCleaner(homeownerId, cleanerId) {
        try {
            // Check if cleaner exists and is actually a cleaner
            const cleanerAccount = await this.prisma.userAccount.findUnique({
                where: { id: cleanerId },
                include: { 
                    userProfile: { select: { name: true } } 
                }
            });

            // Check for existing shortlist entry
            const existingEntry = await this.prisma.shortlist.findFirst({
                where: {
                    homeownerId: homeownerId,
                    cleanerId: cleanerId
                }
            });

            if (existingEntry) {
                return { error: { status: 409, error: `Cleaner '${cleanerAccount.username}' is already in your shortlist` } };
            }

            // Create new shortlist entry
            await this.prisma.shortlist.create({
                data: {
                    homeowner: { connect: { id: homeownerId } },
                    cleaner: { connect: { id: cleanerId } }
                }
            });

            return true;

        } catch (error) {
            console.error(`Error shortlisting cleaner ${cleanerId} for homeowner ${homeownerId}:`, error);
            return { error: { status: 500, error: 'An unexpected error occurred during shortlist.' } };
        }
    }

    /**
     * Finds cleaners in a specific homeowner's shortlist that match a keyword.
     * The keyword searches against the cleaner's username, email, and
     * details within their active service listings (title, serviceType, description).
     *
     * @param {string} homeownerId - The ID of the homeowner.
     * @param {string} keyword - The search keyword.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>}
     * An array of cleaner objects or an error object.
     */
    async searchShortlistCleaner(homeownerId, keyword) {
        try {
            const cleanerProfile = await this.prisma.userProfile.findUnique({
                where: { name: 'Cleaner' },
                select: { id: true }
            });

            if (!cleanerProfile) {
                throw new Error("Cleaner profile not found in database");
            }
            const cleanerProfileId = cleanerProfile.id;

            // Define search conditions if a keyword is provided
            const keywordSearchConditions = keyword ? {
                OR: [
                    { username: { contains: keyword, mode: 'insensitive' } },
                    { email: { contains: keyword, mode: 'insensitive' } },
                    {
                        serviceListings: {
                            some: {
                                status: 'ACTIVE',
                                OR: [
                                    { serviceCategory: { 
                                        serviceCatName: { contains: keyword, mode: 'insensitive' } 
                                    }},
                                    { description: { contains: keyword, mode: 'insensitive' } },
                                ],
                            },
                        },
                    },
                ],
            } : {}; // If no keyword, no specific text search on cleaner details is applied beyond being in shortlist

            const shortlistEntries = await this.prisma.shortlist.findMany({
                where: {
                    homeownerId: homeownerId,
                    cleaner: { // Conditions on the related cleaner
                        userProfileId: cleanerProfileId, // Use the fetched/cached ID
                        status: UserStatus.ACTIVE, // Only include active cleaners
                        ...keywordSearchConditions, // Apply keyword search if provided
                    },
                },
                select: {
                    cleaner: { // Select the cleaner's details
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            serviceListings: {
                                where: { status: 'ACTIVE' }, // Only active service listings
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
                        }
                    }
                }
            });

            // Extract just the cleaner objects from the shortlist entries
            const cleaners = shortlistEntries.map(entry => entry.cleaner).filter(Boolean);
            return cleaners;

        } catch (error) {
            console.error("Error finding cleaners in shortlist by keyword:", error);
            return {
                error: {
                    status: 500,
                    message: "An unexpected error occurred while searching your shortlist."
                }
            };
        }
    }

    /**
     * Fetches all active cleaners shortlisted by a specific homeowner.
     * Includes basic cleaner details and a summary of their active service listings.
     *
     * @param {string} homeownerId - The ID of the homeowner.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>}
     * An array of cleaner objects (summaries) or an error object.
     */
    async fetchAllCleanersForHomeowner(homeownerId) {
        try {
            const cleanerUserProfile = await this.prisma.userProfile.findUnique({
                where: { name: 'Cleaner' },
                select: { id: true }
            });

            if (!cleanerUserProfile) {
                throw new Error("Cleaner profile not found in database");
            }
            const cleanerProfileId = cleanerUserProfile.id;

            const shortlistEntries = await this.prisma.shortlist.findMany({
                where: {
                    homeownerId: homeownerId,
                    cleaner: {
                        userProfileId: cleanerProfileId,
                        status: UserStatus.ACTIVE,
                    },
                },
                select: {
                    addedAt: true,
                    cleaner: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            serviceListings: {
                                where: { status: 'ACTIVE' },
                                select: {
                                    id: true,
                                    serviceType: true,
                                    title: true,
                                    description: true,
                                    ratePerHr: true,
                                },
                                take: 3
                            }
                        }
                    }
                }
            });

            const detailedShortlist = shortlistEntries.map(entry => ({
                shortlistedAt: entry.addedAt,
                ...entry.cleaner
            })).filter(item => item && item.id);

            return detailedShortlist;

        } catch (error) {
            console.error("Error fetching all cleaners for homeowner's shortlist:", error);
            return {
                error: {
                    status: 500,
                    message: "An unexpected error occurred while retrieving your shortlist."
                }
            };
        }
    }

    /**
     * Fetches all shortlisted cleaners for a homeowner with complete details
     * @param {string} homeownerId - The ID of the homeowner
     * @returns {Promise<Array|Object>} Array of cleaners or error object
     */
    async getAllShortlistedCleaners(homeownerId) {
        try {
            const cleanerProfile = await this.prisma.userProfile.findUnique({
                where: { name: 'Cleaner' },
                select: { id: true }
            });

            if (!cleanerProfile) {
                throw new Error("Cleaner profile not found in database");
            }
            const cleanerProfileId = cleanerProfile.id;

            const shortlistEntries = await this.prisma.shortlist.findMany({
                where: {
                    homeownerId: homeownerId,
                    cleaner: {
                        userProfileId: cleanerProfileId,
                        status: 'ACTIVE'
                    }
                },
                include: {
                    cleaner: {
                        include: {
                            serviceListings: {
                                where: { status: 'ACTIVE' },
                                include: {
                                    serviceCategory: {
                                        select: {
                                            serviceCatName: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return shortlistEntries.map(entry => ({
                id: entry.cleaner.id,
                username: entry.cleaner.username,
                email: entry.cleaner.email,
                serviceListings: entry.cleaner.serviceListings.map(listing => ({
                    ...listing,
                    serviceType: listing.serviceCategory?.serviceCatName || 'Cleaning'
                })),
                shortlistedAt: entry.createdAt
            }));

        } catch (error) {
            console.error("Error fetching all shortlisted cleaners:", error);
            return {
                error: {
                    status: 500,
                    message: "Failed to fetch shortlisted cleaners"
                }
            };
        }
    }
}

module.exports = ShortlistEntity;
