const {
    CreateServiceListingController,
    GetServiceListingController,
    EditServiceListingController,
    SuspendServiceListingController,
    SearchServiceListingsController
} = require('../../src/controllers/serviceListingController');
const ServiceListingEntity = require('../../src/entities/serviceListingEntity');

// Mock the ServiceListingEntity
jest.mock('../../src/entities/serviceListingEntity');

// --- Mock Express Request/Response ---
const mockRequest = (body = {}, user = null, params = {}, query = {}) => ({ // Add query for query parameters
    body,
    user,
    params,
    query, // Assign the query object to req.query
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// --- Test Suite ---
describe('CreateServiceListingController', () => {
    let controller;
    let req;
    let res;
    const mockCleanerUser = { // Mock authenticated cleaner user
        id: 'cleaner-user-id-xyz',
        username: 'testCleaner',
        profile: { name: 'Cleaner' }
    };
     const mockHomeownerUser = { // Mock authenticated non-cleaner user
        id: 'homeowner-user-id-123',
        username: 'testHomeowner',
        profile: { name: 'Homeowner' }
    };
    const listingDataBody = {
        serviceType: 'Basic Cleaning',
        title: 'Standard House Clean',
        description: 'Floors, surfaces, bathrooms.',
        ratePerHr: '20.0', // String input from body
    };
    const listingDataEntityArg = { // Data expected by entity
        serviceType: listingDataBody.serviceType,
        title: listingDataBody.title,
        description: listingDataBody.description,
        ratePerHr: 20.0, // Parsed number
        cleanerId: mockCleanerUser.id, // ID from authenticated user
    };
    const createdListing = { // Mock successful result from entity
        id: 'listing-new-id-456',
        serviceType: listingDataEntityArg.serviceType,
        title: listingDataEntityArg.title,
        description: listingDataEntityArg.description,
        ratePerHr: listingDataEntityArg.ratePerHr,
        createdAt: new Date(),
        cleanerId: mockCleanerUser.id,
        cleanerUsername: mockCleanerUser.username,
    };


    beforeEach(() => {
        jest.clearAllMocks();
        ServiceListingEntity.mockClear();
        // Mock the entity method
        ServiceListingEntity.prototype.createServiceListing = jest.fn();
        controller = new CreateServiceListingController();
        res = mockResponse();
    });

    it('should create listing successfully for an authenticated Cleaner', async () => {
        req = mockRequest(listingDataBody, mockCleanerUser); // Pass cleaner user
        ServiceListingEntity.prototype.createServiceListing.mockResolvedValue(createdListing);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).toHaveBeenCalledWith(listingDataEntityArg);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Service listing created successfully.',
            listing: createdListing
        });
    });

    it('should return 401 if user is not authenticated', async () => {
        req = mockRequest(listingDataBody, null); // No user attached

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
    });

     it('should return 403 if authenticated user is not a Cleaner', async () => {
        req = mockRequest(listingDataBody, mockHomeownerUser); // Pass non-cleaner user

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can create service listings.' });
    });

    it('should return 400 if required fields are missing in request body', async () => {
        const incompleteBody = { ...listingDataBody, title: undefined };
        req = mockRequest(incompleteBody, mockCleanerUser); // Authenticated as Cleaner

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields in request body: serviceType, title, description, ratePerHr.' });
    });

     it('should return 400 if ratePerHr is not a valid number string', async () => {
        const invalidRateBody = { ...listingDataBody, ratePerHr: 'abc' };
        req = mockRequest(invalidRateBody, mockCleanerUser);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ratePerHr must be a valid number.' });
    });


    it('should return error from entity if creation fails (e.g., validation error)', async () => {
        req = mockRequest(listingDataBody, mockCleanerUser);
        const errorResponse = { error: { status: 400, error: 'Service Type must be a non-empty string.' } }; // Example error
        ServiceListingEntity.prototype.createServiceListing.mockResolvedValue(errorResponse);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).toHaveBeenCalledWith(listingDataEntityArg);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Service Type must be a non-empty string.' });
    });

     it('should return error from entity if creation fails (e.g., cleaner not found)', async () => {
        req = mockRequest(listingDataBody, mockCleanerUser);
        const errorResponse = { error: { status: 404, error: `User with ID ${mockCleanerUser.id} not found.` } };
        ServiceListingEntity.prototype.createServiceListing.mockResolvedValue(errorResponse);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).toHaveBeenCalledWith(listingDataEntityArg);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: `User with ID ${mockCleanerUser.id} not found.` });
    });

    it('should return 500 on unexpected controller error', async () => {
        req = mockRequest(listingDataBody, mockCleanerUser);
        const error = new Error("Something broke badly");
        ServiceListingEntity.prototype.createServiceListing.mockRejectedValue(error);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.createServiceListing(req, res);
        consoleErrorSpy.mockRestore();

        expect(ServiceListingEntity.prototype.createServiceListing).toHaveBeenCalledWith(listingDataEntityArg);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while creating the service listing.' });
    });
});


// --- Test Suite for GetServiceListingController ---
describe('GetServiceListingController', () => {
    let controller;
    let req;
    let res;
    const listingId = 'listing-abc-123';
    const mockCleanerOwner = { // Mock authenticated cleaner who owns the listing
        id: 'cleaner-user-id-owner',
        username: 'testCleanerOwner',
        profile: { name: 'Cleaner' }
    };
     const mockOtherUser = { // Mock another authenticated user (could be cleaner or homeowner)
        id: 'other-user-id-456',
        username: 'testOtherUser',
        profile: { name: 'Homeowner' } // Profile doesn't strictly matter for this controller test
    };
    const mockListingData = { // Data returned successfully by the entity
        id: listingId,
        serviceType: 'Deep Clean',
        title: 'Spring Cleaning Special',
        description: 'Full house deep clean.',
        ratePerHr: 35.0,
        createdAt: new Date(),
        cleanerId: mockCleanerOwner.id, // Belongs to the owner
        cleanerUsername: mockCleanerOwner.username,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Ensure the prototype method is mocked if it wasn't already
        if (!ServiceListingEntity.prototype.getListingDetails) {
             ServiceListingEntity.prototype.getListingDetails = jest.fn();
        }
        ServiceListingEntity.mockClear(); // Clear constructor mocks
        ServiceListingEntity.prototype.getListingDetails.mockClear(); // Clear method mocks

        controller = new GetServiceListingController();
        res = mockResponse();
    });

    it('should return listing details successfully for the authenticated owner', async () => {
        req = mockRequest({}, mockCleanerOwner, { id: listingId }); // User is owner, params has ID
        ServiceListingEntity.prototype.getListingDetails.mockResolvedValue(mockListingData);

        await controller.getListingDetails(req, res);

        expect(ServiceListingEntity.prototype.getListingDetails).toHaveBeenCalledWith(listingId, mockCleanerOwner.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Service listing details retrieved successfully.',
            listing: mockListingData
        });
    });

    it('should return 401 if user is not authenticated', async () => {
        req = mockRequest({}, null, { id: listingId }); // No user attached

        await controller.getListingDetails(req, res);

        expect(ServiceListingEntity.prototype.getListingDetails).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
    });

     it('should return 400 if listing ID is missing from params', async () => {
        req = mockRequest({}, mockCleanerOwner, {}); // No id in params

        await controller.getListingDetails(req, res);

        expect(ServiceListingEntity.prototype.getListingDetails).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Listing ID is required in the URL path.' });
    });


    it('should return 404 if entity reports listing not found', async () => {
        req = mockRequest({}, mockCleanerOwner, { id: listingId });
        const errorResponse = { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };
        ServiceListingEntity.prototype.getListingDetails.mockResolvedValue(errorResponse);

        await controller.getListingDetails(req, res);

        expect(ServiceListingEntity.prototype.getListingDetails).toHaveBeenCalledWith(listingId, mockCleanerOwner.id);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: `Service listing with ID ${listingId} not found.` });
    });

    it('should return 403 if entity reports user does not own the listing', async () => {
        req = mockRequest({}, mockOtherUser, { id: listingId }); // Authenticated as someone else
        const errorResponse = { error: { status: 403, error: 'Forbidden: You do not have permission to view this listing.' } };
        // Mock the entity call for *this specific user* returning the forbidden error
        ServiceListingEntity.prototype.getListingDetails.mockImplementation(async (lId, userId) => {
            if (lId === listingId && userId === mockOtherUser.id) {
                return errorResponse;
            }
            return {}; // Default mock return for other cases if needed
        });


        await controller.getListingDetails(req, res);

        expect(ServiceListingEntity.prototype.getListingDetails).toHaveBeenCalledWith(listingId, mockOtherUser.id);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: You do not have permission to view this listing.' });
    });

     it('should return 400 if entity reports invalid listing ID format', async () => {
        const invalidId = 'bad-id';
        req = mockRequest({}, mockCleanerOwner, { id: invalidId });
        const errorResponse = { error: { status: 400, error: 'Invalid listing ID format.' } };
        ServiceListingEntity.prototype.getListingDetails.mockResolvedValue(errorResponse);

        await controller.getListingDetails(req, res);

        expect(ServiceListingEntity.prototype.getListingDetails).toHaveBeenCalledWith(invalidId, mockCleanerOwner.id);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid listing ID format.' });
    });


    it('should return 500 on unexpected controller error', async () => {
        req = mockRequest({}, mockCleanerOwner, { id: listingId });
        const error = new Error("Something broke badly in the controller");
        // Make the entity call itself throw an error
        ServiceListingEntity.prototype.getListingDetails.mockRejectedValue(error);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.getListingDetails(req, res);
        consoleErrorSpy.mockRestore();

        expect(ServiceListingEntity.prototype.getListingDetails).toHaveBeenCalledWith(listingId, mockCleanerOwner.id);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while retrieving the service listing.' });
    });
});

// --- Test Suite for EditServiceListingController ---
describe('EditServiceListingController', () => {
    let controller;
    let req;
    let res;
    const listingId = 'listing-to-edit-xyz';
    const mockCleanerUser = {
        id: 'cleaner-user-id-abc',
        username: 'editorCleaner',
        profile: { name: 'Cleaner' }
    };
    const mockNonCleanerUser = {
        id: 'homeowner-user-id-def',
        username: 'editorHomeowner',
        profile: { name: 'Homeowner' }
    };
    const validUpdateBody = {
        serviceType: 'Gardening',
        description: 'Lawn mowing and hedge trimming.',
        ratePerHr: '40.50', // String from body
    };
    const expectedEntityUpdateData = {
        serviceType: validUpdateBody.serviceType,
        description: validUpdateBody.description,
        ratePerHr: 40.50, // Parsed number
    };
    // Entity now returns true, not the listing object
    // const mockUpdatedListing = { ... }; 

    beforeEach(() => {
        jest.clearAllMocks();
        ServiceListingEntity.mockClear();
        // Mock the entity method for editing
        ServiceListingEntity.prototype.editServiceListing = jest.fn();
        controller = new EditServiceListingController(); // Use the correct imported class
        res = mockResponse();
    });

    it('should edit listing successfully for an authenticated Cleaner and return success message', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, { id: listingId });
        ServiceListingEntity.prototype.editServiceListing.mockResolvedValue(true); // Entity returns true

        await controller.editServiceListing(req, res);

        expect(ServiceListingEntity.prototype.editServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id, expectedEntityUpdateData);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Service listing updated successfully.' // No listing object in response
        });
    });
    
    it('should handle partial updates (only description and ratePerHr) and return success message', async () => {
        const partialBody = { description: "New Desc", ratePerHr: "55" };
        const expectedPartialEntityData = { description: "New Desc", ratePerHr: 55 };
        // const mockPartialUpdatedListing = { ...mockUpdatedListing, ...expectedPartialEntityData }; // Not needed
        req = mockRequest(partialBody, mockCleanerUser, { id: listingId });
        ServiceListingEntity.prototype.editServiceListing.mockResolvedValue(true); // Entity returns true

        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id, expectedPartialEntityData);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Service listing updated successfully.' }); // No listing object
    });


    it('should return 401 if user is not authenticated', async () => {
        req = mockRequest(validUpdateBody, null, { id: listingId });
        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
    });

    it('should return 403 if authenticated user is not a Cleaner', async () => {
        req = mockRequest(validUpdateBody, mockNonCleanerUser, { id: listingId });
        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can edit service listings.' });
    });

    it('should return 400 if listing ID is missing from params', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, {}); // No id in params
        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Listing ID is required in the URL path.' });
    });

    it('should return 400 if no editable fields are provided in request body', async () => {
        req = mockRequest({}, mockCleanerUser, { id: listingId }); // Empty body
        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No fields provided for update. Please provide serviceType, description, or ratePerHr.' });
    });
    
    it('should return 400 if ratePerHr is not a valid number string', async () => {
        const invalidRateBody = { ...validUpdateBody, ratePerHr: 'abc' };
        req = mockRequest(invalidRateBody, mockCleanerUser, { id: listingId });
        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ratePerHr must be a valid number.' });
    });

    it('should return error from entity if editing fails (e.g., validation error in entity)', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, { id: listingId });
        const errorResponse = { error: { status: 400, error: 'Rate per hour must be a positive number.' } }; // Example error
        ServiceListingEntity.prototype.editServiceListing.mockResolvedValue(errorResponse);

        await controller.editServiceListing(req, res);
        expect(ServiceListingEntity.prototype.editServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id, expectedEntityUpdateData);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Rate per hour must be a positive number.' });
    });

    it('should return 404 if entity reports listing not found', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, { id: listingId });
        const errorResponse = { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };
        ServiceListingEntity.prototype.editServiceListing.mockResolvedValue(errorResponse);
        await controller.editServiceListing(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: `Service listing with ID ${listingId} not found.` });
    });
    
    it('should return 403 if entity reports user does not own the listing', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, { id: listingId });
        const errorResponse = { error: { status: 403, error: 'Forbidden: You do not have permission to edit this listing.' } };
        ServiceListingEntity.prototype.editServiceListing.mockResolvedValue(errorResponse);
        await controller.editServiceListing(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: You do not have permission to edit this listing.' });
    });

    it('should return 500 on unexpected controller error', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, { id: listingId });
        const error = new Error("Critical failure");
        ServiceListingEntity.prototype.editServiceListing.mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.editServiceListing(req, res);
        consoleErrorSpy.mockRestore();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while editing the service listing.' });
    });

    it('should return 500 if entity returns an unexpected non-error, non-true value', async () => {
        req = mockRequest(validUpdateBody, mockCleanerUser, { id: listingId });
        ServiceListingEntity.prototype.editServiceListing.mockResolvedValue("unexpected string"); // Simulate unexpected return

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.editServiceListing(req, res);
        consoleErrorSpy.mockRestore();

        expect(ServiceListingEntity.prototype.editServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id, expectedEntityUpdateData);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while editing the service listing.' });
    });
});

// --- Test Suite for SuspendServiceListingController ---
describe('SuspendServiceListingController', () => {
    let controller;
    let req;
    let res;
    const listingId = 'listing-to-suspend-abc';
    const mockCleanerUser = {
        id: 'cleaner-user-id-suspend',
        username: 'suspenderCleaner',
        profile: { name: 'Cleaner' }
    };
    const mockNonCleanerUser = {
        id: 'homeowner-user-id-suspend',
        username: 'suspenderHomeowner',
        profile: { name: 'Homeowner' }
    };
    // Entity now returns true, not the listing object
    // const mockSuspendedListingData = { ... };

    beforeEach(() => {
        jest.clearAllMocks();
        ServiceListingEntity.mockClear();
        // Mock the entity method for suspending
        ServiceListingEntity.prototype.suspendServiceListing = jest.fn();
        controller = new SuspendServiceListingController(); // Use the correct imported class
        res = mockResponse();
    });

    it('should suspend listing successfully for an authenticated Cleaner and return success message', async () => {
        req = mockRequest({}, mockCleanerUser, { id: listingId });
        ServiceListingEntity.prototype.suspendServiceListing.mockResolvedValue(true); // Entity returns true

        await controller.suspendServiceListing(req, res);

        expect(ServiceListingEntity.prototype.suspendServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Service listing suspended successfully.' // No listing object in response
        });
    });

    it('should return 401 if user is not authenticated', async () => {
        req = mockRequest({}, null, { id: listingId });
        await controller.suspendServiceListing(req, res);
        expect(ServiceListingEntity.prototype.suspendServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required.' });
    });

    it('should return 403 if authenticated user is not a Cleaner', async () => {
        req = mockRequest({}, mockNonCleanerUser, { id: listingId });
        await controller.suspendServiceListing(req, res);
        expect(ServiceListingEntity.prototype.suspendServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can suspend service listings.' });
    });

    it('should return 400 if listing ID is missing from params', async () => {
        req = mockRequest({}, mockCleanerUser, {}); // No id in params
        await controller.suspendServiceListing(req, res);
        expect(ServiceListingEntity.prototype.suspendServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Listing ID is required in the URL path.' });
    });

    it('should return error from entity if suspending fails (e.g., listing not found)', async () => {
        req = mockRequest({}, mockCleanerUser, { id: listingId });
        const errorResponse = { error: { status: 404, error: `Service listing with ID ${listingId} not found.` } };
        ServiceListingEntity.prototype.suspendServiceListing.mockResolvedValue(errorResponse);

        await controller.suspendServiceListing(req, res);
        expect(ServiceListingEntity.prototype.suspendServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: `Service listing with ID ${listingId} not found.` });
    });
    
    it('should return 400 if entity reports listing already suspended', async () => {
        req = mockRequest({}, mockCleanerUser, { id: listingId });
        const errorResponse = { error: { status: 400, error: 'Service listing is already suspended.' } };
        ServiceListingEntity.prototype.suspendServiceListing.mockResolvedValue(errorResponse);
        await controller.suspendServiceListing(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Service listing is already suspended.' });
    });

    it('should return 500 on unexpected controller error', async () => {
        req = mockRequest({}, mockCleanerUser, { id: listingId });
        const error = new Error("Critical failure during suspension");
        ServiceListingEntity.prototype.suspendServiceListing.mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.suspendServiceListing(req, res);
        consoleErrorSpy.mockRestore();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while suspending the service listing.' });
    });

    it('should return 500 if entity returns an unexpected non-error, non-true value', async () => {
        req = mockRequest({}, mockCleanerUser, { id: listingId });
        ServiceListingEntity.prototype.suspendServiceListing.mockResolvedValue("unexpected string"); // Simulate unexpected return

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.suspendServiceListing(req, res);
        consoleErrorSpy.mockRestore();

        expect(ServiceListingEntity.prototype.suspendServiceListing).toHaveBeenCalledWith(listingId, mockCleanerUser.id);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while suspending the service listing.' });
    });
});

// --- Test Suite for SearchServiceListingsController ---
describe('SearchServiceListingsController', () => {
    let controller;
    let req;
    let res;
    const mockSearcherUser = {
        id: 'cleaner-user-id-searcher',
        username: 'searcherCleaner',
        profile: { name: 'Cleaner' }
    };
     const mockNonCleanerSearcherUser = {
        id: 'homeowner-user-id-searcher',
        username: 'searcherHomeowner',
        profile: { name: 'Homeowner' }
    };
    const mockSearchResults = [
        { id: 'listing1', title: 'Found Listing 1' },
        { id: 'listing2', title: 'Found Listing 2' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        ServiceListingEntity.mockClear();
        ServiceListingEntity.prototype.searchListings = jest.fn();
        controller = new SearchServiceListingsController(); // Use the correct imported class
        res = mockResponse();
    });

    it('should return search results successfully for an authenticated Cleaner', async () => {
        const queryParams = { keyword: 'clean', serviceType: 'Deep Clean' };
        req = mockRequest({}, mockSearcherUser, {}, queryParams);
        ServiceListingEntity.prototype.searchListings.mockResolvedValue(mockSearchResults);

        await controller.searchListings(req, res);

        expect(ServiceListingEntity.prototype.searchListings).toHaveBeenCalledWith(mockSearcherUser.id, queryParams);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSearchResults);
    });
    
    it('should parse numeric rates from query params', async () => {
        const queryParams = { minRate: '10.5', maxRate: '20' };
        const expectedFilters = { minRate: 10.5, maxRate: 20 };
        req = mockRequest({}, mockSearcherUser, {}, queryParams);
        ServiceListingEntity.prototype.searchListings.mockResolvedValue(mockSearchResults);

        await controller.searchListings(req, res);
        expect(ServiceListingEntity.prototype.searchListings).toHaveBeenCalledWith(mockSearcherUser.id, expectedFilters);
    });

    it('should pass through string filters like keyword and serviceType directly', async () => {
        const queryParams = { keyword: 'garden', serviceType: 'Gardening' };
        req = mockRequest({}, mockSearcherUser, {}, queryParams);
        ServiceListingEntity.prototype.searchListings.mockResolvedValue(mockSearchResults);

        await controller.searchListings(req, res);
        expect(ServiceListingEntity.prototype.searchListings).toHaveBeenCalledWith(mockSearcherUser.id, queryParams);
    });

    it('should return 400 if minRate is not a number', async () => {
        req = mockRequest({}, mockSearcherUser, {}, { minRate: 'abc' });
        await controller.searchListings(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'minRate must be a valid number.' });
    });
    
    it('should return 400 if maxRate is not a number', async () => {
        req = mockRequest({}, mockSearcherUser, {}, { maxRate: 'xyz' });
        await controller.searchListings(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'maxRate must be a valid number.' });
    });

    it('should return "No matching listings found." message if entity provides it', async () => {
        req = mockRequest({}, mockSearcherUser, {}, { keyword: 'nothing' });
        const noResultsResponse = { message: "No matching listings found." };
        ServiceListingEntity.prototype.searchListings.mockResolvedValue(noResultsResponse);

        await controller.searchListings(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(noResultsResponse);
    });

    it('should return 401 if user is not authenticated', async () => {
        req = mockRequest({}, null, {}, { keyword: 'any' });
        await controller.searchListings(req, res);
        expect(ServiceListingEntity.prototype.searchListings).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required to search listings.' });
    });
    
    it('should return 403 if user is not a Cleaner', async () => {
        req = mockRequest({}, mockNonCleanerSearcherUser, {}, { keyword: 'any' });
        await controller.searchListings(req, res);
        expect(ServiceListingEntity.prototype.searchListings).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Only Cleaners can perform this search.' });
    });

    it('should return error from entity if searching fails (e.g., maxRate < minRate in entity)', async () => {
        const queryParams = { minRate: '20', maxRate: '10' }; // Invalid range
        req = mockRequest({}, mockSearcherUser, {}, { minRate: 20, maxRate: 10 }); // Parsed numbers
        const entityErrorResponse = { error: { status: 400, error: 'Maximum rate cannot be less than minimum rate.' } };
        ServiceListingEntity.prototype.searchListings.mockResolvedValue(entityErrorResponse);

        await controller.searchListings(req, res);
        // Controller passes parsed numbers to entity
        expect(ServiceListingEntity.prototype.searchListings).toHaveBeenCalledWith(mockSearcherUser.id, { minRate: 20, maxRate: 10 });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Maximum rate cannot be less than minimum rate.' });
    });

    it('should return 500 on unexpected controller error', async () => {
        req = mockRequest({}, mockSearcherUser, {}, { keyword: 'test' });
        const error = new Error("Critical failure in search");
        ServiceListingEntity.prototype.searchListings.mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await controller.searchListings(req, res);
        consoleErrorSpy.mockRestore();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while searching service listings.' });
    });
});
