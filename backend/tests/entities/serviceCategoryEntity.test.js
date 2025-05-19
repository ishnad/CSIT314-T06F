const ServiceCategoryEntity = require('../../src/entities/serviceCategoryEntity');
const { PrismaClient, ServiceCategoryStatus, ServiceListingStatus } = require('../../src/generated/prisma');

// Mock lib/prismaClient by defining the mock object within the factory
jest.mock('../../src/lib/prismaClient', () => ({
    serviceCategory: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
    },
    serviceListing: { 
        count: jest.fn(),
    },
}));

jest.mock('../../src/generated/prisma', () => {
    const actualGeneratedPrisma = jest.requireActual('../../src/generated/prisma');
    return {
        ...actualGeneratedPrisma, 
        PrismaClient: jest.fn(() => require('../../src/lib/prismaClient')), // Return the same mock
    };
});


describe('ServiceCategoryEntity', () => {
    let serviceCategoryEntity;
    let mockPrisma;

    beforeEach(() => {
        jest.clearAllMocks(); // Moved clearAllMocks to the top
        mockPrisma = require('../../src/lib/prismaClient');
        serviceCategoryEntity = new ServiceCategoryEntity(); 

        // Reset specific mock behaviors if needed, though clearAllMocks handles jest.fn()
        mockPrisma.serviceCategory.findFirst.mockReset();
        mockPrisma.serviceCategory.create.mockReset();
        mockPrisma.serviceCategory.findMany.mockReset();
        mockPrisma.serviceCategory.findUnique.mockReset();
        mockPrisma.serviceCategory.update.mockReset();
        mockPrisma.serviceListing.count.mockReset();
    });

    describe('createServiceCategory', () => {
        it('should create a new service category successfully', async () => {
            mockPrisma.serviceCategory.findFirst.mockResolvedValue(null); // No existing category
            mockPrisma.serviceCategory.create.mockResolvedValue({
                id: 'cat1',
                serviceCatName: 'Cleaning',
                serviceCatDescription: 'General cleaning services',
                status: ServiceCategoryStatus.ACTIVE,
            });

            const result = await serviceCategoryEntity.createServiceCategory('Cleaning', 'General cleaning services');
            expect(result).toBe(true);
            expect(mockPrisma.serviceCategory.findFirst).toHaveBeenCalledWith({
                where: { serviceCatName: { equals: 'Cleaning', mode: 'insensitive' } },
            });
            expect(mockPrisma.serviceCategory.create).toHaveBeenCalledWith({
                data: {
                    serviceCatName: 'Cleaning',
                    serviceCatDescription: 'General cleaning services',
                    status: ServiceCategoryStatus.ACTIVE,
                },
            });
        });

        it('should return error if service category already exists', async () => {
            mockPrisma.serviceCategory.findFirst.mockResolvedValue({ id: 'cat1', serviceCatName: 'Cleaning' }); // Category exists

            const result = await serviceCategoryEntity.createServiceCategory('Cleaning', 'Another description');
            expect(result).toEqual({ error: { status: 409, message: 'Service Category Exists!' } });
        });

        it('should return error on database failure', async () => {
            mockPrisma.serviceCategory.findFirst.mockRejectedValue(new Error('DB error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await serviceCategoryEntity.createServiceCategory('Gardening', 'Outdoor services');
            expect(result).toEqual({ error: { status: 500, message: 'Failed to create service category.' } });
            consoleErrorSpy.mockRestore();
        });
    });

    describe('searchServiceCategories', () => {
        it('should return categories matching keyword and status', async () => {
            const mockCategories = [
                { id: 'cat1', serviceCatName: 'House Cleaning', _count: { serviceListings: 2 } },
            ];
            mockPrisma.serviceCategory.findMany.mockResolvedValue(mockCategories);

            const result = await serviceCategoryEntity.searchServiceCategories({ keyword: 'Clean', status: ServiceCategoryStatus.ACTIVE });
            expect(result).toEqual([{ id: 'cat1', serviceCatName: 'House Cleaning', _count: { serviceListings: 2 }, numOfServiceListings: 2 }]);
            expect(mockPrisma.serviceCategory.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    OR: [
                        { serviceCatName: { contains: 'Clean', mode: 'insensitive' } },
                        { serviceCatDescription: { contains: 'Clean', mode: 'insensitive' } },
                    ],
                    status: ServiceCategoryStatus.ACTIVE,
                },
            }));
        });
        
        it('should return all categories if no keyword or status is provided', async () => {
            const mockCategories = [
                { id: 'cat1', serviceCatName: 'Cleaning', _count: { serviceListings: 1 } },
                { id: 'cat2', serviceCatName: 'Gardening', _count: { serviceListings: 0 } },
            ];
            mockPrisma.serviceCategory.findMany.mockResolvedValue(mockCategories);

            const result = await serviceCategoryEntity.searchServiceCategories({});
            expect(result.length).toBe(2);
            expect(mockPrisma.serviceCategory.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {}, // Empty where condition
            }));
        });


        it('should ignore invalid status and search by keyword only', async () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
            const mockCategories = [{ id: 'cat1', serviceCatName: 'Test Category', _count: { serviceListings: 1 } }];
            mockPrisma.serviceCategory.findMany.mockResolvedValue(mockCategories);

            await serviceCategoryEntity.searchServiceCategories({ keyword: 'Test', status: 'INVALID_STATUS' });
            expect(mockPrisma.serviceCategory.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {
                    OR: [
                        { serviceCatName: { contains: 'Test', mode: 'insensitive' } },
                        { serviceCatDescription: { contains: 'Test', mode: 'insensitive' } },
                    ],
                    // No status filter should be applied
                },
            }));
            expect(consoleWarnSpy).toHaveBeenCalledWith("Invalid status value provided for search: INVALID_STATUS. Ignoring status filter.");
            consoleWarnSpy.mockRestore();
        });

        it('should return an empty array if no categories match', async () => {
            mockPrisma.serviceCategory.findMany.mockResolvedValue([]);
            const result = await serviceCategoryEntity.searchServiceCategories({ keyword: 'NonExistent' });
            expect(result).toEqual([]);
        });

        it('should return error on database failure', async () => {
            mockPrisma.serviceCategory.findMany.mockRejectedValue(new Error('DB error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceCategoryEntity.searchServiceCategories({ keyword: 'Test' });
            expect(result).toEqual({ error: { status: 500, message: 'Failed to search service categories.' } });
            consoleErrorSpy.mockRestore();
        });
    });

    describe('getAllServiceCategories', () => {
        it('should return all service categories', async () => {
            const mockCategories = [
                { id: 'cat1', serviceCatName: 'Cleaning', _count: { serviceListings: 5 } },
                { id: 'cat2', serviceCatName: 'Gardening', _count: { serviceListings: 3 } },
            ];
            mockPrisma.serviceCategory.findMany.mockResolvedValue(mockCategories);

            const result = await serviceCategoryEntity.getAllServiceCategories();
            expect(result).toEqual([
                { id: 'cat1', serviceCatName: 'Cleaning', _count: { serviceListings: 5 }, numOfServiceListings: 5 },
                { id: 'cat2', serviceCatName: 'Gardening', _count: { serviceListings: 3 }, numOfServiceListings: 3 },
            ]);
            expect(mockPrisma.serviceCategory.findMany).toHaveBeenCalledWith({
                orderBy: { serviceCatName: 'asc' },
                include: { _count: { select: { serviceListings: true } } }
            });
        });

        it('should return error on database failure', async () => {
            mockPrisma.serviceCategory.findMany.mockRejectedValue(new Error('DB error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceCategoryEntity.getAllServiceCategories();
            expect(result).toEqual({ error: { status: 500, message: 'Failed to retrieve service categories.' } });
            consoleErrorSpy.mockRestore();
        });
    });

    describe('getCategoryDetailsById', () => {
        it('should return category details for a valid ID', async () => {
            const mockCategory = {
                id: 'cat1',
                serviceCatName: 'Plumbing',
                serviceCatDescription: 'Fixing leaks',
                status: ServiceCategoryStatus.ACTIVE,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(mockCategory);
            mockPrisma.serviceListing.count.mockResolvedValue(3); // 3 active listings

            const result = await serviceCategoryEntity.getCategoryDetailsById('cat1');
            expect(result).toEqual({
                serviceCatID: 'cat1',
                serviceCatName: 'Plumbing',
                serviceCatDescription: 'Fixing leaks',
                status: ServiceCategoryStatus.ACTIVE,
                createdAt: mockCategory.createdAt,
                updatedAt: mockCategory.updatedAt,
                numOfServiceListings: 3,
            });
            expect(mockPrisma.serviceListing.count).toHaveBeenCalledWith({
                where: { serviceCategoryId: 'cat1', status: ServiceListingStatus.ACTIVE }
            });
        });

        it('should return error if category not found', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(null);
            const result = await serviceCategoryEntity.getCategoryDetailsById('nonexistent');
            expect(result).toEqual({ error: { status: 404, message: 'Service category not found.' } });
        });

        it('should return error on database failure', async () => {
            mockPrisma.serviceCategory.findUnique.mockRejectedValue(new Error('DB error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await serviceCategoryEntity.getCategoryDetailsById('cat1');
            expect(result).toEqual({ error: { status: 500, message: 'System error while retrieving category details.' } });
            consoleErrorSpy.mockRestore();
        });
    });

    describe('updateServiceCategory', () => {
        const categoryId = 'cat1';
        const currentCategory = {
            id: categoryId,
            serviceCatName: 'Old Name',
            serviceCatDescription: 'Old Desc',
            status: ServiceCategoryStatus.ACTIVE,
        };

        it('should update a service category successfully', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(currentCategory);
            mockPrisma.serviceCategory.findFirst.mockResolvedValue(null); // No conflict with new name
            mockPrisma.serviceCategory.update.mockResolvedValue({
                id: categoryId,
                serviceCatName: 'New Name',
                serviceCatDescription: 'New Desc',
                status: ServiceCategoryStatus.INACTIVE,
            });

            const result = await serviceCategoryEntity.updateServiceCategory(categoryId, {
                serviceCatName: ' New Name ',
                serviceCatDescription: ' New Desc ',
                status: ServiceCategoryStatus.INACTIVE,
            });
            expect(result).toEqual({
                serviceCatID: categoryId,
                serviceCatName: 'New Name',
                serviceCatDescription: 'New Desc',
                status: ServiceCategoryStatus.INACTIVE,
            });
            expect(mockPrisma.serviceCategory.update).toHaveBeenCalledWith({
                where: { id: categoryId },
                data: {
                    serviceCatName: 'New Name',
                    serviceCatDescription: 'New Desc',
                    status: ServiceCategoryStatus.INACTIVE,
                },
            });
        });

        it('should return error if category to update is not found', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(null);
            const result = await serviceCategoryEntity.updateServiceCategory('nonexistent', { serviceCatName: 'Fail' });
            expect(result).toEqual({ error: { status: 404, message: 'Service category not found.' } });
        });

        it('should return error if new service category name already exists', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(currentCategory);
            mockPrisma.serviceCategory.findFirst.mockResolvedValue({ id: 'cat2', serviceCatName: 'New Name' }); // Name conflict

            const result = await serviceCategoryEntity.updateServiceCategory(categoryId, { serviceCatName: 'New Name' });
            expect(result).toEqual({ error: { status: 409, message: 'Service Category Already Exists!' } });
        });
        
        it('should allow updating description to null', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(currentCategory);
            mockPrisma.serviceCategory.update.mockResolvedValue({ ...currentCategory, serviceCatDescription: null });

            const result = await serviceCategoryEntity.updateServiceCategory(categoryId, { serviceCatDescription: null });
            expect(result.serviceCatDescription).toBeNull();
            expect(mockPrisma.serviceCategory.update).toHaveBeenCalledWith({
                where: { id: categoryId },
                data: { serviceCatDescription: null },
            });
        });

        it('should return error for invalid status value', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(currentCategory);
            const result = await serviceCategoryEntity.updateServiceCategory(categoryId, { status: 'INVALID_STATUS' });
            expect(result).toEqual({ error: { status: 400, message: 'Invalid status value: INVALID_STATUS.' } });
        });


        it('should return error on database failure during update', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(currentCategory);
            mockPrisma.serviceCategory.update.mockRejectedValue(new Error('DB update error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await serviceCategoryEntity.updateServiceCategory(categoryId, { serviceCatName: 'New Name' });
            expect(result).toEqual({ error: { status: 500, message: 'System error while updating service category.' } });
            consoleErrorSpy.mockRestore();
        });
    });

    describe('suspendServiceCategory', () => {
        const categoryId = 'cat1';

        it('should suspend an active category successfully', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue({ id: categoryId, status: ServiceCategoryStatus.ACTIVE });
            mockPrisma.serviceListing.count.mockResolvedValue(0); // No active listings
            mockPrisma.serviceCategory.update.mockResolvedValue({ id: categoryId, status: ServiceCategoryStatus.INACTIVE });

            const result = await serviceCategoryEntity.suspendServiceCategory(categoryId);
            expect(result).toBe(true);
            expect(mockPrisma.serviceCategory.update).toHaveBeenCalledWith({
                where: { id: categoryId },
                data: { status: ServiceCategoryStatus.INACTIVE },
            });
        });

        it('should activate an inactive category successfully', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue({ id: categoryId, status: ServiceCategoryStatus.INACTIVE });
            // No need to check listings count when activating
            mockPrisma.serviceCategory.update.mockResolvedValue({ id: categoryId, status: ServiceCategoryStatus.ACTIVE });

            const result = await serviceCategoryEntity.suspendServiceCategory(categoryId);
            expect(result).toBe(true);
            expect(mockPrisma.serviceCategory.update).toHaveBeenCalledWith({
                where: { id: categoryId },
                data: { status: ServiceCategoryStatus.ACTIVE },
            });
        });

        it('should return error if category to suspend is not found', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue(null);
            const result = await serviceCategoryEntity.suspendServiceCategory('nonexistent');
            expect(result).toEqual({ error: { status: 404, message: 'Service category not found.' } });
        });

        it('should return error if trying to suspend an active category with active listings', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue({ id: categoryId, status: ServiceCategoryStatus.ACTIVE });
            mockPrisma.serviceListing.count.mockResolvedValue(2); // 2 active listings

            const result = await serviceCategoryEntity.suspendServiceCategory(categoryId);
            expect(result).toEqual({
                error: { status: 400, message: 'Cannot deactivate category: Used by 2 active service listing(s).' },
            });
        });

        it('should return error on database failure during suspend', async () => {
            mockPrisma.serviceCategory.findUnique.mockResolvedValue({ id: categoryId, status: ServiceCategoryStatus.ACTIVE });
            mockPrisma.serviceListing.count.mockResolvedValue(0);
            mockPrisma.serviceCategory.update.mockRejectedValue(new Error('DB update error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await serviceCategoryEntity.suspendServiceCategory(categoryId);
            expect(result).toEqual({ error: { status: 500, message: 'System error while toggling category status.' } });
            consoleErrorSpy.mockRestore();
        });
    });
});
