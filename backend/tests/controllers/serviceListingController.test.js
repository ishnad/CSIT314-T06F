const { CreateServiceListingController, GetServiceListingController } = require('../../src/controllers/serviceListingController');
const ServiceListingEntity = require('../../src/entities/serviceListingEntity');

// Mock the ServiceListingEntity
jest.mock('../../src/entities/serviceListingEntity');

// --- Mock Express Request/Response ---
const mockRequest = (body = {}, user = null, params = {}) => ({ // Add params for route parameters
    body,
    user,
    params,
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
        duration: '3.5', // String input from body
        availability: new Date().toISOString(),
    };
    const listingDataEntityArg = { // Data expected by entity
        serviceType: listingDataBody.serviceType,
        title: listingDataBody.title,
        description: listingDataBody.description,
        ratePerHr: 20.0, // Parsed number
        duration: 3.5, // Parsed number
        availability: listingDataBody.availability,
        cleanerId: mockCleanerUser.id, // ID from authenticated user
    };
    const createdListing = { // Mock successful result from entity
        id: 'listing-new-id-456',
        serviceType: listingDataEntityArg.serviceType,
        title: listingDataEntityArg.title,
        description: listingDataEntityArg.description,
        ratePerHr: listingDataEntityArg.ratePerHr,
        duration: listingDataEntityArg.duration,
        availability: new Date(listingDataEntityArg.availability),
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
        expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields in request body: serviceType, title, description, ratePerHr, duration, availability.' });
    });

     it('should return 400 if ratePerHr is not a valid number string', async () => {
        const invalidRateBody = { ...listingDataBody, ratePerHr: 'abc' };
        req = mockRequest(invalidRateBody, mockCleanerUser);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ratePerHr and duration must be valid numbers.' });
    });

     it('should return 400 if duration is not a valid number string', async () => {
        const invalidDurationBody = { ...listingDataBody, duration: 'three hours' };
        req = mockRequest(invalidDurationBody, mockCleanerUser);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'ratePerHr and duration must be valid numbers.' });
    });


    it('should return error from entity if creation fails (e.g., validation error)', async () => {
        req = mockRequest(listingDataBody, mockCleanerUser);
        const errorResponse = { error: { status: 400, error: 'Availability must be a valid ISO 8601 date string.' } };
        ServiceListingEntity.prototype.createServiceListing.mockResolvedValue(errorResponse);

        await controller.createServiceListing(req, res);

        expect(ServiceListingEntity.prototype.createServiceListing).toHaveBeenCalledWith(listingDataEntityArg);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Availability must be a valid ISO 8601 date string.' });
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
        duration: 4.0,
        availability: new Date(),
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