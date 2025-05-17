const { PrismaClient, Prisma, ServiceListingStatus } = require('../generated/prisma');

class ServiceListingEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new service listing in the database.
     * @param {string} serviceCatName - ID of the service category.
     * @param {string} description - Description of the service.
     * @param {number} ratePerHr - Rate per hour.
     * @param {string} cleanerId - ID of the user creating the listing.
     * @returns {Promise true|{error: {status: number, error: string}}>} The created listing object or an error object.
     */
    async createServiceListing(name, serviceCatName, description, ratePerHr, cleanerId) {
        try {
            const serviceCategory = await this.prisma.serviceCategory.findFirst({
                where: { 
                    serviceCatName: serviceCatName
                }
            });

            await this.prisma.serviceListing.create({
                data: {
                    name: name.trim(),
                    description: description.trim(),
                    ratePerHr: ratePerHr,
                    cleaner: { // Connect to the cleaner
                        connect: { id: cleanerId }
                    },
                    serviceCategory: { // Connect to the service category using its ID
                        connect: { id: serviceCategory.id }
                    },
                    status: ServiceListingStatus.ACTIVE // Default status
                },
                select: { // Select fields for the returned object
                    id: true,
                    name: true,
                    description: true,
                    ratePerHr: true,
                    status: true,
                    createdAt: true,
                    cleaner: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    serviceCategory: { // Select category details through relation
                        select: {
                            id: true,
                            serviceCatName: true
                        }
                    }
                }
            });

            // Format the output
            return true;

        } catch (error) {
            console.error("Error creating service listing:", error);
            return { error: { status: 500, error: 'Failed to create service listing due to a server error.' } };
        }
    }

    /**
     * Retrieves all service listings for a specific cleaner.
     * @param {string} requestingCleanerId - The ID of the cleaner whose listings are to be fetched.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of service listings or an error object.
     */
    async getAllCleanerListings(requestingCleanerId) {
        try {
            const listings = await this.prisma.serviceListing.findMany({
                where: {
                    cleanerId: requestingCleanerId
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    ratePerHr: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    cleaner: {
                        select: {
                            username: true
                        }
                    },
                    serviceCategory: {
                        select: {
                            id: true,
                            serviceCatName: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            const formattedListings = listings.map(listing => ({
                id: listing.id,
                name: listing.name,
                description: listing.description,
                ratePerHr: listing.ratePerHr,
                status: listing.status,
                createdAt: listing.createdAt,
                updatedAt: listing.updatedAt,
                cleanerUsername: listing.cleaner?.username,
                serviceCatName: listing.serviceCategory?.serviceCatName,
                serviceCategoryId: listing.serviceCategory?.id
            }));

            return formattedListings;
            
        } catch (error) {
            console.error(`Error fetching listings for cleaner ${requestingCleanerId}:`, error);
            return { error: { status: 500, message: "Failed to retrieve cleaner's service listings." } };
        }
    }

    /**
     * Retrieves the details of a specific service listing.
     * @param {string} listingId - The ID of the listing to retrieve.
     * @returns {Promise<object|{error: {status: number, error: string}}>} The listing object or an error object.
     */
    async getListingDetails(listingId) {
        try {
            const listing = await this.prisma.serviceListing.findUnique({
                where: { id: listingId },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    ratePerHr: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    cleanerId: true,
                    cleaner: {
                        select: {
                            username: true
                        }
                    },
                    serviceCategoryId: true,
                    serviceCategory: {
                        select: {
                            serviceCatName: true
                        }
                    }
                }
            });

            if (!listing) {
                return { error: { status: 404, error: 'Service listing not found' } };
            }

            // Format the output
            return {
                id: listing.id,
                name: listing.name,
                description: listing.description,
                ratePerHr: listing.ratePerHr,
                status: listing.status,
                createdAt: listing.createdAt,
                updatedAt: listing.updatedAt,
                cleanerId: listing.cleanerId,
                cleanerUsername: listing.cleaner?.username,
                serviceCategoryId: listing.serviceCategoryId,
                serviceCatName: listing.serviceCategory?.serviceCatName,
            };

        } catch (error) {
            console.error(`Error retrieving service listing ${listingId}:`, error);
            return { error: { status: 500, error: 'Failed to retrieve service listing due to a server error.' } };
        }
    }

    /**
     * Edits an existing service listing in the database.
     * @param {string} listingId - The ID of the listing to edit.
     * @param {object} updateData - Data to update the listing with.
     * @returns {Promise true |{error: {status: number, error: string}}>} The updated listing object or an error object.
     */
    async editServiceListing(listingId, updateData) {
        // If updating service category, find the category first
        if (updateData.serviceCatName) {
            const serviceCategory = await this.prisma.serviceCategory.findFirst({
                where: { 
                    serviceCatName: updateData.serviceCatName
                }
            });
            
            if (serviceCategory) {
                updateData.serviceCategory = { connect: { id: serviceCategory.id } };
                delete updateData.serviceCatName;
            }
        }
        try {
            await this.prisma.serviceListing.update({
                where: { id: listingId },
                data: actualUpdateData,
            });

            return true;

        } catch (error) {
            console.error(`Error editing service listing ${listingId}:`, error);
            return { error: { status: 500, error: 'Failed to edit service listing due to a server error.' } };
        }
    }

    /**
     * Toggles the status of a service listing (ACTIVE <-> SUSPENDED).
     * @param {string} listingId - The ID of the listing to toggle.
     * @returns {Promise true |{error: {status: number, error: string}}>} The new status or an error object.
     */
    async toggleListingStatus(listingId) {
        try {
            const existingListing = await this.prisma.serviceListing.findUnique({
                where: { id: listingId },
                select: { cleanerId: true, status: true }
            });

            const newStatus = existingListing.status === ServiceListingStatus.ACTIVE
                ? ServiceListingStatus.SUSPENDED
                : ServiceListingStatus.ACTIVE;
            
            await this.prisma.serviceListing.update({
                where: { id: listingId },
                data: { status: newStatus },
            });

            return { newStatus };

        } catch (error) {
            console.error(`Error toggling status for service listing ${listingId}:`, error);
            return { error: { status: 500, error: 'Failed to toggle service listing status due to a server error.' } };
        }
    }

    /**
     * Searches for active service listings based on various criteria.
     * Now takes multiple arguments directly.
     * @param {string} [searcherCleanerId] - ID of the cleaner performing search (to exclude their own listings).
     * @param {string} [keyword] - Keyword for name/description.
     * @param {string} [serviceCategoryId] - Filter by specific service category ID.
     * @param {number} [minRate] - Minimum rate.
     * @param {number} [maxRate] - Maximum rate.
     * @returns {Promise<Array<object>|{error: {status: number, error: string}}>} Array of listings or an error object.
     */
    async searchListings(searcherCleanerId, keyword, serviceCatName, minRate, maxRate) {
        const whereConditions = {
            status: 'ACTIVE' // Only search active listings
        };

        // Only exclude own listings if searcherCleanerId is provided
        if (searcherCleanerId) {
            whereConditions.cleanerId = {
                not: searcherCleanerId
            };
        }

        if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
            const trimmedKeyword = keyword.trim();
            whereConditions.AND = [
                {
                    OR: [
                        { name: { contains: trimmedKeyword, mode: 'insensitive' } },
                        { description: { contains: trimmedKeyword, mode: 'insensitive' } }
                    ]
                }
            ];
        }

        if (serviceCatName && typeof serviceCatName === 'string' && serviceCatName.trim() !== '') {
            whereConditions.serviceCategory = {
                serviceCatName: {
                    equals: serviceCatName.trim(),
                    mode: 'insensitive'
                }
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
                    name: true,
                    description: true,
                    ratePerHr: true,
                    status: true,
                    updatedAt: true,
                    cleaner: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    serviceCategory: {
                        select: {
                            id: true,
                            serviceCatName: true
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc',
                }
            });

            if (listings.length === 0 && (keyword || serviceCategoryId || minRate !== undefined || maxRate !== undefined)) {
                return { error: { status: 404, error: "No matching listings found." } };
            }

            return listings.map(listing => ({
                id: listing.id,
                name: listing.name,
                description: listing.description,
                ratePerHr: listing.ratePerHr,
                status: listing.status,
                updatedAt: listing.updatedAt,
                cleanerId: listing.cleaner?.id,
                cleanerUsername: listing.cleaner?.username,
                serviceCategoryId: listing.serviceCategory?.id,
                serviceCatName: listing.serviceCategory?.serviceCatName,
            }));

        } catch (error) {
            console.error(`Error searching service listings:`, error);
            if (error instanceof Prisma.PrismaClientValidationError) {
                return { error: { status: 400, error: 'Invalid filter parameters provided for search.' } };
            }
            return { error: { status: 500, error: 'Failed to search service listings due to a server error.' } };
        }
    }

    /**
     * Retrieves new service listings created within a specified period for reports.
     * @param {Date} startDate - The start of the period (inclusive).
     * @param {Date} endDate - The end of the period (exclusive).
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of service listings or an error object.
     */
    async getNewListingsInPeriod(startDate, endDate) {
        try {
            const listings = await this.prisma.serviceListing.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    ratePerHr: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    cleaner: {
                        select: {
                            id: true,
                            username: true,
                        }
                    },
                    serviceCategory: {
                        select: {
                            id: true,
                            serviceCatName: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
            return listings.map(listing => ({
                id: listing.id,
                name: listing.name,
                description: listing.description,
                ratePerHr: listing.ratePerHr,
                status: listing.status,
                createdAt: listing.createdAt,
                updatedAt: listing.updatedAt,
                cleanerId: listing.cleaner?.id,
                cleanerUsername: listing.cleaner?.username,
                serviceCategoryId: listing.serviceCategory?.id,
                serviceCatName: listing.serviceCategory?.serviceCatName,
            }));
        } catch (error) {
            console.error("Error retrieving new service listings in entity:", error);
            return { error: { status: 500, message: 'Failed to retrieve new service listings.' } };
        }
    }

    /**
     * Gets all active service categories
     * @returns {Promise<Array<object>|{error: {status: number, error: string}}>} Array of categories or error
     */
    async getActiveServiceCategories() {
        try {
            const categories = await this.prisma.serviceCategory.findMany({
                where: {
                    status: 'ACTIVE'
                },
                select: {
                    id: true,
                    serviceCatName: true,
                    serviceCatDescription: true
                },
                orderBy: {
                    serviceCatName: 'asc'
                }
            });
            
            // Always return an array, even if empty
            return categories || [];
        } catch (error) {
            console.error('Error fetching active service categories:', error);
            return { error: { status: 500, error: 'Failed to fetch service categories' } };
        }
    }
}

module.exports = ServiceListingEntity;
