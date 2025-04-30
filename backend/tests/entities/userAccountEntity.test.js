const UserAccountEntity = require('../../src/entities/userAccountEntity');
const { PrismaClient } = require('../../src/generated/prisma');
const bcrypt = require('bcrypt');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
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
        const userData = { username: 'newUser', password: 'password123', userProfileName: 'HomeOwner' };
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
                    password: hashedPassword,
                    userProfileId: mockProfile.id,
                },
                include: { userProfile: true },
            });
            expect(result).toEqual({
                id: createdUser.id,
                username: createdUser.username,
                userProfile: createdUser.userProfile.name,
                createdAt: createdUser.createdAt,
            });
        });

        it('should return error if user profile name is missing', async () => {
            const result = await userAccountEntity.createUserAccount({ username: 'test', password: 'pw' }); // Missing userProfileName
            expect(result).toEqual({ error: { status: 400, error: 'User profile name is required.' } });
            expect(mockPrismaClient.userAccount.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });

        it('should return error if username already exists', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue({ id: 'existing-user' }); // Username exists

            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toEqual({ error: { status: 409, error: 'Username already exists.' } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });

        it('should return error if user profile does not exist', async () => {
            mockPrismaClient.userAccount.findUnique.mockResolvedValue(null); // Username doesn't exist
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist

            const result = await userAccountEntity.createUserAccount(userData);

            expect(result).toEqual({ error: { status: 404, error: `User profile '${userData.userProfileName}' not found.` } });
            expect(mockPrismaClient.userAccount.findUnique).toHaveBeenCalledWith({ where: { username: userData.username } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: userData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.create).not.toHaveBeenCalled();
        });
    });

    // --- Test editUserAccount ---
    describe('editUserAccount', () => {
        const editData = { username: 'testUser', userProfileName: 'Cleaner', email: 'edit@test.com', status: 'ACTIVE' };
        const mockProfile = { id: 'profile-id-cleaner' };
        const updatedUser = {
            username: editData.username,
            userProfile: { name: editData.userProfileName },
            email: editData.email,
            status: editData.status,
        };

        it('should edit a user successfully', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            mockPrismaClient.userAccount.update.mockResolvedValue(updatedUser);

            const result = await userAccountEntity.editUserAccount(editData.username, editData.userProfileName, editData.email, editData.status);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username: editData.username },
                data: {
                    userProfileId: mockProfile.id,
                    email: editData.email,
                    status: editData.status,
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

        it('should return validation error for invalid input', async () => {
            const result = await userAccountEntity.editUserAccount('test', 'Prof', 'invalid-email', 'ACTIVE');
            expect(result).toEqual({ error: { status: 400, error: 'Invalid email format' } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });

         it('should return error if user profile does not exist', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist

            const result = await userAccountEntity.editUserAccount(editData.username, editData.userProfileName, editData.email, editData.status);

            expect(result).toEqual({ error: { status: 404, error: `User profile '${editData.userProfileName}' not found.` } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: editData.userProfileName }, select: { id: true } });
            expect(mockPrismaClient.userAccount.update).not.toHaveBeenCalled();
        });

        it('should return error if prisma update fails', async () => {
            const prismaError = new Error("DB error");
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfile);
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

            // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.editUserAccount(editData.username, editData.userProfileName, editData.email, editData.status);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual({ error: { status: 500, error: "Failed to update user" } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalled();
            expect(mockPrismaClient.userAccount.update).toHaveBeenCalled();
        });
    });

    // --- Test viewUserAccount ---
    describe('viewUserAccount', () => {
        const mockUsers = [
            { username: 'user1', email: 'u1@a.com', userProfile: { name: 'HomeOwner' }, status: 'ACTIVE', createdAt: new Date() },
            { username: 'user2', email: 'u2@b.com', userProfile: { name: 'Cleaner' }, status: 'ACTIVE', createdAt: new Date() },
        ];
        const expectedMappedUsers = mockUsers.map(u => ({ ...u, userProfile: u.userProfile.name }));

        it('should return all users if no filter/keyword provided', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.viewUserAccount(null, null);

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: {}, // Empty where clause
                select: {
                    username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
            expect(result).toEqual(expectedMappedUsers);
        });

        it('should filter by username', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[0]]); // Return only user1

            const result = await userAccountEntity.viewUserAccount('username', 'user1');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { username: { contains: 'user1', mode: 'insensitive' } },
                select: {
                    username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
            expect(result).toEqual([expectedMappedUsers[0]]);
        });

        it('should filter by userProfile name', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[1]]); // Return only user2 (Cleaner)

            const result = await userAccountEntity.viewUserAccount('userProfile', 'Cleaner');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { userProfile: { name: { equals: 'Cleaner' } } },
                select: {
                    username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
             expect(result).toEqual([expectedMappedUsers[1]]);
        });

         it('should filter by status', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.viewUserAccount('status', 'ACTIVE');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { status: { equals: 'ACTIVE' } },
                select: {
                    username: true, email: true, userProfile: { select: { name: true } }, status: true, createdAt: true
                }
            });
             expect(result).toEqual(expectedMappedUsers);
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

        it('should suspend a user successfully', async () => {
            mockPrismaClient.userAccount.update.mockResolvedValue({ username, status: 'SUSPENDED' }); // Simulate successful update

            const result = await userAccountEntity.suspendUserAccount(username);

            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username },
                data: { status: UserAccountEntity.STATUS_SUSPENDED },
            });
            expect(result).toBe(true);
        });

        it('should return false if prisma update fails', async () => {
            const prismaError = new Error("DB error");
            mockPrismaClient.userAccount.update.mockRejectedValue(prismaError);

             // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userAccountEntity.suspendUserAccount(username);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(mockPrismaClient.userAccount.update).toHaveBeenCalledWith({
                where: { username },
                data: { status: UserAccountEntity.STATUS_SUSPENDED },
            });
            expect(result).toBe(false);
        });
    });

    // --- Test searchUserAccount ---
    describe('searchUserAccount', () => {
         const mockUsers = [
            { username: 'searchUser1', email: 's1@a.com', userProfile: { name: 'HomeOwner' }, status: 'ACTIVE' },
            { username: 'searchUser2', email: 's2@b.com', userProfile: { name: 'Cleaner' }, status: 'ACTIVE' },
        ];
        const expectedMappedUsers = mockUsers.map(u => ({ username: u.username, email: u.email, userProfile: u.userProfile.name, status: u.status }));


        it('should search by username (contains, insensitive)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[0]]);

            const result = await userAccountEntity.searchUserAccount('username', 'searchUser');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { username: { contains: 'searchUser', mode: 'insensitive' } },
                select: { username: true, email: true, userProfile: { select: { name: true } }, status: true }
            });
            expect(result).toEqual([expectedMappedUsers[0]]);
        });

        it('should search by userProfile name (contains, insensitive)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue([mockUsers[1]]);

            const result = await userAccountEntity.searchUserAccount('userProfile', 'clean'); // Partial, case-insensitive

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { userProfile: { name: { contains: 'clean', mode: 'insensitive' } } },
                 select: { username: true, email: true, userProfile: { select: { name: true } }, status: true }
            });
            expect(result).toEqual([expectedMappedUsers[1]]);
        });

         it('should search by status (equals)', async () => {
            mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);

            const result = await userAccountEntity.searchUserAccount('status', 'ACTIVE');

            expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                where: { status: { equals: 'ACTIVE' } },
                 select: { username: true, email: true, userProfile: { select: { name: true } }, status: true }
            });
            expect(result).toEqual(expectedMappedUsers);
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
                 select: { username: true, email: true, userProfile: { select: { name: true } }, status: true }
             });
        });

         it('should handle search with filter but no keyword (other fields - might need refinement)', async () => {
             mockPrismaClient.userAccount.findMany.mockResolvedValue(mockUsers);
             await userAccountEntity.searchUserAccount('username', ''); // Empty keyword
             // Current implementation results in an empty where clause for non-profile fields when keyword is empty
             expect(mockPrismaClient.userAccount.findMany).toHaveBeenCalledWith({
                 where: {},
                 select: { username: true, email: true, userProfile: { select: { name: true } }, status: true }
             });
        });
    });

    // --- Test verifyLoginCredentials ---
    describe('verifyLoginCredentials', () => {
        const loginData = { username: 'adminUser', password: 'password123' };
        const mockUser = {
            username: loginData.username,
            password: 'hashedAdminPassword',
            status: 'active', // Use lowercase to match UserAccountEntity.STATUS_ACTIVE
            userProfile: { name: 'UserAdmin' }, // Correct profile
        };
        const mockUserWrongProfile = { ...mockUser, userProfile: { name: 'HomeOwner' } };
        // Ensure INACTIVE also matches potential enum/static definition if needed, assuming uppercase for now
        const mockUserInactive = { ...mockUser, status: 'INACTIVE' };

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