const { PrismaClient, ServiceCategoryStatus } = require('../generated/prisma');

class ServiceCategoryEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new service category.
     * @param {string} serviceCatName - The name of the service category.
     * @param {string} [serviceCatDescription] - An optional description for the service category.
     * @param {ServiceCategoryStatus} [status] - Optional status, defaults to ACTIVE if not provided by Prisma schema.
     * @returns {Promise true|{error: {status: number, message: string}}>} The created service category object or an error object.
     */
    async createServiceCategory(serviceCatName, serviceCatDescription, status = ServiceCategoryStatus.ACTIVE) {
        try {
            const existingCategory = await this.prisma.serviceCategory.findFirst({
                where: {
                    serviceCatName: {
                        equals: serviceCatName.trim(),
                        mode: 'insensitive'
                    }
                },
            });

            if (existingCategory) {
                return { error: { status: 409, message: 'Service Category Exists!' } };
            }

            await this.prisma.serviceCategory.create({
                data: {
                    serviceCatName: serviceCatName.trim(),
                    serviceCatDescription: serviceCatDescription ? serviceCatDescription.trim() : null,
                    status: status, // Explicitly set status
                },
            });
            return true;
        } catch (error) {
            console.error("Error creating service category in entity:", error);
            return { error: { status: 500, message: 'Failed to create service category.' } };
        }
    }

    /**
     * Searches for service categories based on a keyword and/or status.
     * @param {string} [keyword] - The keyword to search in name and description (case-insensitive).
     * @param {ServiceCategoryStatus} [status] - The status to filter by (e.g., ACTIVE, INACTIVE).
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of matching service categories or an error object.
     */
    async searchServiceCategories({ keyword, status }) {
        try {
            const whereConditions = {};
            const orConditions = [];

            // Always include all categories by default, with optional filters
            if (keyword) {
                const trimmedKeyword = keyword.trim();
                orConditions.push({
                    serviceCatName: {
                        contains: trimmedKeyword,
                        mode: 'insensitive', // Case-insensitive search
                    }
                });
                orConditions.push({
                    serviceCatDescription: {
                        contains: trimmedKeyword,
                        mode: 'insensitive',
                    }
                });
            }

            if (orConditions.length > 0) {
                whereConditions.OR = orConditions;
            }

            if (status) {
                // Validate if the provided status is a valid enum value
                if (Object.values(ServiceCategoryStatus).includes(status)) {
                    whereConditions.status = status;
                } else {
                    console.warn(`Invalid status value provided for search: ${status}. Ignoring status filter.`);
                }
            }

            const categories = await this.prisma.serviceCategory.findMany({
                where: whereConditions,
                orderBy: {
                    serviceCatName: 'asc', // Optional: order results
                }
            });

            return categories;
        } catch (error) {
            console.error("Error searching service categories in entity:", error);
            return { error: { status: 500, message: 'Failed to search service categories.' } };
        }
    }

    /**
     * Retrieves all service categories.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of service categories or an error object.
     */
    async getAllServiceCategories() {
        try {
            const categories = await this.prisma.serviceCategory.findMany({
                orderBy: {
                    serviceCatName: 'asc' // Optional: order by name
                }
            });
            return categories;
        } catch (error) {
            console.error("Error retrieving service categories in entity:", error);
            return { error: { status: 500, message: 'Failed to retrieve service categories.' } };
        }
    }

    /**
     * Retrieves details of a specific service category by its ID, including the number of service listings.
     * @param {string} categoryId - The ID of the service category to retrieve.
     * @returns {Promise<object|{error: {status: number, message: string}}>} The service category object with details and listings count, or an error object.
     */
    async getCategoryDetailsById(categoryId) {
        try {
            const category = await this.prisma.serviceCategory.findUnique({
                where: { id: categoryId },
                include: {
                    _count: { // Include the count of related service listings
                        select: { serviceListings: true },
                    },
                },
            });

            if (!category) {
                return { error: { status: 404, message: 'Service category not found.' } };
            }

            // Transform the Prisma result to match the BCE's expected structure
            // where numOfServiceListings is a direct attribute.
            const categoryDetails = {
                serviceCatID: category.id, // Matches BCE's serviceCatID (though it's a string)
                serviceCatName: category.serviceCatName,
                serviceCatDescription: category.serviceCatDescription,
                status: category.status, // Include status as it's part of the model
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                numOfServiceListings: category._count?.serviceListings || 0,
            };

            return categoryDetails;
        } catch (error) {
            console.error(`Error retrieving category details for ID ${categoryId}:`, error);
            return { error: { status: 500, message: 'System error while retrieving category details.' } };
        }
    }

    /**
     * Updates an existing service category.
     * @param {string} categoryId - The ID of the service category to update.
     * @param {object} updateData - An object containing the data to update.
     * @param {string} [updateData.serviceCatName] - The new name for the service category.
     * @param {string} [updateData.serviceCatDescription] - The new description.
     * @param {ServiceCategoryStatus} [updateData.status] - The new status.
     * @returns {Promise<object|{error: {status: number, message: string}}>} The updated service category object or an error object.
     */
    async updateServiceCategory(categoryId, { serviceCatName, serviceCatDescription, status }) {
        try {
            // Fetch the current category to check if it exists
            const currentCategory = await this.prisma.serviceCategory.findUnique({
                where: { id: categoryId },
            });
            if (!currentCategory) {
                return { error: { status: 404, message: 'Service category not found.' } }; // Corresponds to 4c if ID is for retrieval
            }

            // If serviceCatName is being updated, check for uniqueness
            if (serviceCatName && serviceCatName.trim().toLowerCase() !== currentCategory.serviceCatName.toLowerCase()) {
                const trimmedNewName = serviceCatName.trim();
                const existingCategoryWithNewName = await this.prisma.serviceCategory.findFirst({
                    where: {
                        serviceCatName: {
                            equals: trimmedNewName,
                            mode: 'insensitive',
                        },
                        NOT: {
                            id: categoryId, // Exclude the current category from the check
                        },
                    },
                });

                if (existingCategoryWithNewName) {
                    return { error: { status: 409, message: 'Service Category Already Exists!' } }; // 4b
                }
            }

            // Prepare data for update, only including fields that are actually provided
            const dataToUpdate = {};
            if (serviceCatName !== undefined) {
                dataToUpdate.serviceCatName = serviceCatName.trim();
            }
            if (serviceCatDescription !== undefined) { // Allow setting description to null or empty
                dataToUpdate.serviceCatDescription = serviceCatDescription === null ? null : serviceCatDescription.trim();
            }
            if (status !== undefined) {
                if (!Object.values(ServiceCategoryStatus).includes(status)) {
                     return { error: { status: 400, message: `Invalid status value: ${status}.` }}; // 4a
                }
                dataToUpdate.status = status;
            }

            const updatedCategory = await this.prisma.serviceCategory.update({
                where: { id: categoryId },
                data: dataToUpdate,
            });
            
            return {
                serviceCatID: updatedCategory.id,
                serviceCatName: updatedCategory.serviceCatName,
                serviceCatDescription: updatedCategory.serviceCatDescription,
                status: updatedCategory.status,
            };

        } catch (error) {
            console.error(`Error updating service category ${categoryId}:`, error);
            return { error: { status: 500, message: 'System error while updating service category.' } };
        }
    }

    /**
     * Suspends a service category if all preconditions are met.
     * @param {string} categoryId - The ID of the service category to suspend.
     * @returns {Promise true|{error: {status: number, message: string}}>}
     * An object indicating success or failure with a message, or the updated category.
     * The controller will translate this to a boolean if strictly required by BCE API response.
     */
    async suspendServiceCategory(categoryId) {
        try {
            // 1. Fetch the category
            const category = await this.prisma.serviceCategory.findUnique({
                where: { id: categoryId },
            });

            // 2. Precondition: The chosen Service Category must be "Active"
            if (category.status !== ServiceCategoryStatus.ACTIVE) {
                return { error: { status: 400, message: `Service category is not ACTIVE. Current status: ${category.status}.` } };
            }

            // 3. Precondition: Category must not be in use by any *active* service listings.
            const activeListingsCount = await this.prisma.serviceListing.count({
                where: {
                    serviceCategoryId: categoryId,
                    status: ServiceListingStatus.ACTIVE,
                },
            });

            if (activeListingsCount > 0) {
                return { error: { status: 400, message: `Cannot suspend category: It is currently used by ${activeListingsCount} active service listing(s).` } };
            }

            // All preconditions met, proceed to suspend (set status to INACTIVE)
            await this.prisma.serviceCategory.update({
                where: { id: categoryId },
                data: { status: ServiceCategoryStatus.INACTIVE },
            });

            return true;

        } catch (error) {
            console.error(`Error suspending service category ${categoryId}:`, error);
            return { error: { status: 500, message: 'System error while suspending service category.' } };
        }
    }
}

module.exports = ServiceCategoryEntity;
