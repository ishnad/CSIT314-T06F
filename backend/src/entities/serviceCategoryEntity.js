const { PrismaClient } = require('../generated/prisma');

class ServiceCategoryEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Creates a new service category.
     * @param {string} serviceCatName - The name of the service category.
     * @param {string} [serviceCatDescription] - An optional description for the service category.
     * @returns {Promise<object|{error: {status: number, message: string}}>} The created service category object or an error object.
     */
    async createServiceCategory(serviceCatName, serviceCatDescription) {
        try {
            const existingCategory = await this.prisma.serviceCategory.findFirst({
                where: {
                    serviceCatName: {
                        equals: serviceCatName,
                        mode: 'insensitive' // Ensures "window cleaning" and "Window Cleaning" are treated as the same
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
                },
            });

            return true;
        } catch (error) {
            console.error("Error creating service category in entity:", error);
            // Check for specific Prisma errors if needed, e.g., unique constraint violation if not caught above
            return { error: { status: 500, message: 'Failed to create service category due to a server error.' } };
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

            if (keyword && keyword.trim() !== "") {
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


}

module.exports = ServiceCategoryEntity;