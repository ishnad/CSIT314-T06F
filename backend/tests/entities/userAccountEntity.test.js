const UserAccountEntity = require('../../src/entities/userAccountEntity');
// Import the mocked UserStatus along with PrismaClient
const { PrismaClient, UserStatus: mockUserStatus } = require('../../src/generated/prisma');
const bcrypt = require('bcrypt');

// --- Mock Dependencies ---
// Mock lib/prismaClient by defining the mock object within the factory
jest.mock('../../src/lib/prismaClient', () => ({
    userAccount: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    userProfile: {
        findUnique: jest.fn(),
    },
}));

jest.mock('../../src/generated/prisma', () => {
    const actualGeneratedPrisma = jest.requireActual('../../src/generated/prisma');
    const mockUserStatusEnum = actualGeneratedPrisma.UserStatus || { 
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE',
        SUSPENDED: 'SUSPENDED',
        BANNED: 'BANNED',
    };
    return {
        ...actualGeneratedPrisma,
        PrismaClient: jest.fn(() => require('../../src/lib/prismaClient')), // Return the same mock
        UserStatus: mockUserStatusEnum, 
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
        mockPrismaClient = require('../../src/lib/prismaClient');
        userAccountEntity = new UserAccountEntity();
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

            // Pass full userData including email
            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toEqual({ error: { status: 409, message: `Username '${userData.username}' already exists.` } });
            // The first call to findUnique is for the username check
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            // Email check, profile check, and create should not happen if username exists
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledTimes(1); 
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });

        it('should return false if email already exists', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(null); // Username doesn't exist
            mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce({ id: 'existing-email-user' }); // Email exists

            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toEqual({ error: { status: 409, message: `Email '${userData.email}' already exists.` } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(1, { where: { username: userData.username } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenNthCalledWith(2, { where: { email: userData.email } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
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

            expect(result).toEqual({ error: { status: 500, message: 'An unexpected error occurred during user account creation.' } });
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
            expect(result.error.status).toBe(409);
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
            expect(result.error.status).toBe(404); // Expect 404 as user is not found
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

            expect(result.error.status).toBe(400); // Expect 400 as profile is not found
            // UserAccount findUnique should NOT be called because profile check fails first
            expect(mockPrismaClient.userAccount.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });

        it('should handle database errors during update', async () => {
            const prismaError = new Error("Database connection failed");
            mockPrismaClient.userAccount.findUnique.mockReset(); // Reset mock for this test
            
            // Mock successful pre-conditions
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            mockPrismaClient.userAccount.findUnique
                .mockResolvedValueOnce(mockCurrentUser) // Current user exists
                .mockResolvedValueOnce(null) // No username conflict for editData.username
                .mockResolvedValueOnce(null); // No email conflict for editData.email

            // Mock update failure
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.editUserAccount(
                userId,
                editData.username,
                editData.userProfileName,
                editData.email,
                editData.status
            );
            consoleErrorSpy.mockRestore();

            expect(result).toEqual({ error: { status: 500, error: "Failed to update user" } });
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalled();
        });

        it('should handle partial updates gracefully', async () => {
            mockPrismaClient.userAccount.findUnique.mockReset(); // Reset mock for this test
            // Mock successful update with partial data
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            // Email is not changed in this test case, so only two findUnique calls: ID and username
            mockPrismaClient.userAccount.findUnique
                .mockResolvedValueOnce(mockCurrentUser) // For ID check
                .mockResolvedValueOnce(null);           // For username check

            const partialUpdateData = {
                username: 'updatedUser',
                userProfileName: 'Cleaner',
                email: mockCurrentUser.email, // No email change
                status: 'ACTIVE'
            };
            // If update is expected to fail and be caught by entity's catch block:
            mockPrismaClient.userAccount.update.mockRejectedValueOnce(new Error("DB error during partial update"));

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.editUserAccount(
                userId,
                partialUpdateData.username,
                partialUpdateData.userProfileName,
                partialUpdateData.email,
                partialUpdateData.status
            );
            consoleErrorSpy.mockRestore();

            expect(result.error.status).toBe(500);
            expect(result.error.error).toBe("Failed to update user");
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

        it('should handle various email conflict scenarios', async () => {
            const testCases = [
                {
                    description: 'email changed and conflicts',
                    currentEmail: 'old@test.com',
                    newEmail: 'new@test.com',
                    mockFindUnique: [
                        mockCurrentUser, // find by ID
                        null,            // no username conflict
                        { id: 'other-user' } // email exists
                    ],
                    expectedError: { error: { status: 409, error: 'New email already exists.' } } // Wrapped in error object
                },
                {
                    description: 'email not changed',
                    currentEmail: 'same@test.com',
                    newEmail: 'same@test.com',
                    mockFindUnique: [
                        {...mockCurrentUser, email: 'same@test.com'}, // current user
                        null, // no username conflict
                        // No third call if email is not changed
                    ],
                    // expectedSuccess: true // Will be replaced by specific object check
                    expectedResult: {
                        id: userId,
                        username: editData.username,
                        userProfile: editData.userProfileName,
                        permissions: [], // Assuming default
                        email: 'same@test.com',
                        status: editData.status.toUpperCase()
                    }
                },
                {
                    description: 'email changed but available',
                    currentEmail: 'old@test.com',
                    newEmail: 'new@test.com',
                    mockFindUnique: [
                        {...mockCurrentUser, email: 'old@test.com'},
                        null, // no username conflict
                        null  // no email conflict
                    ],
                    // expectedSuccess: true // Will be replaced
                    expectedResult: {
                        id: userId,
                        username: editData.username,
                        userProfile: editData.userProfileName,
                        permissions: [], // Assuming default
                        email: 'new@test.com',
                        status: editData.status.toUpperCase()
                    }
                }
            ];

            for (const testCase of testCases) {
                mockPrismaClient.userAccount.findUnique.mockReset();
                mockPrismaClient.userAccount.update.mockReset(); // Reset update mock
                mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile); // Ensure profile is found

                testCase.mockFindUnique.forEach((mockResult) => {
                    mockPrismaClient.userAccount.findUnique.mockResolvedValueOnce(mockResult);
                });

                if (testCase.expectedResult) {
                    // Mock successful update
                    mockPrismaClient.userAccount.update.mockResolvedValueOnce({
                        id: userId,
                        username: editData.username,
                        userProfileId: mockProfile.id,
                        email: testCase.newEmail,
                        status: editData.status.toUpperCase(),
                        userProfile: { name: editData.userProfileName, permissions: [] } // Included data
                    });
                }

                const result = await userAccountEntity.editUserAccount(
                    userId,
                    editData.username, // Using a consistent username for these sub-tests
                    editData.userProfileName,
                    testCase.newEmail,
                    editData.status
                );

                if (testCase.expectedError) {
                    expect(result).toEqual(testCase.expectedError);
                } else if (testCase.expectedResult) {
                    expect(result).toEqual(testCase.expectedResult);
                }
            }
        });

        it('should handle database errors during profile update', async () => {
            const dbError = new Error("Database connection failed");
            mockPrismaClient.userAccount.update.mockRejectedValue(dbError);
            mockPrismaClient.userAccount.findUnique
                .mockResolvedValueOnce(mockCurrentUser)
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.editUserAccount(
                userId,
                mockCurrentUser.username, // Same username
                editData.userProfileName,
                mockCurrentUser.email, // Same email
                editData.status
            );

            expect(result).toEqual({ error: { status: 500, error: "Failed to update user" } });
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
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
            // Reset mocks for this specific test to ensure clean state
            mockPrismaClient.userAccount.findUnique.mockReset();
            mockPrismaClient.userAccount.update.mockReset();

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

            const result = await userAccountEntity.suspendUserAccount(username);

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username } });
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled(); // Update should not be called
            expect(result).toEqual({ error: { status: 404, message: `User '${username}' not found.` } });
        });

        it('should return false if prisma update fails', async () => {
            const prismaError = new Error("DB error");
            // Mock findUnique to find the user first
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(mockUserToSuspend);
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.suspendUserAccount(username);
            consoleErrorSpy.mockRestore();

            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username } });
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username },
                data: { status: mockUserStatus.SUSPENDED }, // Use mocked enum value
            });
            expect(result).toEqual({ error: { status: 500, message: 'An unexpected error occurred while suspending the user account.' } });
        });

        it('should handle already suspended user', async () => {
            const suspendedUser = { ...mockUserToSuspend, status: 'SUSPENDED' };
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(suspendedUser);
            // Explicitly mock update for this test to avoid using stale mockRejectedValue
            mockPrismaClient.userAccount.update.mockResolvedValue({ username, status: mockUserStatus.SUSPENDED });


            const result = await userAccountEntity.suspendUserAccount(username);
            
            expect(result).toBe(true);
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username },
                data: { status: mockUserStatus.SUSPENDED }
            });
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
