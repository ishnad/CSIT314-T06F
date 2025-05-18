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

        it('should respond with 201 and true if user creation is successful', async () => {
            req = mockRequest({}, userData);
            UserAccountEntity.prototype.createUserAccount.mockResolvedValue(true);

            await controller.createUserAccount(req, res);

            expect(UserAccountEntity.prototype.createUserAccount).toHaveBeenCalledWith(userData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(true);
        });

        it('should respond with status and message from entity error object (e.g., conflict)', async () => {
            req = mockRequest({}, userData);
            const entityError = { error: { status: 409, message: 'Username already exists.' } };
            UserAccountEntity.prototype.createUserAccount.mockResolvedValue(entityError);

            await controller.createUserAccount(req, res);

            expect(UserAccountEntity.prototype.createUserAccount).toHaveBeenCalledWith(userData);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists.' });
        });

        it('should respond with 500 if entity returns a 500 error object', async () => {
            req = mockRequest({}, userData);
            const entityError = { error: { status: 500, message: 'Entity internal error.' } };
            UserAccountEntity.prototype.createUserAccount.mockResolvedValue(entityError);

            await controller.createUserAccount(req, res);

            expect(UserAccountEntity.prototype.createUserAccount).toHaveBeenCalledWith(userData);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Entity internal error.' });
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

        it('should handle various filter scenarios correctly', async () => {
            const testCases = [
                {
                    description: 'status filter with no results',
                    filter: 'status',
                    keyword: 'BANNED',
                    mockResult: [],
                    expectedStatus: 200,
                    expectedResponse: []
                },
                {
                    description: 'email filter with multiple results',
                    filter: 'email',
                    keyword: '@company.com',
                    mockResult: [{id: '1', email: 'user1@company.com'}, {id: '2', email: 'user2@company.com'}],
                    expectedStatus: 200,
                    expectedResponse: [{id: '1', email: 'user1@company.com'}, {id: '2', email: 'user2@company.com'}]
                },
                {
                    description: 'userProfile filter with special characters',
                    filter: 'userProfile',
                    keyword: 'Admin%',
                    mockResult: [{id: '3', userProfile: 'Admin%'}],
                    expectedStatus: 200,
                    expectedResponse: [{id: '3', userProfile: 'Admin%'}]
                }
            ];

            for (const testCase of testCases) {
                UserAccountEntity.prototype.viewUserAccount.mockResolvedValue(testCase.mockResult);
                req = mockRequest({}, {}, { filter: testCase.filter, keyword: testCase.keyword });
                
                await controller.viewUserAccount(req, res);
                
                expect(UserAccountEntity.prototype.viewUserAccount)
                    .toHaveBeenCalledWith(testCase.filter, testCase.keyword);
                expect(res.status).toHaveBeenCalledWith(testCase.expectedStatus);
                expect(res.json).toHaveBeenCalledWith(testCase.expectedResponse);
                
                // Reset mocks for next iteration
                res.status.mockClear();
                res.json.mockClear();
            }
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

        it('should handle entity error responses correctly', async () => {
            req = mockRequest({}, editData);
            const testCases = [
                { 
                    errorDetails: { status: 404, error: 'User profile not found.' }, // This is the content of result.error
                    expectedStatus: 404,
                    expectedMessage: 'User profile not found.'
                },
                {
                    errorDetails: { status: 409, error: 'Database constraint failed' }, // This is the content of result.error
                    expectedStatus: 409,
                    expectedMessage: 'Database constraint failed'
                }
            ];

            for (const testCase of testCases) {
                // Mock the entity to return an object like { error: { status: ..., error: ... } }
                UserAccountEntity.prototype.editUserAccount.mockResolvedValueOnce({ error: testCase.errorDetails });
                await controller.editUserAccount(req, res);
                
                expect(res.status).toHaveBeenCalledWith(testCase.expectedStatus);
                expect(res.json).toHaveBeenCalledWith({ error: testCase.expectedMessage });
                res.status.mockClear();
                res.json.mockClear();
            }
        });

        it('should handle 409 conflict error for duplicate username', async () => {
            req = mockRequest({}, editData);
            const errorResponse = { error: { status: 409, error: 'Username already exists' } };
            UserAccountEntity.prototype.editUserAccount.mockResolvedValue(errorResponse);

            await controller.editUserAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists' });
        });

        it('should handle 409 conflict error for duplicate email', async () => {
            req = mockRequest({}, editData);
            const errorResponse = { error: { status: 409, error: 'Email already exists' } };
            UserAccountEntity.prototype.editUserAccount.mockResolvedValue(errorResponse);

            await controller.editUserAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
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
            expect(res.json).toHaveBeenCalledWith(true);
        });

        it('should respond with the entity error status and message if entity returns an error object', async () => {
            req = mockRequest({}, { username: usernameToSuspend });
            const errorResponse = { error: { status: 404, message: 'User not found' } };
            UserAccountEntity.prototype.suspendUserAccount.mockResolvedValue(errorResponse);

            await controller.suspendUserAccount(req, res);

            // The controller should use the status and message from the entity's error object
            expect(res.status).toHaveBeenCalledWith(errorResponse.error.status);
            expect(res.json).toHaveBeenCalledWith({ error: errorResponse.error.message });
        });

        it('should return 500 if entity returns false (controller catch block handles TypeError)', async () => {
            req = mockRequest({}, { username: usernameToSuspend });
            UserAccountEntity.prototype.suspendUserAccount.mockResolvedValue(false);

            // Spy on console.error to suppress it during this test if desired, or to check its call
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await controller.suspendUserAccount(req, res);

            // The controller's catch block should handle the TypeError and respond with 500
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to suspend user account' });
            expect(consoleErrorSpy).toHaveBeenCalledWith("suspendUserAccount ERROR:", expect.any(TypeError));
            
            consoleErrorSpy.mockRestore();
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

        it('should return proper response structure for found users', async () => {
            const mockUsers = [{ id: '1', username: 'testuser' }];
            req = mockRequest({}, {}, { filter: 'username', keyword: 'test' });
            UserAccountEntity.prototype.searchUserAccount.mockResolvedValue(mockUsers);

            await controller.searchUserAccount(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle special characters in search keyword', async () => {
            const keyword = 'test@example.com';
            req = mockRequest({}, {}, { filter: 'email', keyword });
            UserAccountEntity.prototype.searchUserAccount.mockResolvedValue([]);

            await controller.searchUserAccount(req, res);

            expect(UserAccountEntity.prototype.searchUserAccount)
                .toHaveBeenCalledWith('email', keyword);
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
