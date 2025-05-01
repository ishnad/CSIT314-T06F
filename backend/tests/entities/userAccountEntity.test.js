const UserAccountEntity = require('../../src/entities/userAccountEntity');
// Import the mocked UserStatus along with PrismaClient
const { PrismaClient, UserStatus: mockUserStatus } = require('../../src/generated/prisma');
const bcrypt = require('bcrypt');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
    // Define mockUserStatus INSIDE the factory function
    const mockUserStatus = {
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE',
        SUSPENDED: 'SUSPENDED',
        BANNED: 'BANNED',
    };
    const mockPrisma = {
        userAccount: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        userProfile: {
            findUnique: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        UserStatus: mockUserStatus, // Provide the mocked enum
    };
});

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

// --- Test Suite ---
describe('UserAccountEntity', () => {
    let userAccountEntity;
    let mockPrismaClient;

    beforeEach(() => {
        // Reset mocks and get fresh instances before each test
        jest.clearAllMocks();
        userAccountEntity = new UserAccountEntity();
        mockPrismaClient = new PrismaClient(); // Get reference to the mocked instance
        bcrypt.hash.mockClear();
        bcrypt.compare.mockClear();
    });

    // --- Test createUserAccount ---
    describe('createUserAccount', () => {
        // Add email to the test data
        const userData = { username: 'newUser', password: 'password123', email: 'new@test.com', userProfileName: 'HomeOwner' };
        const mockProfile = { id: 'profile-id-1' };
        const hashedPassword = 'hashedPassword123';
        const createdUser = {
            id: 'user-id-1',
            username: userData.username,
            userProfile: { name: userData.userProfileName }, // Nested structure from include
            createdAt: new Date(),
        };

        it('should create a user successfully', async () => {
            // Mock Prisma calls
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null); // Username doesn't exist
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile); // Profile exists
            bcrypt.hash.mockResolvedValue(hashedPassword);
            mockPrismaClient.userAccount.create.mockResolvedValue(createdUser);

            const result = await userAccountEntity.createUserAccount(userData);

            // Assertions
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: userData.userProfileName }, select: { id: true } });
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, userAccountEntity.SALT_ROUNDS);
            expect(mockPrismaClient.userAccount.create).toHaveBeenCalledWith({
                data: {
                    username: userData.username,
                    email: userData.email, // Ensure email is included in the create call data
                    password: hashedPassword,
                    userProfileId: mockProfile.id,
                },
                include: { userProfile: true },
            });
            // Expect email in the returned result
            expect(result).toEqual({
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email, // Add email expectation
                userProfile: createdUser.userProfile.name,
                createdAt: createdUser.createdAt,
            });
        });

        it('should return error if user profile name is missing', async () => {
            // Missing userProfileName, but include email
            const result = await userAccountEntity.createUserAccount({ username: 'test', password: 'pw', email: 'test@email.com' });
            expect(result).toEqual({ error: { status: 400, error: 'User profile name is required.' } });
            // It should NOT check username because profile name validation fails first
            expect(mockPrismaClient.userAccount.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });

        // Add a test specifically for missing email
        it('should return error if email is missing', async () => {
            const result = await userAccountEntity.createUserAccount({ username: 'test', password: 'pw', userProfileName: 'HomeOwner' }); // Missing email
            expect(result).toEqual({ error: { status: 400, error: 'Email is required.' } });
            expect(mockPrismaClient.userAccount.findUnique).not.toHaveBeenCalled(); // Should fail before checking username
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });

        it('should return error if username already exists', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue({ id: 'existing-user' }); // Username exists

            // Pass full userData including email
            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toEqual({ error: { status: 409, error: 'Username already exists.' } });
            // It should check email validity first, then username
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });

        it('should return error if user profile does not exist', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null); // Username doesn't exist
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist

            // Pass full userData including email
            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toEqual({ error: { status: 404, error: `User profile '${userData.userProfileName}' not found.` } });
            // It should check email validity, then username, then profile
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: userData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });
    });

    // --- Test editUserAccount ---
    describe('editUserAccount', () => {
        const userId = 'user-id-to-edit'; // Define a dummy ID for tests
        const editData = { username: 'testUser', userProfileName: 'Cleaner', email: 'edit@test.com', status: 'Active' }; // Use title-case status as sent from frontend
        const mockProfile = { id: 'profile-id-cleaner' };
        const mockCurrentUser = { id: userId, username: 'oldUsername', email: 'old@test.com', status: 'ACTIVE' }; // Mock for username conflict check
        const updatedUser = {
            username: editData.username,
            userProfile: { name: editData.userProfileName },
            email: editData.email,
            status: editData.status,
        };

        it('should edit a user successfully (username not changed)', async () => {
            // Mock the findUnique calls for profile and current user check
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            // Mock finding the user by ID (username is the same as mockCurrentUser.username)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
            mockPrismaClient.userAccount.update.mockResolvedValue(updatedUser);

            // Call with the correct signature (id, username, profileName, email, status)
            // Use mockCurrentUser.username to simulate no username change
            const result = await userAccountEntity.editUserAccount(userId, mockCurrentUser.username, editData.userProfileName, editData.email, editData.status);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: userId } }); // Check find by ID
            // Username conflict check should NOT have been called
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { id: userId }, // Update using ID
                data: {
                    username: mockCurrentUser.username, // Use original username
                    userProfileId: mockProfile.id,
                    email: editData.email,
                    status: 'ACTIVE', // Expect uppercase status in DB call
                },
                include: { userProfile: true },
            });
            expect(result).toEqual({
                username: updatedUser.username,
                userProfile: updatedUser.userProfile.name,
                email: updatedUser.email,
                status: updatedUser.status,
            });
        });

        it('should edit a user successfully (username changed)', async () => {
            // Mock the findUnique calls for profile and current user check
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            // Mock finding the user by ID
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
             // Mock the username conflict check (return null, no conflict)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null);
            mockPrismaClient.userAccount.update.mockResolvedValue(updatedUser);

            // Call with the correct signature (id, username, profileName, email, status)
            // Use editData.username (different from mockCurrentUser.username)
            const result = await userAccountEntity.editUserAccount(userId, editData.username, editData.userProfileName, editData.email, editData.status);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            // Check find by ID and find by new username
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: editData.username } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(2);
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { id: userId }, // Update using ID
                data: {
                    username: editData.username, // Include username in update data
                    userProfileId: mockProfile.id,
                    email: editData.email,
                    status: 'ACTIVE', // Expect uppercase status in DB call
                },
                include: { userProfile: true },
            });
            expect(result).toEqual({
                username: updatedUser.username,
                userProfile: updatedUser.userProfile.name,
                email: updatedUser.email,
                status: updatedUser.status,
            });
        });

        it('should return validation error for invalid input (missing fields)', async () => {
            // Call without ID
            const result = await userAccountEntity.editUserAccount(null, 'test', 'Prof', 'email@valid.com', 'Active');
            expect(result).toEqual({ error: { status: 400, error: 'ID, username, userProfileName, email, and status are required' } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });

         it('should return validation error for invalid email format', async () => {
            // Call with ID but invalid email
            const result = await userAccountEntity.editUserAccount(userId, 'test', 'Prof', 'invalid-email', 'Active');
            expect(result).toEqual({ error: { status: 400, error: 'Invalid email format' } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled(); // Fails before profile check
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });

         it('should return error if user profile does not exist', async () => {
            // Reset findUnique mocks specifically for this test
            mockPrismaClient.userAccount.findUnique.mockReset();
            // Mock findUnique for user check by ID to return a user
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
            // Mock profile check to return null
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null);

            // Call with correct signature
            const result = await userAccountEntity.editUserAccount(userId, editData.username, editData.userProfileName, editData.email, editData.status);

            expect(result).toEqual({ error: { status: 404, error: `User profile '${editData.userProfileName}' not found.` } });
            // UserAccount findUnique should NOT be called because profile check fails first
            expect(mockPrismaClient.userAccount.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });

        it('should return error if prisma update fails', async () => {
            const prismaError = new Error("DB error");
            // Reset findUnique mocks specifically for this test
            mockPrismaClient.userAccount.findUnique.mockReset();
            // Mock findUnique for user check by ID -> success
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
            // Mock findUnique for username conflict check -> null (no conflict)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null);
            // Mock profile check -> success
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            // Mock update -> reject
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

            // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            // Call with correct signature
            const result = await userAccountEntity.editUserAccount(userId, editData.username, editData.userProfileName, editData.email, editData.status);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual({ error: { status: 500, error: "Failed to update user" } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: userId } }); // Check find by ID
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: editData.username } }); // Check find by username
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalled();
        });

        it('should return error if new username already exists', async () => {
            // Reset findUnique mocks specifically for this test
            mockPrismaClient.userAccount.findUnique.mockReset();
            // Mock finding the user by ID -> success
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
            // Mock the username conflict check -> return an existing user
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce({ id: 'other-user-id', username: editData.username });
            // Mock profile check -> success (though it won't be reached)
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);


             // Call with the correct signature (id, username, profileName, email, status)
            const result = await userAccountEntity.editUserAccount(userId, editData.username, editData.userProfileName, editData.email, editData.status);

            expect(result).toEqual({ error: { status: 409, error: 'New username already exists.' } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: editData.username } });
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });
    });

    // --- Test viewUserAccount ---
    describe('viewUserAccount', () => {
        const mockUsers = [
            { id: 'id1', username: 'user1', email: 'u1@a.com', userProfile: { name: 'HomeOwner' }, status: 'ACTIVE', createdAt: new Date() },
            { id: 'id2', username: 'user2', email: 'u2@b.com', userProfile: { name: 'Cleaner' }, status: 'ACTIVE', createdAt: new Date() },
        ];
        // Update expected mapped users to include ID
        const expectedMappedUsers = mockUsers.map(u => ({ id: u.id, username: u.username, email: u.email, userProfile: u.userProfile.name, status: u.status, createdAt: u.createdAt }));

        it('should return all users if no filter/keyword provided', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.viewUserAccount(null, null);

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: {}, // Empty where clause
                select: {
                    id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
            expect(result).toEqual(expectedMappedUsers); // Compare with updated expected users
        });

        it('should filter by username', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[0]]); // Return only user1

            const result = await userAccountEntity.viewUserAccount('username', 'user1');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { username: { contains: 'user1', mode: 'insensitive' } },
                select: {
                    id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
            expect(result).toEqual([expectedMappedUsers[0]]); // Compare with updated expected users
        });

        it('should filter by userProfile name', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[1]]); // Return only user2 (Cleaner)

            const result = await userAccountEntity.viewUserAccount('userProfile', 'Cleaner');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { userProfile: { name: { equals: 'Cleaner' } } },
                select: {
                    id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
             expect(result).toEqual([expectedMappedUsers[1]]); // Compare with updated expected users
        });

         it('should filter by status', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.viewUserAccount('status', 'ACTIVE');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { status: { equals: 'ACTIVE' } },
                select: {
                    id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
             expect(result).toEqual(expectedMappedUsers); // Compare with updated expected users
        });

        it('should handle empty results correctly', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([]); // No users found

            const result = await userAccountEntity.viewUserAccount('username', 'nonexistent');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    // --- Test suspendUserAccount ---
    describe('suspendUserAccount', () => {
        const username = 'userToSuspend';
        const mockUserToSuspend = { id: 'suspend-id', username: username, status: 'ACTIVE' };

        it('should suspend a user successfully', async () => {
            // Mock findUnique to find the user first
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUserToSuspend);
            mockPrismaClient.userAccount.update.mockResolvedValue({ username, status: 'SUSPENDED' }); // Simulate successful update

            const result = await userAccountEntity.suspendUserAccount(username);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username } });
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username },
                data: { status: mockUserStatus.SUSPENDED }, // Use mocked enum value
            });
            expect(result).toBe(true);
        });

        it('should return false if user is not found', async () => {
            // Reset findUnique mocks specifically for this test
            mockPrismaClient.userAccount.findUnique.mockReset();
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null); // User not found

            // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.suspendUserAccount(username);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username } });
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled(); // Update should not be called
            expect(result).toBe(false);
        });

        it('should return false if prisma update fails', async () => {
            const prismaError = new Error("DB error");
            // Mock findUnique to find the user first
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUserToSuspend);
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

             // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.suspendUserAccount(username);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username } });
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username },
                data: { status: mockUserStatus.SUSPENDED }, // Use mocked enum value
            });
            expect(result).toBe(false);
        });
    });

    // --- Test searchUserAccount ---
    describe('searchUserAccount', () => {
         const mockUsers = [
            { id: 'sid1', username: 'searchUser1', email: 's1@a.com', userProfile: { name: 'HomeOwner' }, status: 'ACTIVE' },
            { id: 'sid2', username: 'searchUser2', email: 's2@b.com', userProfile: { name: 'Cleaner' }, status: 'ACTIVE' },
        ];
        // Update expected mapped users to include ID
        const expectedMappedUsers = mockUsers.map(u => ({ id: u.id, username: u.username, email: u.email, userProfile: u.userProfile.name, status: u.status }));


        it('should search by username (contains, insensitive)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[0]]);

            const result = await userAccountEntity.searchUserAccount('username', 'searchUser');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { username: { contains: 'searchUser', mode: 'insensitive' } },
                select: { id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true }
            });
            expect(result).toEqual([expectedMappedUsers[0]]); // Compare with updated expected users
        });

        it('should search by userProfile name (contains, insensitive)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[1]]);

            const result = await userAccountEntity.searchUserAccount('userProfile', 'clean'); // Partial, case-insensitive

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { userProfile: { name: { contains: 'clean', mode: 'insensitive' } } },
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true }
            });
            expect(result).toEqual([expectedMappedUsers[1]]); // Compare with updated expected users
        });

         it('should search by status (equals)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.searchUserAccount('status', 'ACTIVE');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { status: { equals: 'ACTIVE' } },
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true }
            });
            expect(result).toEqual(expectedMappedUsers); // Compare with updated expected users
        });

        it('should throw error if filter is missing', async () => {
            await expect(userAccountEntity.searchUserAccount(null, 'keyword')).rejects.toThrow('Filter parameter is required for search');
            expect(mockPrismaClient.userAccount.findMany).not.toHaveBeenCalled();
        });

        it('should handle search with filter but no keyword (profile)', async () => {
             mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);
             await userAccountEntity.searchUserAccount('userProfile', ''); // Empty keyword
             expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                 where: { userProfile: { isNot: null } }, // Checks if profile relation exists
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true }
             });
        });

         it('should handle search with filter but no keyword (other fields - might need refinement)', async () => {
             mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);
             await userAccountEntity.searchUserAccount('username', ''); // Empty keyword
             // Current implementation results in an empty where clause for non-profile fields when keyword is empty
             expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                 where: {},
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true } }, status: true }
             });
        });
    });

    // --- Test verifyLoginCredentials ---
    describe('verifyLoginCredentials', () => {
        const loginData = { username: 'adminUser', password: 'password123' };
        const mockUser = {
            username: loginData.username,
            password: 'hashedAdminPassword',
            status: 'ACTIVE', // Use uppercase to match UserStatus enum
            userProfile: { name: 'UserAdmin' }, // Correct profile
        };
        const mockUserWrongProfile = { ...mockUser, userProfile: { name: 'HomeOwner' } };
        const mockUserInactive = { ...mockUser, status: 'INACTIVE' }; // Use uppercase

        it('should return true for valid admin credentials', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Passwords match

            const result = await userAccountEntity.verifyLoginCredentials(loginData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { username: loginData.username },
                include: { userProfile: { select: { name: true } } },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
            expect(result).toBe(true);
        });

        it('should return false if user not found', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null);

            const result = await userAccountEntity.verifyLoginCredentials(loginData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should return false if user status is not ACTIVE', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUserInactive);

            const result = await userAccountEntity.verifyLoginCredentials(loginData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should return false if user profile is not UserAdmin', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUserWrongProfile);

            const result = await userAccountEntity.verifyLoginCredentials(loginData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });

        it('should return false if password does not match', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false); // Passwords don't match

            const result = await userAccountEntity.verifyLoginCredentials(loginData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
            expect(result).toBe(false);
        });
    });

     // --- Test confirmLogout ---
    describe('confirmLogout', () => {
        // NOTE: This test reflects the current flawed implementation.
        // In a real stateless API, this method wouldn't modify entity state like this.
        it('should set internal properties to null and return true', async () => {
            // Set some initial dummy values to see them cleared
            userAccountEntity.sessionID = 'some-session';
            userAccountEntity.userID = 'some-user';

            const result = await userAccountEntity.confirmLogout();

            expect(userAccountEntity.sessionID).toBeNull();
            expect(userAccountEntity.userID).toBeNull();
            expect(result).toBe(true);
        });

         // It's hard to simulate an error here as the try block is synchronous
         // and doesn't have operations that typically throw in this context.
         // If there were async operations, we could mock them to reject.
    });

    // --- Test cancelLogout ---
    describe('cancelLogout', () => {
        it('should simply return true', () => {
            const result = userAccountEntity.cancelLogout();
            expect(result).toBe(true);
        });
    });

});