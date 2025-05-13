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
            
            const existingEntry = await this.prisma.shortlistEntry.findUnique({
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

            const newShortlistEntry = await this.prisma.shortlistEntry.create({
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
}

module.exports = ShortlistEntity;