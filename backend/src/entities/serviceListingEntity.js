const { PrismaClient } = require('../generated/prisma');

class ServiceListingEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Validates the input data for creating a service listing.
     * @param {object} listingData - Data for the new listing.
     * @param {string} listingData.serviceType - Type of service.
     * @param {string} listingData.title - Title of the listing.
     * @param {string} listingData.description - Description of the service.
     * @param {number} listingData.ratePerHr - Rate per hour.
     * @param {number} listingData.duration - Estimated duration in hours.
     * @param {string} listingData.availability - ISO 8601 date string for availability.
     * @param {string} listingData.cleanerId - ID of the user creating the listing.
     * @returns {object|null} Error object { status: number, error: string } or null if valid.
     */
    validateInput({ serviceType, title, description, ratePerHr, duration, availability, cleanerId }) {
        // Check for presence and basic type/format of required fields
        if (!serviceType || typeof serviceType !== 'string' || serviceType.trim().length === 0) {
            return { status: 400, error: 'Service Type must be a non-empty string.' };
        }
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return { status: 400, error: 'Title must be a non-empty string.' };
        }
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return { status: 400, error: 'Description must be a non-empty string.' };
        }
        // Check presence specifically for numbers before checking value
        if (ratePerHr === undefined || ratePerHr === null) {
            return { status: 400, error: 'Rate per hour is required.' };
        }
        if (duration === undefined || duration === null) {
            return { status: 400, error: 'Duration is required.' };
        }
        if (!availability || typeof availability !== 'string') {
             return { status: 400, error: 'Availability is required and must be a string.' };
        }
        if (!cleanerId || typeof cleanerId !== 'string' || cleanerId.trim().length === 0) {
             return { status: 400, error: 'Cleaner ID must be provided.' };
        }

        // Now check types and values for numeric fields
        if (typeof ratePerHr !== 'number' || ratePerHr <= 0) {
            return { status: 400, error: 'Rate per hour must be a positive number.' };
        }
        if (typeof duration !== 'number' || duration <= 0) {
            return { status: 400, error: 'Duration must be a positive number.' };
        }

        // Check date validity
        if (isNaN(Date.parse(availability))) {
             return { status: 400, error: 'Availability must be a valid ISO 8601 date string.' };
        }

        return null; // Input is valid
    }

    /**
     * Creates a new service listing in the database.
     * @param {object} listingData - Data for the new listing (validated).
     * @returns {Promise<object>} The created listing object or an error object.
     */
    async createServiceListing(listingData) {
        const validationError = this.validateInput(listingData);
        if (validationError) {
            return { error: validationError };
        }

        // Destructure validated data
        const { serviceType, title, description, ratePerHr, duration, availability, cleanerId } = listingData;

        try {
            // Verify cleanerId exists and is actually a 'Cleaner' profile user
            const cleanerAccount = await this.prisma.userAccount.findUnique({
                where: { id: cleanerId },
                include: { userProfile: true }
            });

            if (!cleanerAccount) {
                 return { error: { status: 404, error: `User with ID ${cleanerId} not found.` } };
            }
            if (!cleanerAccount.userProfile || cleanerAccount.userProfile.name !== 'Cleaner') {
                 return { error: { status: 403, error: `User ${cleanerAccount.username} is not authorized to create listings (not a Cleaner).` } };
            }


            const newListing = await this.prisma.serviceListing.create({
                data: {
                    serviceType: serviceType.trim(),
                    title: title.trim(),
                    description: description.trim(),
                    ratePerHr: ratePerHr,
                    duration: duration,
                    availability: new Date(availability), // Convert ISO string to Date object
                    cleanerId: cleanerId,
                },
                // Select the fields to return
                select: {
                    id: true,
                    serviceType: true,
                    title: true,
                    description: true,
                    ratePerHr: true,
                    duration: true,
                    availability: true,
                    createdAt: true,
                    cleaner: { // Include cleaner's username for context
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            });

            // Remap cleaner info for a cleaner response structure
            return {
                ...newListing,
                cleanerId: newListing.cleaner.id,
                cleanerUsername: newListing.cleaner.username,
                cleaner: undefined // Remove nested cleaner object
            };

        } catch (error) {
            console.error("Error creating service listing:", error);
            // Handle potential Prisma errors (e.g., database connection issues, constraint violations)
            // Check for specific Prisma errors if needed (e.g., P2003 foreign key constraint)
            if (error.code === 'P2003') { // Foreign key constraint failed (e.g., cleanerId doesn't exist)
                 return { error: { status: 400, error: `Invalid cleanerId provided.` } };
            }
            return { error: { status: 500, error: 'Failed to create service listing due to a server error.' } };
        }
    }
}

module.exports = ServiceListingEntity;
