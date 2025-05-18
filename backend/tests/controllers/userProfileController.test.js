const {
    CreateUserProfileController,
    ViewUserProfileController,
    EditUserProfileController,
    SimulateUserProfileController,
    UpdateUserProfileStatusController,
    SearchUserProfileController
} = require('../../src/controllers/userProfileController');
const UserProfileEntity = require('../../src/entities/userProfileEntity');

// Mock UserProfileEntity
jest.mock('../../src/entities/userProfileEntity');

// Mock Express request and response objects
const mockRequest = (body = {}, params = {}, query = {}) => ({
    body,
    params,
    query,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserProfile Controllers', () => {
    let req;
    let res;

    beforeEach(() => {
        UserProfileEntity.mockClear(); // Clear mock constructor calls
        // Clear mock method calls for each instance if needed, or rely on new instance per controller
        if (UserProfileEntity.prototype.createUserProfile) UserProfileEntity.prototype.createUserProfile.mockReset();
        if (UserProfileEntity.prototype.listUserProfiles) UserProfileEntity.prototype.listUserProfiles.mockReset();
        if (UserProfileEntity.prototype.updateUserProfile) UserProfileEntity.prototype.updateUserProfile.mockReset();
        if (UserProfileEntity.prototype.simulateProfile) UserProfileEntity.prototype.simulateProfile.mockReset();
        if (UserProfileEntity.prototype.updateProfileStatus) UserProfileEntity.prototype.updateProfileStatus.mockReset();
        if (UserProfileEntity.prototype.searchUserProfiles) UserProfileEntity.prototype.searchUserProfiles.mockReset();
        
        res = mockResponse();
    });

    // --- CreateUserProfileController ---
    describe('CreateUserProfileController', () => {
        let controller;
        const profileData = { name: 'New Test Profile', permissions: ['READ'] };

        beforeEach(() => {
            controller = new CreateUserProfileController();
        });

        it('should create a profile and respond with 201 and true if entity returns true', async () => {
            req = mockRequest(profileData);
            UserProfileEntity.prototype.createUserProfile.mockResolvedValue(true);

            await controller.createUserProfile(req, res);

            expect(UserProfileEntity.prototype.createUserProfile).toHaveBeenCalledWith(profileData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(true);
        });

        it('should respond with entity error status and message if entity returns an error', async () => {
            req = mockRequest(profileData);
            const entityError = { error: { status: 409, error: 'Profile already exists.' } };
            UserProfileEntity.prototype.createUserProfile.mockResolvedValue(entityError);

            await controller.createUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Profile already exists.' });
        });
    });

    // --- ViewUserProfileController ---
    describe('ViewUserProfileController', () => {
        let controller;
        const mockProfiles = [{ id: '1', name: 'Admin' }, { id: '2', name: 'User' }];

        beforeEach(() => {
            controller = new ViewUserProfileController();
        });

        it('should list profiles and respond with 200 and data', async () => {
            req = mockRequest({}, {}, { keyword: 'Adm' });
            UserProfileEntity.prototype.listUserProfiles.mockResolvedValue(mockProfiles);

            await controller.listUserProfiles(req, res);

            expect(UserProfileEntity.prototype.listUserProfiles).toHaveBeenCalledWith({ keyword: 'Adm' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfiles);
        });

        it('should respond with entity error if listing fails', async () => {
            req = mockRequest();
            const entityError = { error: { status: 500, error: 'DB error.' } };
            UserProfileEntity.prototype.listUserProfiles.mockResolvedValue(entityError);

            await controller.listUserProfiles(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'DB error.' });
        });
    });

    // --- EditUserProfileController ---
    describe('EditUserProfileController', () => {
        let controller;
        const profileId = 'profile-id-edit';
        const updateData = { name: 'Updated Profile', permissions: ['WRITE'] };

        beforeEach(() => {
            controller = new EditUserProfileController();
        });

        it('should update a profile and respond with 200 and true if entity returns true', async () => {
            req = mockRequest(updateData, { id: profileId });
            UserProfileEntity.prototype.updateUserProfile.mockResolvedValue(true); // Entity returns true

            await controller.updateUserProfile(req, res);

            expect(UserProfileEntity.prototype.updateUserProfile).toHaveBeenCalledWith(profileId, updateData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(true); // Controller sends true
        });
        
        it('should respond with entity error if update fails', async () => {
            req = mockRequest(updateData, { id: profileId });
            const entityError = { error: { status: 404, error: 'Not found.' } };
            UserProfileEntity.prototype.updateUserProfile.mockResolvedValue(entityError);

            await controller.updateUserProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Not found.' });
        });
    });

    // --- SimulateUserProfileController ---
    describe('SimulateUserProfileController', () => {
        let controller;
        const profileName = 'AdminProfile';
        const mockProfileData = { id: 'sim-1', name: profileName, permissions: ['ALL'] };

        beforeEach(() => {
            controller = new SimulateUserProfileController();
        });

        it('should simulate a profile and respond with 200 and profile data', async () => {
            req = mockRequest({}, { profileName });
            UserProfileEntity.prototype.simulateProfile.mockResolvedValue(mockProfileData);

            await controller.simulateProfile(req, res);

            expect(UserProfileEntity.prototype.simulateProfile).toHaveBeenCalledWith(profileName);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: `Simulating profile: ${mockProfileData.name}`, profile: mockProfileData });
        });
        
        it('should respond with entity error if simulation fails', async () => {
            req = mockRequest({}, { profileName });
            const entityError = { error: { status: 404, error: 'Profile not found.' } };
            UserProfileEntity.prototype.simulateProfile.mockResolvedValue(entityError);

            await controller.simulateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found.' });
        });

        it('should handle unexpected errors during simulation', async () => {
            req = mockRequest({}, { profileName });
            const unexpectedError = new Error("Unexpected entity failure");
            UserProfileEntity.prototype.simulateProfile.mockRejectedValue(unexpectedError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await controller.simulateProfile(req, res);
            
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred while simulating the user profile.' });
            expect(consoleErrorSpy).toHaveBeenCalledWith("Controller error simulating user profile:", unexpectedError);
            consoleErrorSpy.mockRestore();
        });
    });

    // --- UpdateUserProfileStatusController ---
    describe('UpdateUserProfileStatusController', () => {
        let controller;
        const profileId = 'status-prof-id';
        const statusUpdate = { status: 'SUSPENDED' };

        beforeEach(() => {
            controller = new UpdateUserProfileStatusController();
        });

        it('should update profile status and respond with 200 and true if entity returns true', async () => {
            req = mockRequest(statusUpdate, { id: profileId });
            UserProfileEntity.prototype.updateProfileStatus.mockResolvedValue(true); // Entity returns true

            await controller.updateProfileStatus(req, res);

            expect(UserProfileEntity.prototype.updateProfileStatus).toHaveBeenCalledWith(profileId, statusUpdate.status.toUpperCase());
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(true); // Controller sends true
        });

        it('should respond with entity error if status update fails', async () => {
            req = mockRequest(statusUpdate, { id: profileId });
            const entityError = { error: { status: 400, error: 'Invalid status.' } };
            UserProfileEntity.prototype.updateProfileStatus.mockResolvedValue(entityError);

            await controller.updateProfileStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid status.' });
        });
    });

    // --- SearchUserProfileController ---
    describe('SearchUserProfileController', () => {
        let controller;
        const searchParams = { filter: 'name', keyword: 'SearchProf' };
        const mockSearchResult = [{ id: 's-1', name: 'SearchProf', userAccounts: [] }];

        beforeEach(() => {
            controller = new SearchUserProfileController();
        });

        it('should search profiles and respond with 200 and data', async () => {
            req = mockRequest({}, {}, searchParams);
            UserProfileEntity.prototype.searchUserProfiles.mockResolvedValue(mockSearchResult);

            await controller.searchUserProfiles(req, res);

            expect(UserProfileEntity.prototype.searchUserProfiles).toHaveBeenCalledWith(searchParams);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockSearchResult);
        });

        it('should respond with entity error if search fails', async () => {
            req = mockRequest({}, {}, searchParams);
            const entityError = { error: { status: 404, error: 'Not found.' } };
            UserProfileEntity.prototype.searchUserProfiles.mockResolvedValue(entityError);

            await controller.searchUserProfiles(req, res);
            
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Not found.' });
        });
    });
});
