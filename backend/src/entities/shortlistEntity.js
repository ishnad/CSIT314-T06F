const { PrismaClient } = require('../generated/prisma');

class ShortlistEntity {
    constructor() {
        this.prisma = new PrismaClient();
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
            const cleanerAccount = await this.prisma.userAccount.findUnique({
                where: { id: cleanerId },
                include: { name: true }
            });
            
            const existingEntry = await this.prisma.shortlist.findUnique({
                where: {
                    homeownerCleanerUnique: { // Using the @@unique constraint name
                        homeownerId: homeownerId,
                        cleanerId: cleanerId
                    }
                }
            });

            if (existingEntry) {
                return { error: { status: 409, error: `Shortlist of Cleaner '${cleanerAccount.name}' already exists.` } };
            }

            await this.prisma.shortlist.create({
                data: {
                    homeownerId: homeownerId,
                    cleanerId: cleanerId
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
                where: { name: 'CLEANER' },
                select: { id: true }
            });

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
                                    { serviceType: { contains: keyword, mode: 'insensitive' } },
                                    { title: { contains: keyword, mode: 'insensitive' } },
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
                        userProfileId: cleanerProfile.id,
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
                                    serviceType: true,
                                    title: true,
                                    description: true,
                                    ratePerHr: true,
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
    async viewCleanerProfile(homeownerId) {
        try {
            const cleanerProfile = await this.prisma.userProfile.findUnique({
                where: { name: 'CLEANER' }, // Ensure 'CLEANER' is the exact name
                select: { id: true }
            });

            const shortlistEntries = await this.prisma.shortlist.findMany({
                where: {
                    homeownerId: homeownerId,
                    cleaner: { // Ensure the shortlisted user is an ACTIVE CLEANER
                        userProfileId: cleanerProfile.id,
                        status: UserStatus.ACTIVE,
                    },
                },
                select: {
                    addedAt: true,
                    cleaner: {  // Select details of the cleaner
                        select: {
                            id: true,   // cleanerID
                            username: true,
                            email: true,
                            serviceListings: {
                                where: { status: 'ACTIVE' }, // Only active service listings
                                select: {
                                    id: true,
                                    serviceType: true,
                                    title: true,
                                    description: true,
                                    ratePerHr: true,
                                },
                                take: 3 // Example: Show a few top/recent service listings in the summary
                            }
                        }
                    }
                }
            });

            // Map the result to a list of cleaner objects with shortlist metadata if needed
            const detailedShortlist = shortlistEntries.map(entry => ({
                shortlistedAt: entry.addedAt,
                ...entry.cleaner // Spread the cleaner details
            })).filter(item => item.id); // Ensure cleaner object exists

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
}

module.exports = ShortlistEntity;