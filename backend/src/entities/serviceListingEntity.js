const { PrismaClient, Prisma } = require('../generated/prisma');

class ServiceListingEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new service listing in the database.
     * @param {object} listingData - Data for the new listing.
     * @param {string} listingData.serviceType - Type of service.
     * @param {string} listingData.title - Title of the listing.
     * @param {string} listingData.description - Description of the service.
     * @param {number} listingData.ratePerHr - Rate per hour.
     * @param {string} listingData.cleanerId - ID of the user creating the listing.
     * @returns {Promise<boolean|{error: {status: number, error: string}}>} True on successful creation, or an error object on failure.
     */
    async createServiceListing(listingData) {
        // Destructure data first for validation
        const { serviceType, title, description, ratePerHr, cleanerId } = listingData;

        // --- Inlined Validation Logic ---
        if (!serviceType || typeof serviceType !== 'string' || serviceType.trim().length === 0) {
            return { error: { status: 400, error: 'Service Type must be a non-empty string.' }};
        }
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return { error: { status: 400, error: 'Title must be a non-empty string.' }};
        }
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return { error: { status: 400, error: 'Description must be a non-empty string.' }};
        }
        if (ratePerHr === undefined || ratePerHr === null) {
            return { error: { status: 400, error: 'Rate per hour is required.' }};
        }
        if (!cleanerId || typeof cleanerId !== 'string' || cleanerId.trim().length === 0) {
             return { error: { status: 400, error: 'Cleaner ID must be provided.' }};
        }
        if (typeof ratePerHr !== 'number' || ratePerHr <= 0) {
            return { error: { status: 400, error: 'Rate per hour must be a positive number.' }};
        }
        // --- End Inlined Validation Logic ---

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
                    cleanerId: cleanerId,
                },
                // Select the fields to return
                select: {
                    id: true,
                    serviceType: true,
                    title: true,
                    description: true,
                    ratePerHr: true,
                    createdAt: true,
                    cleaner: { // Include cleaner's username for context
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            });

            return true; // Return true on successful creation

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

    /**
     * Retrieves the details of a specific service listing, ensuring the requester is the owner.
     * @param {string} listingId - The ID of the listing to retrieve.
     * @param {string} requestingCleanerId - The ID of the user requesting the details.
     * @returns {Promise<object>} The listing object or an error object.
     */
    async getListingDetails(listingId, requestingCleanerId) {
        if (!listingId || typeof listingId !== 'string') {
            return { error: { status: 400, error: 'Invalid listing ID provided.' } };
        }
        if (!requestingCleanerId) {
            return { error: { status: 401, error: 'Authentication required.' } };
        }

        try {
            const listing = await this.prisma.serviceListing.findUnique({
                where: { id: listingId },
                select: {
                    id: true,
                    serviceType: true,
                    title: true,
                    description: true,
                    ratePerHr: true,
                    createdAt: true,
                    cleanerId: true, // Need cleanerId to verify ownership
                    cleaner: { // Include cleaner's username for context
                        select: {
                            username: true
                        }
                    }
                }
            });

            if (!listing) {
                return { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };
            }

            // Verify ownership
            if (listing.cleanerId !== requestingCleanerId) {
                // Although the user is authenticated, they don't own this specific listing
                return { error: { status: 403, error: 'Forbidden: You do not have permission to view this listing.' } };
            }

            // Remap cleaner info for a cleaner response structure
             return {
                ...listing,
                cleanerUsername: listing.cleaner.username,
                cleaner: undefined // Remove nested cleaner object
            };

        } catch (error) {
            console.error(`Error retrieving service listing ${listingId}:`, error);
             // Handle potential Prisma errors (e.g., malformed ID format)
            if (error.code === 'P2023' || (error instanceof Prisma.PrismaClientKnownRequestError && error.message.includes("Malformed ObjectID"))) {
                 return { error: { status: 400, error: 'Invalid listing ID format.' } };
            }
            return { error: { status: 500, error: 'Failed to retrieve service listing due to a server error.' } };
        }
    }

    /**
     * Validates the input data for editing a service listing.
     * Only validates fields that are present in the updateData.
     * @param {object} updateData - Data for updating the listing.
     * @param {string} [updateData.serviceType] - Type of service.
     * @param {string} [updateData.description] - Description of the service.
     * @param {number} [updateData.ratePerHr] - Rate per hour.
     * @returns {object|null} Error object { status: number, error: string } or null if valid.
     */
    validateEditInput(updateData) {
        const { serviceType, description, ratePerHr } = updateData;

        if (serviceType !== undefined) {
            if (typeof serviceType !== 'string' || serviceType.trim().length === 0) {
                return { status: 400, error: 'Service Type must be a non-empty string.' };
            }
        }
        if (description !== undefined) {
            if (typeof description !== 'string' || description.trim().length === 0) {
                return { status: 400, error: 'Description must be a non-empty string.' };
            }
        }
        if (ratePerHr !== undefined) {
            if (typeof ratePerHr !== 'number' || ratePerHr <= 0) {
                return { status: 400, error: 'Rate per hour must be a positive number.' };
            }
        }
        return null; // Input is valid for the provided fields
    }

    /**
     * Edits an existing service listing in the database.
     * @param {string} listingId - The ID of the listing to edit.
     * @param {string} cleanerId - The ID of the cleaner attempting the edit (for ownership verification).
     * @param {object} updateData - Data to update the listing with.
     * @returns {Promise<boolean|object>} True if successful, or an error object.
     */
    async editServiceListing(listingId, cleanerId, updateData) {
        if (!listingId || typeof listingId !== 'string') {
            return { error: { status: 400, error: 'Invalid listing ID provided.' } };
        }
        if (!cleanerId) {
            return { error: { status: 401, error: 'Authentication required for editing.' } };
        }

        // Check if there's anything to update
        const allowedUpdateFields = ['serviceType', 'description', 'ratePerHr'];
        const actualUpdateData = {};
        let hasUpdateFields = false;
        for (const field of allowedUpdateFields) {
            if (updateData[field] !== undefined) {
                actualUpdateData[field] = updateData[field];
                hasUpdateFields = true;
            }
        }

        if (!hasUpdateFields) {
            return { error: { status: 400, error: 'No valid fields provided for update.' } };
        }

        const validationError = this.validateEditInput(actualUpdateData);
        if (validationError) {
            return { error: validationError };
        }

        try {
            // Verify listing exists and cleanerId is the owner
            const existingListing = await this.prisma.serviceListing.findUnique({
                where: { id: listingId },
                select: { cleanerId: true }
            });

            if (!existingListing) {
                return { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };
            }
            if (existingListing.cleanerId !== cleanerId) {
                return { error: { status: 403, error: 'Forbidden: You do not have permission to edit this listing.' } };
            }

            // Prepare data for Prisma update (trim strings, convert date)
            const prismaUpdateData = {};
            if (actualUpdateData.serviceType !== undefined) {
                prismaUpdateData.serviceType = actualUpdateData.serviceType.trim();
            }
            if (actualUpdateData.description !== undefined) {
                prismaUpdateData.description = actualUpdateData.description.trim();
            }
            if (actualUpdateData.ratePerHr !== undefined) {
                prismaUpdateData.ratePerHr = actualUpdateData.ratePerHr;
            }

            const updatedListing = await this.prisma.serviceListing.update({
                where: { id: listingId },
                data: prismaUpdateData,
            });

            return true; // Successfully updated

        } catch (error) {
            console.error(`Error editing service listing ${listingId}:`, error);
            if (error.code === 'P2023' || (error instanceof Prisma.PrismaClientKnownRequestError && error.message.includes("Malformed ObjectID"))) {
                 return { error: { status: 400, error: 'Invalid listing ID format.' } };
            }
            // P2025: Record to update not found (could happen in a race condition if deleted after initial check)
            if (error.code === 'P2025') {
                return { error: { status: 404, error: `Service listing with ID ${listingId} not found for update.` } };
            }
            return { error: { status: 500, error: 'Failed to edit service listing due to a server error.' } };
        }
    }

    /**
     * Suspends a service listing.
     * @param {string} listingId - The ID of the listing to suspend.
     * @param {string} cleanerId - The ID of the cleaner attempting the suspension (for ownership verification).
     * @returns {Promise<boolean|object>} True if successful, or an error object.
     */
    async suspendServiceListing(listingId, cleanerId) {
        if (!listingId || typeof listingId !== 'string') {
            return { error: { status: 400, error: 'Invalid listing ID provided.' } };
        }
        if (!cleanerId) {
            return { error: { status: 401, error: 'Authentication required for suspending a listing.' } };
        }

        try {
            // Verify listing exists and cleanerId is the owner
            const existingListing = await this.prisma.serviceListing.findUnique({
                where: { id: listingId },
                select: { cleanerId: true, status: true }
            });

            if (!existingListing) {
                return { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };
            }
            if (existingListing.cleanerId !== cleanerId) {
                return { error: { status: 403, error: 'Forbidden: You do not have permission to suspend this listing.' } };
            }
            if (existingListing.status === 'SUSPENDED') {
                return { error: { status: 400, error: 'Service listing is already suspended.' } };
            }

            await this.prisma.serviceListing.update({
                where: { id: listingId },
                data: { status: 'SUSPENDED' },
            });

            return true; // Successfully suspended

        } catch (error) {
            console.error(`Error suspending service listing ${listingId}:`, error);
            if (error.code === 'P2023' || (error instanceof Prisma.PrismaClientKnownRequestError && error.message.includes("Malformed ObjectID"))) {
                 return { error: { status: 400, error: 'Invalid listing ID format.' } };
            }
            if (error.code === 'P2025') { // Record to update not found
                return { error: { status: 404, error: `Service listing with ID ${listingId} not found for update.` } };
            }
            return { error: { status: 500, error: 'Failed to suspend service listing due to a server error.' } };
        }
    }

    /**
     * Searches for active service listings based on various criteria, excluding those of the searcher.
     * @param {string} searcherCleanerId - The ID of the cleaner performing the search (to exclude their own listings).
     * @param {object} filters - Optional filters.
     * @param {string} [filters.keyword] - Keyword to search in title and description.
     * @param {string} [filters.serviceType] - Filter by service type.
     * @param {number} [filters.minRate] - Minimum rate per hour.
     * @param {number} [filters.maxRate] - Maximum rate per hour.
     * @returns {Promise<Array<object>|object>} Array of listing objects or an error/message object.
     */
    async searchListings(searcherCleanerId, filters = {}) {
        if (!searcherCleanerId) {
            // This check is more for internal consistency; controller should ensure user is authenticated.
            return { error: { status: 401, error: 'Authentication required to perform search.' } };
        }

        const { keyword, serviceType, minRate, maxRate } = filters;
        const whereConditions = {
            status: 'ACTIVE', // Only search active listings
            cleanerId: {
                not: searcherCleanerId // Exclude listings from the user performing the search
            },
        };

        if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
            const trimmedKeyword = keyword.trim();
            whereConditions.OR = [
                { title: { contains: trimmedKeyword, mode: 'insensitive' } },
                { description: { contains: trimmedKeyword, mode: 'insensitive' } },
            ];
        }

        if (serviceType && typeof serviceType === 'string' && serviceType.trim() !== '') {
            whereConditions.serviceType = {
                equals: serviceType.trim(),
                mode: 'insensitive',
            };
        }

        const rateFilter = {};
        if (minRate !== undefined && typeof minRate === 'number' && minRate >= 0) {
            rateFilter.gte = minRate;
        }
        if (maxRate !== undefined && typeof maxRate === 'number' && maxRate >= 0) {
            if (minRate !== undefined && maxRate < minRate) {
                return { error: { status: 400, error: 'Maximum rate cannot be less than minimum rate.' } };
            }
            rateFilter.lte = maxRate;
        }
        if (Object.keys(rateFilter).length > 0) {
            whereConditions.ratePerHr = rateFilter;
        }

        try {
            const listings = await this.prisma.serviceListing.findMany({
                where: whereConditions,
                select: {
                    id: true,
                    serviceType: true,
                    title: true,
                    description: true,
                    ratePerHr: true,
                    updatedAt: true, // To show how recent the listing is
                    cleaner: {
                        select: {
                            id: true,
                            username: true // Show who the cleaner is
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc', // Show most recently updated listings first
                }
            });

            if (listings.length === 0) {
                return { message: "No matching listings found." };
            }

            return listings.map(listing => ({
                ...listing,
                cleanerId: listing.cleaner.id,
                cleanerUsername: listing.cleaner.username,
                cleaner: undefined,
            }));

        } catch (error) {
            console.error(`Error searching service listings:`, error);
            if (error instanceof Prisma.PrismaClientValidationError) {
                 return { error: { status: 400, error: 'Invalid filter parameters provided for search.' } };
            }
            return { error: { status: 500, error: 'Failed to search service listings due to a server error.' } };
        }
    }
}

module.exports = ServiceListingEntity;