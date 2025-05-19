const {
    CreateServiceCatController,
    ViewServiceCategoriesController,
    SearchServiceCatController,
    ViewServiceCatController,
    EditServiceCatController,
    SuspendServiceCatController
} = require('../../src/controllers/serviceCategoryController');
const ServiceCategoryEntity = require('../../src/entities/serviceCategoryEntity');

// Import the actual enum from Prisma
const { ServiceCategoryStatus: ActualServiceCategoryStatus } = require('../../src/generated/prisma');

// Make ServiceCategoryStatus globally available for the controller code during tests
// This is a workaround because we cannot modify the controller file itself.
global.ServiceCategoryStatus = ActualServiceCategoryStatus;

// Mock ServiceCategoryEntity
jest.mock('../../src/entities/serviceCategoryEntity');

describe('Service Category Controllers', () => {
    let mockRequest;
    let mockResponse;
    let serviceCategoryEntityInstance;

    beforeEach(() => {
        ServiceCategoryEntity.mockClear();
        serviceCategoryEntityInstance = new ServiceCategoryEntity(); // Get the mocked instance

        mockRequest = (body = {}, query = {}, params = {}) => ({
            body,
            query,
            params,
        });

        mockResponse = () => {
            const res = {};
            res.status = jest.fn().mockReturnValue(res);
            res.json = jest.fn().mockReturnValue(res);
            return res;
        };
    });

    describe('CreateServiceCatController', () => {
        let controller;
        beforeEach(() => {
            controller = new CreateServiceCatController();
            controller.serviceCategoryEntity = serviceCategoryEntityInstance;
        });

        it('should create a service category and return 201', async () => {
            const reqBody = { serviceCatName: 'New Category', serviceCatDescription: 'Desc' };
            serviceCategoryEntityInstance.createServiceCategory.mockResolvedValue(true); // Entity returns true on success
            const req = mockRequest(reqBody);
            const res = mockResponse();

            await controller.createServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(true); // Controller returns what entity returned
            expect(serviceCategoryEntityInstance.createServiceCategory).toHaveBeenCalledWith(reqBody.serviceCatName, reqBody.serviceCatDescription);
        });

        it('should return error if entity fails to create category', async () => {
            const reqBody = { serviceCatName: 'Fail Category' };
            const errorResponse = { error: { status: 409, message: 'Category Exists!' } };
            serviceCategoryEntityInstance.createServiceCategory.mockResolvedValue(errorResponse);
            const req = mockRequest(reqBody);
            const res = mockResponse();

            await controller.createServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(errorResponse.error.status);
            expect(res.json).toHaveBeenCalledWith({ error: errorResponse.error.message });
        });
    });

    describe('ViewServiceCategoriesController', () => {
        let controller;
        beforeEach(() => {
            controller = new ViewServiceCategoriesController();
            controller.serviceCategoryEntity = serviceCategoryEntityInstance;
        });

        it('should get all service categories and return 200', async () => {
            const mockCategories = [{ id: '1', name: 'Cat 1' }];
            serviceCategoryEntityInstance.getAllServiceCategories.mockResolvedValue(mockCategories);
            const req = mockRequest();
            const res = mockResponse();

            await controller.getAllServiceCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockCategories);
        });

        it('should return error if entity fails to get categories', async () => {
            const errorResponse = { error: { status: 500, message: 'DB Error' } };
            serviceCategoryEntityInstance.getAllServiceCategories.mockResolvedValue(errorResponse);
            const req = mockRequest();
            const res = mockResponse();

            await controller.getAllServiceCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(errorResponse.error.status);
            expect(res.json).toHaveBeenCalledWith({ error: errorResponse.error.message });
        });
    });

    describe('SearchServiceCatController', () => {
        let controller;
        beforeEach(() => {
            controller = new SearchServiceCatController();
            controller.serviceCategoryEntity = serviceCategoryEntityInstance;
        });

        it('should search categories with keyword and status, return 200', async () => {
            const queryParams = { keyword: 'Clean', status: 'ACTIVE' };
            const mockResults = [{ id: '1', name: 'Cleaning' }];
            serviceCategoryEntityInstance.searchServiceCategories.mockResolvedValue(mockResults);
            const req = mockRequest({}, queryParams);
            const res = mockResponse();

            await controller.searchServiceCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResults);
            expect(serviceCategoryEntityInstance.searchServiceCategories).toHaveBeenCalledWith({
                keyword: queryParams.keyword,
                status: ActualServiceCategoryStatus.ACTIVE, // Use the imported ActualServiceCategoryStatus for the test's expectation
            });
        });

        it('should call getAllServiceCategories if no query params provided', async () => {
            const mockAllCategories = [{ id: 'all1', name: 'All Cat 1' }];
            serviceCategoryEntityInstance.getAllServiceCategories.mockResolvedValue(mockAllCategories);
            const req = mockRequest({}, {}); // No query
            const res = mockResponse();

            await controller.searchServiceCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAllCategories);
            expect(serviceCategoryEntityInstance.getAllServiceCategories).toHaveBeenCalled();
        });
        
        it('should return 200 with message if no categories match search', async () => {
            const queryParams = { keyword: 'NonExistent' };
            serviceCategoryEntityInstance.searchServiceCategories.mockResolvedValue([]); // Empty array from entity
            const req = mockRequest({}, queryParams);
            const res = mockResponse();

            await controller.searchServiceCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "No matching categories found", categories: [] });
        });

        it('should return error if entity fails search', async () => {
            const queryParams = { keyword: 'ErrorProne' };
            const errorResponse = { error: { status: 500, message: 'Search DB Error' } };
            serviceCategoryEntityInstance.searchServiceCategories.mockResolvedValue(errorResponse);
            const req = mockRequest({}, queryParams);
            const res = mockResponse();

            await controller.searchServiceCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(errorResponse.error.status);
            expect(res.json).toHaveBeenCalledWith({ error: errorResponse.error.message });
        });
    });

    describe('ViewServiceCatController', () => {
        let controller;
        beforeEach(() => {
            controller = new ViewServiceCatController();
            controller.serviceCategoryEntity = serviceCategoryEntityInstance;
        });

        it('should get category details by ID and return 200', async () => {
            const categoryId = 'cat123';
            const mockDetails = { serviceCatID: categoryId, name: 'Details' };
            serviceCategoryEntityInstance.getCategoryDetailsById.mockResolvedValue(mockDetails);
            const req = mockRequest({}, {}, { id: categoryId });
            const res = mockResponse();

            await controller.getCategoryDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockDetails);
            expect(serviceCategoryEntityInstance.getCategoryDetailsById).toHaveBeenCalledWith(categoryId);
        });

        it('should return 404 if category not found by entity', async () => {
            const categoryId = 'notfound';
            const errorResponse = { error: { status: 404, message: 'Not Found' } };
            serviceCategoryEntityInstance.getCategoryDetailsById.mockResolvedValue(errorResponse);
            const req = mockRequest({}, {}, { id: categoryId });
            const res = mockResponse();

            await controller.getCategoryDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Service category not found." });
        });

        it('should return 500 for other entity errors', async () => {
            const categoryId = 'errorId';
            const errorResponse = { error: { status: 500, message: 'DB Error' } };
            serviceCategoryEntityInstance.getCategoryDetailsById.mockResolvedValue(errorResponse);
            const req = mockRequest({}, {}, { id: categoryId });
            const res = mockResponse();

            await controller.getCategoryDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Unable to retrieve category details. Please try again!" });
        });
    });

    describe('EditServiceCatController', () => {
        let controller;
        beforeEach(() => {
            controller = new EditServiceCatController();
            controller.serviceCategoryEntity = serviceCategoryEntityInstance;
        });

        it('should update category and return 200 with updated data', async () => {
            const categoryId = 'edit123';
            const reqBody = { serviceCatName: 'Updated Name', status: 'INACTIVE' };
            const mockUpdatedCategory = { serviceCatID: categoryId, ...reqBody };
            serviceCategoryEntityInstance.updateServiceCategory.mockResolvedValue(mockUpdatedCategory);
            const req = mockRequest(reqBody, {}, { id: categoryId });
            const res = mockResponse();

            await controller.updateServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUpdatedCategory);
            expect(serviceCategoryEntityInstance.updateServiceCategory).toHaveBeenCalledWith(categoryId, reqBody);
        });

        it('should return 409 if entity reports name conflict', async () => {
            const categoryId = 'conflict123';
            const reqBody = { serviceCatName: 'Conflicting Name' };
            const errorResponse = { error: { status: 409, message: 'Service Category Already Exists!' } };
            serviceCategoryEntityInstance.updateServiceCategory.mockResolvedValue(errorResponse);
            const req = mockRequest(reqBody, {}, { id: categoryId });
            const res = mockResponse();

            await controller.updateServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: errorResponse.error.message });
        });
        
        it('should return 404 if entity reports category not found for update', async () => {
            const categoryId = 'notfoundUpdate';
            const reqBody = { serviceCatName: 'Some Name' };
            const errorResponse = { error: { status: 404, message: 'Not Found' } }; // Entity's specific message
            serviceCategoryEntityInstance.updateServiceCategory.mockResolvedValue(errorResponse);
            const req = mockRequest(reqBody, {}, { id: categoryId });
            const res = mockResponse();

            await controller.updateServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            // Controller has specific message for 404 on update
            expect(res.json).toHaveBeenCalledWith({ error: "Unable to retrieve category details. Please try again!" });
        });

        it('should return 500 for other entity errors during update', async () => {
            const categoryId = 'errorUpdate';
            const reqBody = { serviceCatName: 'Error Name' };
            const errorResponse = { error: { status: 500, message: 'Generic DB Error' } };
            serviceCategoryEntityInstance.updateServiceCategory.mockResolvedValue(errorResponse);
            const req = mockRequest(reqBody, {}, { id: categoryId });
            const res = mockResponse();

            await controller.updateServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorResponse.error.message });
        });
    });

    describe('SuspendServiceCatController', () => {
        let controller;
        beforeEach(() => {
            controller = new SuspendServiceCatController();
            controller.serviceCategoryEntity = serviceCategoryEntityInstance;
        });

        it('should suspend/activate category and return 200 with success message', async () => {
            const categoryId = 'suspend123';
            serviceCategoryEntityInstance.suspendServiceCategory.mockResolvedValue(true); // Entity returns true on success
            const req = mockRequest({}, {}, { id: categoryId });
            const res = mockResponse();

            await controller.suspendServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Category status toggled successfully' });
            expect(serviceCategoryEntityInstance.suspendServiceCategory).toHaveBeenCalledWith(categoryId);
        });

        it('should return error status and message if entity fails to suspend', async () => {
            const categoryId = 'failSuspend';
            const errorResponse = { error: { status: 400, message: 'Cannot suspend, active listings.' } };
            serviceCategoryEntityInstance.suspendServiceCategory.mockResolvedValue(errorResponse);
            const req = mockRequest({}, {}, { id: categoryId });
            const res = mockResponse();

            await controller.suspendServiceCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(errorResponse.error.status);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: errorResponse.error.message });
        });
    });
});
