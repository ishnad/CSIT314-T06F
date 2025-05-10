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

        it('should create a user successfully and return true', async () => {
            // Mock Prisma calls
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null); // Username doesn't exist
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null); // Email doesn't exist
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile); // Profile exists
            bcrypt.hash.mockResolvedValue(hashedPassword);
            mockPrismaClient.userAccount.create.mockResolvedValue(createdUser);

            const result = await userAccountEntity.createUserAccount(userData);

            // Assertions
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(1, { where: { username: userData.username } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(2, { where: { email: userData.email } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: userData.userProfileName }, select: { id: true } });
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, userAccountEntity.SALT_ROUNDS);
            expect(mockPrismaClient.userAccount.create).toHaveBeenCalledWith({
                data: {
                    username: userData.username,
                    email: userData.email, // Ensure email is included in the create call data
                    password: hashedPassword,
                    userProfileId: mockProfile.id,
                },
                include: { userProfile: { select: { name: true, permissions: true } } },
            });
            // Expect true on successful creation
            expect(result).toBe(true);
        });

        it('should return false if username already exists', async () => {
            // Mock prisma.userAccount.findUnique to simulate username existing
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce({ id: 'existing-user' });
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            // Pass full userData including email
            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith(`User account creation failed: Username '${userData.username}' already exists.`);
            // The first call to findUnique is for the username check
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            // Email check, profile check, and create should not happen if username exists
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(1); 
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        it('should return false if email already exists', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null); // Username doesn't exist
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce({ id: 'existing-email-user' }); // Email exists
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith(`User account creation failed: Email '${userData.email}' already exists.`);
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(1, { where: { username: userData.username } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(2, { where: { email: userData.email } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        it('should return false if prisma create fails', async () => {
            // Mock prisma.userAccount.findUnique for username check (null = username does not exist)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null);
            // Mock prisma.userAccount.findUnique for email check (null = email does not exist)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null);
            // Mock prisma.userProfile.findUnique for profile check (profile exists)
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(mockProfile);
            bcrypt.hash.mockResolvedValue(hashedPassword);
            const dbError = new Error("DB create error");
            mockPrismaClient.userAccount.create.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toBe(false);
            expect(mockPrismaClient.userAccount.create).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error during user account creation in entity:", dbError);
            consoleErrorSpy.mockRestore();
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
            // Mock finding the user by ID
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
            // Mock email conflict check (return an existing user to simulate conflict)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce({ id: 'other-user-id', email: editData.email });
            // mockPrismaClient.userAccount.update.mockResolvedValue(updatedUser); // Update won't be called

            // Call with the correct signature (id, username, profileName, email, status)
            // Use mockCurrentUser.username to simulate no username change
            const result = await userAccountEntity.editUserAccount(userId, mockCurrentUser.username, editData.userProfileName, editData.email, editData.status);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(1, { where: { id: userId } }); // Check find by ID
            // Email conflict check IS called because email is different
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(2, { where: { email: editData.email } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(2);
            // console.error should not be called for this type of error in editUserAccount
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
            expect(result).toEqual({ error: { status: 409, error: 'New email already exists.' } });
        });

        it('should return 409 error if email is changed (username changed)', async () => {
            // Mock the findUnique calls for profile and current user check
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            // Mock finding the user by ID
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockCurrentUser);
             // Mock the username conflict check (return null, no conflict)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null);
            // Mock the email conflict check (return an existing user to simulate conflict)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce({ id: 'other-user-id', email: editData.email });
            // mockPrismaClient.userAccount.update.mockResolvedValue(updatedUser); // Update won't be called

            // Call with the correct signature (id, username, profileName, email, status)
            // Use editData.username (different from mockCurrentUser.username)
            const result = await userAccountEntity.editUserAccount(userId, editData.username, editData.userProfileName, editData.email, editData.status);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            // Check find by ID, find by new username, and find by new email
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(1, { where: { id: userId } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(2, { where: { username: editData.username } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(3, { where: { email: editData.email } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(3);
            // console.error should not be called for this type of error in editUserAccount
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
            expect(result).toEqual({ error: { status: 409, error: 'New email already exists.' } });
        });

         it('should return error if user to update is not found (simulating invalid ID)', async () => {
            // Mock profile check to succeed
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            // Mock findUnique for user ID to return null (user not found)
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null);

            const result = await userAccountEntity.editUserAccount(userId, 'test', 'Prof', 'valid@email.com', 'Active');
            expect(result).toEqual({ error: { status: 404, error: 'User to update not found.' } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'Prof' }, select: { id: true } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
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
            // Use a local editData where email is NOT changed to bypass the early return
            const currentEditData = { ...editData, email: mockCurrentUser.email };

            // Mock profile check -> success
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            
            // Mock userAccount.findUnique behavior specifically for this test
            // to ensure the correct sequence of return values based on query arguments.
            mockPrismaClient.userAccount.findUnique.mockImplementation(async (query) => {
                if (query.where.id && query.where.id === userId) {
                    // Call for fetching the current user by ID
                    return mockCurrentUser;
                }
                if (query.where.username && query.where.username === currentEditData.username) {
                    // Call for checking username conflict - simulate no conflict
                    return null;
                }
                // Default return for any other unexpected findUnique calls on userAccount in this test
                return undefined; 
            });
            
            // Mock update -> reject
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

            // Silence console.error for this specific test case (for the "Error updating user:" log)
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            // Call with correct signature, using currentEditData
            const result = await userAccountEntity.editUserAccount(userId, currentEditData.username, currentEditData.userProfileName, currentEditData.email, currentEditData.status);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual({ error: { status: 500, error: "Failed to update user" } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: currentEditData.userProfileName }, select: { id: true } });
            // First call to userAccount.findUnique is for the ID
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(1, { where: { id: userId } });
            // Second call to userAccount.findUnique is for the username conflict check
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(2, { where: { username: currentEditData.username } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(2); // Ensure only these two calls happened
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
                    id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true, createdAt: true
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
                    id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true, createdAt: true
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
                    id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true, createdAt: true
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
                    id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true, createdAt: true
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
                select: { id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true }
            });
            expect(result).toEqual([expectedMappedUsers[0]]); // Compare with updated expected users
        });

        it('should search by userProfile name (contains, insensitive)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[1]]);

            const result = await userAccountEntity.searchUserAccount('userProfile', 'clean'); // Partial, case-insensitive

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { userProfile: { name: { contains: 'clean', mode: 'insensitive' } } },
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true }
            });
            expect(result).toEqual([expectedMappedUsers[1]]); // Compare with updated expected users
        });

         it('should search by status (equals)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.searchUserAccount('status', 'ACTIVE');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { status: { equals: 'ACTIVE' } },
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true }
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
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true }
             });
        });

         it('should handle search with filter but no keyword (other fields - might need refinement)', async () => {
             mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);
             await userAccountEntity.searchUserAccount('username', ''); // Empty keyword
             // Current implementation results in an empty where clause for non-profile fields when keyword is empty
             expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                 where: {},
                 select: { id: true, username: true, email: true, userProfile: { select: { name: true, permissions: true } }, status: true }
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
            // Add permissions to mock user profile
            userProfile: { name: 'UserAdmin', permissions: ['ADMIN_PRIVILEGES'] }, // Correct profile with permissions
        };
        // Add permissions to mock user profile (even if wrong profile)
        const mockUserWrongProfile = { ...mockUser, userProfile: { name: 'HomeOwner', permissions: ['SOME_OTHER_PERMISSION'] } };
        const mockUserInactive = { ...mockUser, status: 'INACTIVE' }; // Use uppercase

        it('should return true for valid admin credentials', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Passwords match

            const result = await userAccountEntity.verifyLoginCredentials(loginData);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { username: loginData.username },
                include: { userProfile: { select: { name: true, permissions: true } } },
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

    // --- Test validateLogin ---
    describe('validateLogin', () => {
        const username = 'testuser';
        const password = 'password123';
        const hashedPassword = 'hashedPassword';
        const mockUser = {
            id: 'user-id-1',
            username: username,
            password: hashedPassword,
            email: 'test@example.com',
            status: 'ACTIVE', // Use the actual string value from the mocked enum
            userProfileId: 'profile-id-cleaner',
            userProfile: {
                id: 'profile-id-cleaner',
                name: 'Cleaner',
                permissions: ['SOME_PERMISSION'] // Add mock permissions
            }
        };
        const expectedUserInfo = { // Expected return on success (password omitted)
            id: mockUser.id,
            username: mockUser.username,
            email: mockUser.email,
            status: mockUser.status,
            userProfileId: mockUser.userProfileId,
            userProfile: mockUser.userProfile
        };

        it('should return user info if credentials are valid and user is active', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true); // Simulate correct password

            const result = await userAccountEntity.validateLogin(username, password);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { username: username },
                include: { userProfile: { select: { id: true, name: true, permissions: true } } }
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(result).toEqual(expectedUserInfo);
        });

        it('should return 401 error if password does not match', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false); // Simulate incorrect password
            const expectedError = { error: { status: 401, message: 'Invalid username or password.' } };

            const result = await userAccountEntity.validateLogin(username, password);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { username: username },
                include: { userProfile: { select: { id: true, name: true, permissions: true } } }
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(result).toEqual(expectedError);
        });

        it('should return 401 error if user is not found', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null); // Simulate user not found
            const expectedError = { error: { status: 401, message: 'Invalid username or password.' } };

            const result = await userAccountEntity.validateLogin(username, password);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { username: username },
                include: { userProfile: { select: { id: true, name: true, permissions: true } } }
            });
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(result).toEqual(expectedError);
        });

        it('should return 401 error if user status is not ACTIVE', async () => {
            // Use the actual string value from the mocked enum
            const inactiveUser = { ...mockUser, status: mockUserStatus.INACTIVE };
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(inactiveUser);
            const expectedError = { error: { status: 401, message: 'Invalid username or password.' } };

            const result = await userAccountEntity.validateLogin(username, password);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({
                where: { username: username },
                include: { userProfile: { select: { id: true, name: true, permissions: true } } }
            });
            expect(bcrypt.compare).not.toHaveBeenCalled(); // Password check shouldn't happen if inactive
            expect(result).toEqual(expectedError);
        });

        it('should return 500 error if prisma findUnique fails', async () => {
            const prismaError = new Error("Database connection failed");
            const expectedError = { error: { status: 500, message: 'Login failed due to a server error.' } };
            mockPrismaClient.userAccount.findUnique.mockRejectedValue(prismaError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.validateLogin(username, password);
            consoleErrorSpy.mockRestore();

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(result).toEqual(expectedError);
        });

        it('should return 500 error if bcrypt compare fails', async () => {
            const bcryptError = new Error("Bcrypt error");
            const expectedError = { error: { status: 500, message: 'Login failed due to a server error.' } };
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockRejectedValue(bcryptError); // Simulate bcrypt failure

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.validateLogin(username, password);
            consoleErrorSpy.mockRestore();

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalled();
            expect(bcrypt.compare).toHaveBeenCalled();
            expect(result).toEqual(expectedError);
        });
    });

});
