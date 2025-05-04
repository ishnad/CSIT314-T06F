const { CreateServiceListingController } = require('../../src/controllers/serviceListingController');
const ServiceListingEntity = require('../../src/entities/serviceListingEntity');

// Mock the ServiceListingEntity
jest.mock('../../src/entities/serviceListingEntity');

// --- Mock Express Request/Response ---
const mockRequest = (body = {}, user = null) => ({ // Add user to mock request
    body,
    user,
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