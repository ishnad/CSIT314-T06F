// Use AuthController now
const { AuthController } = require('../../src/controllers/authController');
const UserAccountEntity = require('../../src/entities/userAccountEntity');

// Mock the UserAccountEntity
jest.mock('../../src/entities/userAccountEntity');

// --- Mock Express Request/Response ---
const mockRequest = (body = {}) => ({
    body,
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// --- Test Suite ---
// Updated describe block to reflect the single AuthController
describe('AuthController', () => {
    let controller; // Define controller instance at suite level
    let req;
    let res;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        UserAccountEntity.mockClear();
        // Instantiate the single controller here
        controller = new AuthController();
        res = mockResponse(); // Get fresh response mock
        // Mock methods on the prototype for the instance
        UserAccountEntity.prototype.validateLogin = jest.fn();
        // No entity method for logout in this stateless approach
    });

    // --- Tests for login method ---
    describe('login', () => {
        const username = 'cleanerUser';
        const password = 'cleanerPassword';
        const mockUser = { // Data returned by entity on success
            id: 'user-cleaner-1',
            username: username,
            email: 'cleaner@example.com',
            status: 'ACTIVE',
            userProfileId: 'profile-cleaner',
            userProfile: { id: 'profile-cleaner', name: 'Cleaner' }
        };
         const expectedUserInfo = { // Expected user info in response
            id: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            profile: mockUser.userProfile // Send profile id and name
        };
        // Removed mockToken

        // Remove the nested beforeEach for LoginController
        // beforeEach(() => { ... });

        it('should login successfully and return user info', async () => {
            req = mockRequest({ username, password });
            UserAccountEntity.prototype.validateLogin.mockResolvedValue(mockUser); // Simulate successful validation

            await controller.login(req, res);

            expect(UserAccountEntity.prototype.validateLogin).toHaveBeenCalledWith(username, password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful.',
                // Removed token expectation
                user: expectedUserInfo // Expecting the formatted user object
            });
        });

        it('login should return 400 if username is missing', async () => {
            req = mockRequest({ password }); // Missing username

            await controller.login(req, res);

            expect(UserAccountEntity.prototype.validateLogin).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required.' });
        });

        it('login should return 400 if password is missing', async () => {
            req = mockRequest({ username }); // Missing password

            await controller.login(req, res);

            expect(UserAccountEntity.prototype.validateLogin).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required.' });
        });

        it('login should return error from entity if validation fails (e.g., invalid credentials)', async () => {
            req = mockRequest({ username, password });
            const errorResponse = { error: { status: 401, message: 'Invalid username or password.' } };
            UserAccountEntity.prototype.validateLogin.mockResolvedValue(errorResponse); // Simulate entity returning error

            await controller.login(req, res);

            expect(UserAccountEntity.prototype.validateLogin).toHaveBeenCalledWith(username, password);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password.' });
        });

         it('login should return error from entity if validation fails (e.g., bad request)', async () => {
            req = mockRequest({ username, password });
            const errorResponse = { error: { status: 400, message: 'Password is required.' } }; // Example bad request error from entity
            UserAccountEntity.prototype.validateLogin.mockResolvedValue(errorResponse);

            await controller.login(req, res);

            expect(UserAccountEntity.prototype.validateLogin).toHaveBeenCalledWith(username, password);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Password is required.' });
        });

        it('login should return 500 on unexpected controller error', async () => {
            req = mockRequest({ username, password });
            const error = new Error("Something broke badly");
            UserAccountEntity.prototype.validateLogin.mockRejectedValue(error); // Simulate unexpected throw

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            await controller.login(req, res);
            consoleErrorSpy.mockRestore();

            expect(UserAccountEntity.prototype.validateLogin).toHaveBeenCalledWith(username, password);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'An unexpected error occurred during login.' });
        });

    });

    // --- Tests for logout method ---
    describe('logout', () => {
        it('should return 200 and success message', async () => {
            req = mockRequest(); // Logout doesn't need body/params

            await controller.logout(req, res);

            // No entity method is called for stateless logout
            expect(UserAccountEntity.prototype.validateLogin).not.toHaveBeenCalled(); // Ensure login wasn't called
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Logout successful. Please clear your session/token.'
            });
        });
    });
});