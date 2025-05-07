const {
    CreateUserAccountController,
    ViewUserAccountController,
    EditUserAccountController,
    SuspendUserAccountController,
    SearchUserAccountController
} = require('../../src/controllers/userAccountController');
const UserAccountEntity = require('../../src/entities/userAccountEntity');

// Mock the UserAccountEntity
jest.mock('../../src/entities/userAccountEntity');

// --- Mock Express Request/Response ---
const mockRequest = (params = {}, body = {}, query = {}) => ({
    params,
    body,
    query,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// --- Test Suite ---
describe('UserAccount Controllers (excluding Login)', () => {

    let req;
    let res;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        UserAccountEntity.mockClear();
        // Reset the mock implementation for all methods on the prototype
        UserAccountEntity.prototype.createUserAccount = jest.fn();
        UserAccountEntity.prototype.viewUserAccount = jest.fn();
        UserAccountEntity.prototype.editUserAccount = jest.fn();
        UserAccountEntity.prototype.suspendUserAccount = jest.fn();
        UserAccountEntity.prototype.searchUserAccount = jest.fn();
        // UserAccountEntity.prototype.confirmLogout = jest.fn();
        // UserAccountEntity.prototype.cancelLogout = jest.fn();

        res = mockResponse(); // Get a fresh response mock for each test
    });

    // --- Tests for CreateUserAccountController ---
    describe('CreateUserAccountController', () => {
        let controller;
        const userData = { username: 'test', password: 'pw', email: 'test@e.com', userProfileName: 'HomeOwner' };
        const createdUser = { id: '1', username: 'test', email: 'test@e.com', userProfile: 'HomeOwner', createdAt: new Date() };

        beforeEach(() => {
            controller = new CreateUserAccountController();
        });

        it('should create user successfully', async () => {
            req = mockRequest({}, userData);
            UserAccountEntity.prototype.createUserAccount.mockResolvedValue(true);

            await controller.createUserAccount(req, res);

            expect(UserAccountEntity.prototype.createUserAccount).toHaveBeenCalledWith(userData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User account created successfully.' });
        });

        it('should return 400 if userProfileName is missing', async () => {
            req = mockRequest({}, { username: 'test', password: 'pw', email: 'test@e.com' }); // Missing profile name
            await controller.createUserAccount(req, res);
            expect(UserAccountEntity.prototype.createUserAccount).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'userProfileName is required.' });
        });

        it('should return 400 if email is missing', async () => {
            req = mockRequest({}, { username: 'test', password: 'pw', userProfileName: 'HomeOwner' }); // Missing email
            await controller.createUserAccount(req, res);
            expect(UserAccountEntity.prototype.createUserAccount).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email is required.' });
        });

        it('should return error from entity if creation fails (e.g., conflict)', async () => {
            req = mockRequest({}, userData);
            const errorResponse = { error: { status: 409, error: 'Username already exists.' } };
            UserAccountEntity.prototype.createUserAccount.mockResolvedValue(errorResponse);

            await controller.createUserAccount(req, res);

            expect(UserAccountEntity.prototype.createUserAccount).toHaveBeenCalledWith(userData);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists.' });
        });

        it('should return 500 on unexpected controller error', async () => {
            req = mockRequest({}, userData);
            const error = new Error("Something broke");
            UserAccountEntity.prototype.createUserAccount.mockRejectedValue(error);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.createUserAccount(req, res);
            consoleErrorSpy.mockRestore();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user due to a server error.' });
        });
    });

    // --- Tests for ViewUserAccountController ---
    describe('ViewUserAccountController', () => {
        let controller;
        const mockUsers = [{ id: '1', username: 'u1' }, { id: '2', username: 'u2' }];

        beforeEach(() => {
            controller = new ViewUserAccountController();
        });

        it('should return list of users', async () => {
            req = mockRequest({}, {}, {}); // No filter/keyword
            UserAccountEntity.prototype.viewUserAccount.mockResolvedValue(mockUsers);

            await controller.viewUserAccount(req, res);

            expect(UserAccountEntity.prototype.viewUserAccount).toHaveBeenCalledWith(undefined, undefined);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should return filtered list of users', async () => {
            req = mockRequest({}, {}, { filter: 'username', keyword: 'u1' });
            UserAccountEntity.prototype.viewUserAccount.mockResolvedValue([mockUsers[0]]);

            await controller.viewUserAccount(req, res);

            expect(UserAccountEntity.prototype.viewUserAccount).toHaveBeenCalledWith('username', 'u1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockUsers[0]]);
        });

        it('should return 404 if specific user filter yields no results', async () => {
            req = mockRequest({}, {}, { filter: 'username', keyword: 'notfound' });
            UserAccountEntity.prototype.viewUserAccount.mockResolvedValue([]); // Empty array

            await controller.viewUserAccount(req, res);

            expect(UserAccountEntity.prototype.viewUserAccount).toHaveBeenCalledWith('username', 'notfound');
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
        });

         it('should return 200 with empty array if non-username filter yields no results', async () => {
            req = mockRequest({}, {}, { filter: 'status', keyword: 'BANNED' });
            UserAccountEntity.prototype.viewUserAccount.mockResolvedValue([]); // Empty array

            await controller.viewUserAccount(req, res);

            expect(UserAccountEntity.prototype.viewUserAccount).toHaveBeenCalledWith('status', 'BANNED');
            expect(res.status).toHaveBeenCalledWith(200); // Not 404 for general filters
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('should return 500 on unexpected controller error', async () => {
            req = mockRequest({}, {}, {});
            const error = new Error("DB broke");
            UserAccountEntity.prototype.viewUserAccount.mockRejectedValue(error);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.viewUserAccount(req, res);
            consoleErrorSpy.mockRestore();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve users" });
        });
    });

    // --- Tests for EditUserAccountController ---
    describe('EditUserAccountController', () => {
        let controller;
        const editData = { id: 'edit-id', username: 'newU', userProfileName: 'Admin', email: 'new@e.com', status: 'ACTIVE' };
        const updatedUser = { username: 'newU', userProfile: 'Admin', email: 'new@e.com', status: 'ACTIVE' };

        beforeEach(() => {
            controller = new EditUserAccountController();
        });

        it('should edit user successfully', async () => {
            req = mockRequest({}, editData);
            UserAccountEntity.prototype.editUserAccount.mockResolvedValue(updatedUser);

            await controller.editUserAccount(req, res);

            expect(UserAccountEntity.prototype.editUserAccount).toHaveBeenCalledWith(editData.id, editData.username, editData.userProfileName, editData.email, editData.status);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 400 if ID is missing', async () => {
            req = mockRequest({}, { username: 'u', userProfileName: 'p', email: 'e', status: 's' }); // Missing ID
            await controller.editUserAccount(req, res);
            expect(UserAccountEntity.prototype.editUserAccount).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'User ID is required for update.' });
        });

         it('should return 400 if other required fields are missing', async () => {
            req = mockRequest({}, { id: 'edit-id', username: 'u' }); // Missing profile, email, status
            await controller.editUserAccount(req, res);
            expect(UserAccountEntity.prototype.editUserAccount).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            // Controller checks for userProfileName first after id
            expect(res.json).toHaveBeenCalledWith({ error: 'userProfileName is required.' });
        });

        it('should return error from entity if edit fails', async () => {
            req = mockRequest({}, editData);
            const errorResponse = { error: { status: 404, error: 'User profile not found.' } };
            UserAccountEntity.prototype.editUserAccount.mockResolvedValue(errorResponse);

            await controller.editUserAccount(req, res);

            expect(UserAccountEntity.prototype.editUserAccount).toHaveBeenCalledWith(editData.id, editData.username, editData.userProfileName, editData.email, editData.status);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User profile not found.' });
        });

        it('should return 500 on unexpected controller error', async () => {
            req = mockRequest({}, editData);
            const error = new Error("DB broke");
            UserAccountEntity.prototype.editUserAccount.mockRejectedValue(error);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.editUserAccount(req, res);
            consoleErrorSpy.mockRestore();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to update user" });
        });
    });

    // --- Tests for SuspendUserAccountController ---
    describe('SuspendUserAccountController', () => {
        let controller;
        const usernameToSuspend = 'suspendMe';

        beforeEach(() => {
            controller = new SuspendUserAccountController();
        });

        it('should suspend user successfully', async () => {
            req = mockRequest({}, { username: usernameToSuspend });
            UserAccountEntity.prototype.suspendUserAccount.mockResolvedValue(true);

            await controller.suspendUserAccount(req, res);

            expect(UserAccountEntity.prototype.suspendUserAccount).toHaveBeenCalledWith(usernameToSuspend);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User account suspended successfully' });
        });

        it('should return 500 if entity returns false', async () => {
            req = mockRequest({}, { username: usernameToSuspend });
            UserAccountEntity.prototype.suspendUserAccount.mockResolvedValue(false); // Simulate failure in entity

            await controller.suspendUserAccount(req, res);

            expect(UserAccountEntity.prototype.suspendUserAccount).toHaveBeenCalledWith(usernameToSuspend);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to suspend user account' });
        });

        it('should return 500 on unexpected controller error', async () => {
            req = mockRequest({}, { username: usernameToSuspend });
            const error = new Error("DB broke");
            UserAccountEntity.prototype.suspendUserAccount.mockRejectedValue(error);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.suspendUserAccount(req, res);
            consoleErrorSpy.mockRestore();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to suspend user account" });
        });
    });

    // --- Tests for SearchUserAccountController ---
    describe('SearchUserAccountController', () => {
        let controller;
        const mockUsers = [{ id: '1', username: 'searchResult' }];

        beforeEach(() => {
            controller = new SearchUserAccountController();
        });

        it('should return search results', async () => {
            req = mockRequest({}, {}, { filter: 'username', keyword: 'search' });
            UserAccountEntity.prototype.searchUserAccount.mockResolvedValue(mockUsers);

            await controller.searchUserAccount(req, res);

            expect(UserAccountEntity.prototype.searchUserAccount).toHaveBeenCalledWith('username', 'search');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should return 200 with message if no users found', async () => {
            req = mockRequest({}, {}, { filter: 'username', keyword: 'notfound' });
            UserAccountEntity.prototype.searchUserAccount.mockResolvedValue([]); // Empty array

            await controller.searchUserAccount(req, res);

            expect(UserAccountEntity.prototype.searchUserAccount).toHaveBeenCalledWith('username', 'notfound');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "No users found for your search" });
        });

        it('should return 400 if entity throws filter required error', async () => {
            req = mockRequest({}, {}, { keyword: 'search' }); // Missing filter
            const error = new Error('Filter parameter is required for search');
            UserAccountEntity.prototype.searchUserAccount.mockRejectedValue(error);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.searchUserAccount(req, res);
            consoleErrorSpy.mockRestore();


            expect(UserAccountEntity.prototype.searchUserAccount).toHaveBeenCalledWith(undefined, 'search');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Filter parameter is required for search' });
        });

        it('should return 500 on other unexpected controller errors', async () => {
            req = mockRequest({}, {}, { filter: 'username', keyword: 'search' });
            const error = new Error("DB broke");
            UserAccountEntity.prototype.searchUserAccount.mockRejectedValue(error);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.searchUserAccount(req, res);
            consoleErrorSpy.mockRestore();

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to search users" });
        });
    });
});