const UserProfileEntity = require('../../src/entities/userProfileEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
    const mockPrisma = {
        userProfile: {
            findUnique: jest.fn(),
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
    };
    // Define mockUserStatus INSIDE the factory function, similar to userAccountEntity.test.js
    const mockUserProfileStatus = {
        ACTIVE: 'ACTIVE',
        SUSPENDED: 'SUSPENDED',
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        UserProfileStatus: mockUserProfileStatus, // Provide the mocked enum
    };
});

// --- Test Suite ---
describe('UserProfileEntity', () => {
    let userProfileEntity;
    let mockPrismaClient;

    beforeEach(() => {
        // Reset mocks and get fresh instances before each test
        jest.clearAllMocks();
        userProfileEntity = new UserProfileEntity();
        mockPrismaClient = new PrismaClient(); // Get reference to the mocked instance
    });

    // --- Test createUserProfile ---
    describe('createUserProfile', () => {
        // Include permissions in test data and expectations
        const profileData = { name: ' NewProfile ', permissions: ['READ'] }; // Name with whitespace
        const profileDataNoPerms = { name: 'NewProfileNoPerms' };
        const expectedProfile = {
            id: 'profile-id-123',
            name: profileData.name,
            permissions: profileData.permissions,
            status: 'ACTIVE', // Add status here
            createdAt: new Date(),
        };
         const expectedProfileNoPerms = {
            id: 'profile-id-456',
            name: profileDataNoPerms.name,
            permissions: [], // Expect empty array when permissions are omitted
            status: 'ACTIVE', // Add status here
            createdAt: new Date(),
        };

        it('should create a new user profile successfully with permissions', async () => {
            // Mock Prisma calls
            // Mock Prisma calls
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist
            // Prisma's create doesn't return the full object by default unless selected
            mockPrismaClient.userProfile.create.mockResolvedValue({ id: 'profile-id-123' }); 

            const result = await userProfileEntity.createUserProfile(profileData);

            // Assertions
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'NewProfile' } }); // Trimmed name
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalledWith({
                data: {
                    name: 'NewProfile', // Trimmed name
                    permissions: profileData.permissions,
                    status: 'ACTIVE', 
                },
                select: { id: true },
            });
            expect(result).toBe(true);
        });

         it('should create a new user profile successfully without permissions (defaults to empty array)', async () => {
            // Mock Prisma calls
            // Mock Prisma calls
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist
            mockPrismaClient.userProfile.create.mockResolvedValue({ id: 'profile-id-456' });

            const result = await userProfileEntity.createUserProfile(profileDataNoPerms);

            // Assertions
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileDataNoPerms.name } });
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalledWith({
                data: {
                    name: profileDataNoPerms.name,
                    permissions: [], 
                    status: 'ACTIVE', 
                },
                select: { id: true },
            });
            expect(result).toBe(true);
        });

         // Removed test for 'permissions is not an array' as this is a front-end responsibility.
         // The entity now assumes `permissions` is an array if provided.

        // Removed test for 'profile name is empty' as this is a front-end responsibility.
        // The entity assumes `name` is not empty. If it is, Prisma might error or create an empty named profile.

        it('should return conflict error if profile name already exists', async () => {
            const existingProfile = { id: 'existing-id', name: profileData.name };
            const expectedError = { error: { status: 409, error: 'A profile with this name already exists.' } };

            // Mock findUnique to return an existing profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(existingProfile);

            const result = await userProfileEntity.createUserProfile(profileData);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileData.name.trim() } });
            expect(mockPrismaClient.userProfile.create).not.toHaveBeenCalled();
        });

        it('should return server error if prisma create fails', async () => {
            const prismaError = new Error("Database connection failed");
            const expectedError = { error: { status: 500, error: 'Failed to create user profile due to a server error.' } };

            // Mock findUnique to return null
            // Mock findUnique to return null
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null);
            // Mock create to throw an error
            mockPrismaClient.userProfile.create.mockRejectedValue(prismaError);

            // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.createUserProfile({ name: 'NewProfile', permissions: ['READ'] }); // Use a valid name for the call
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'NewProfile' } });
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalled(); // It was called, but it threw an error
        });
    });

    // --- Test listUserProfiles ---
    describe('listUserProfiles', () => {
        // Include permissions and status in mock data
        const mockProfilesRaw = [
            { id: 'p1', name: 'Admin', permissions: ['ADMIN', 'READ', 'WRITE'], status: 'ACTIVE', createdAt: new Date(), _count: { userAccounts: 5 } },
            { id: 'p2', name: 'Editor', permissions: ['READ', 'WRITE'], status: 'SUSPENDED', createdAt: new Date(), _count: { userAccounts: 10 } },
            { id: 'p3', name: 'Viewer', permissions: ['READ'], status: 'ACTIVE', createdAt: new Date(), _count: { userAccounts: 2 } },
        ];
         const mockProfilesExpected = [
            { id: 'p1', name: 'Admin', permissions: ['ADMIN', 'READ', 'WRITE'], status: 'ACTIVE', createdAt: mockProfilesRaw[0].createdAt, userAccountCount: 5, _count: undefined },
            { id: 'p2', name: 'Editor', permissions: ['READ', 'WRITE'], status: 'SUSPENDED', createdAt: mockProfilesRaw[1].createdAt, userAccountCount: 10, _count: undefined },
            { id: 'p3', name: 'Viewer', permissions: ['READ'], status: 'ACTIVE', createdAt: mockProfilesRaw[2].createdAt, userAccountCount: 2, _count: undefined },
        ];

        beforeEach(() => {
            // Ensure findMany is part of the mock if not already added
            if (!mockPrismaClient.userProfile.findMany) {
                 mockPrismaClient.userProfile.findMany = jest.fn();
            }
        });

        it('should return a list of all user profiles with user account counts', async () => {
            mockPrismaClient.userProfile.findMany.mockResolvedValue(mockProfilesRaw);

            const result = await userProfileEntity.listUserProfiles();

            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalledWith({
                where: {},
                select: {
                    id: true,
                    name: true,
                    permissions: true, // Include permissions
                    status: true, // Add status
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
            // mockProfilesExpected now includes status and _count: undefined
            expect(result).toEqual(mockProfilesExpected);
        });

        it('should return a filtered list of user profiles based on keyword', async () => {
            const keyword = 'admin';
            // Ensure filteredRaw and filteredExpected are derived correctly based on the updated mockProfilesRaw/Expected
            const filteredRaw = [mockProfilesRaw.find(p => p.name.toLowerCase().includes(keyword))];
            const filteredExpected = [mockProfilesExpected.find(p => p.name.toLowerCase().includes(keyword))];
            mockPrismaClient.userProfile.findMany.mockResolvedValue(filteredRaw);

            const result = await userProfileEntity.listUserProfiles({ keyword });

            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalledWith({
                where: { name: { contains: keyword, mode: 'insensitive' } },
                 select: {
                    id: true,
                    name: true,
                    permissions: true, // Include permissions
                    status: true, // Add status
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
            // filteredExpected now includes status and _count: undefined
            expect(result).toEqual(filteredExpected);
        });

         it('should handle keyword with leading/trailing whitespace', async () => {
            const keyword = '  Editor  ';
            const trimmedKeyword = keyword.trim().toLowerCase();
            // Ensure filteredRaw and filteredExpected are derived correctly
            const filteredRaw = [mockProfilesRaw.find(p => p.name.toLowerCase().includes(trimmedKeyword))];
            const filteredExpected = [mockProfilesExpected.find(p => p.name.toLowerCase().includes(trimmedKeyword))];
            mockPrismaClient.userProfile.findMany.mockResolvedValue(filteredRaw);

            const result = await userProfileEntity.listUserProfiles({ keyword });

            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalledWith({
                where: { name: { contains: 'Editor', mode: 'insensitive' } }, // Trimmed keyword
                 select: {
                    id: true,
                    name: true,
                    permissions: true, // Include permissions
                    status: true, // Add status
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
            // filteredExpected now includes status and _count: undefined
            expect(result).toEqual(filteredExpected);
        });

        it('should return an empty list if no profiles match the keyword', async () => {
            const keyword = 'nonexistent';
            mockPrismaClient.userProfile.findMany.mockResolvedValue([]);

            const result = await userProfileEntity.listUserProfiles({ keyword });

            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalledWith({
                where: { name: { contains: keyword, mode: 'insensitive' } },
                 select: {
                    id: true,
                    name: true,
                    permissions: true, // Include permissions
                    status: true, // Add status
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
            expect(result).toEqual([]);
        });


        it('should return server error if prisma findMany fails', async () => {
            const prismaError = new Error("Database query failed");
            const expectedError = { error: { status: 500, error: 'Failed to retrieve user profiles due to a server error.' } };
            mockPrismaClient.userProfile.findMany.mockRejectedValue(prismaError);

            // Silence console.error for this test
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.listUserProfiles();
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalled();
        });
    });

    // --- Test updateUserProfile ---
    describe('updateUserProfile', () => {
        const profileId = 'profile-to-update-id';
        // Include permissions in existing profile and mock data
        const existingProfile = { id: profileId, name: 'OriginalName', permissions: ['OLD'] };
        const updateDataNameOnly = { name: ' Updated Name ' }; // With whitespace
        const updateDataPermsOnly = { permissions: [' NEW ', ' PERMS '] }; // With whitespace
        const updateDataBoth = { name: 'BothUpdated', permissions: ['BOTH'] };
        const updatedProfileMock = {
            id: profileId,
            name: 'Updated Name', // Assume trimmed name
            permissions: ['OLD'], // Assume permissions weren't updated here
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should update profile name successfully', async () => {
            const expectedData = { name: 'Updated Name' }; // Trimmed
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check for name conflict (none)
            mockPrismaClient.userProfile.update.mockResolvedValue({ id: profileId }); // Prisma update returns minimal data

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: expectedData.name }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData,
                select: { id: true },
            });
            expect(result).toBe(true);
        });

        // --- Split description tests ---
        it('should update profile permissions successfully', async () => {
            const expectedDataPerms = { permissions: [' NEW ', ' PERMS '] }; // Permissions are not trimmed by current entity logic
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.update.mockResolvedValue({ id: profileId });

            const resultPerms = await userProfileEntity.updateUserProfile(profileId, updateDataPermsOnly);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataPerms,
                select: { id: true },
            });
            expect(resultPerms).toBe(true);
        });

        it('should update profile permissions to an empty array successfully', async () => {
            const expectedDataEmpty = { permissions: [] };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile);
            mockPrismaClient.userProfile.update.mockResolvedValue({ id: profileId });

            const resultEmpty = await userProfileEntity.updateUserProfile(profileId, { permissions: [] }); // Empty array

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataEmpty,
                select: { id: true },
            });
            expect(resultEmpty).toBe(true);
        });
        // --- End split description tests ---


         it('should update both name and permissions successfully', async () => {
            const expectedData = { name: 'BothUpdated', permissions: ['BOTH'] };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check name conflict
            mockPrismaClient.userProfile.update.mockResolvedValue({ id: profileId });

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataBoth);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: expectedData.name }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData, 
                select: { id: true },
            });
            expect(result).toBe(true);
        });

        // Removed tests for:
        // - no fields provided for update
        // - name provided but empty after trimming
        // as these are now front-end responsibilities.
        // The entity assumes profileId is present and data (if provided) is in a valid basic format.

        it('should return 404 error if profile to update is not found', async () => {
            const expectedError = { error: { status: 404, error: 'User profile not found.' } };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Target profile not found

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.update).not.toHaveBeenCalled();
        });

        it('should return 409 conflict error if new name already exists on another profile', async () => {
            const conflictingProfile = { id: 'another-profile-id' };
            const expectedError = { error: { status: 409, error: 'A profile with this name already exists.' } };
            // Reset mocks specifically for this sequence
            mockPrismaClient.userProfile.findUnique.mockReset();
            mockPrismaClient.userProfile.findUnique
                .mockResolvedValueOnce(existingProfile) // Find target profile - SUCCESS
                .mockResolvedValueOnce(conflictingProfile); // Check name conflict - FOUND

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);

            expect(result).toEqual(expectedError); // Should now be 409
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'Updated Name' }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).not.toHaveBeenCalled();
        });

         it('should allow updating if new name exists but belongs to the same profile (no actual name change)', async () => {
            // Simulate providing the same name it already has, but maybe different permissions
            const sameNameData = { name: existingProfile.name, permissions: ['NEW'] };
            const expectedData = { name: existingProfile.name, permissions: ['NEW'] };
            // Reset mocks
            mockPrismaClient.userProfile.findUnique.mockReset();
            mockPrismaClient.userProfile.update.mockReset();
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.update.mockResolvedValue({ id: profileId });

            const result = await userProfileEntity.updateUserProfile(profileId, sameNameData);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledTimes(1); // Conflict check skipped
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData,
                select: { id: true },
            });
            expect(result).toBe(true);
        });

        it('should return server error if prisma update fails', async () => {
            const prismaError = new Error("DB connection failed");
            const expectedError = { error: { status: 500, error: 'Failed to update user profile due to a server error.' } };
            // Reset mocks for sequence
            mockPrismaClient.userProfile.findUnique.mockReset();
            mockPrismaClient.userProfile.update.mockReset();
            mockPrismaClient.userProfile.findUnique
                .mockResolvedValueOnce(existingProfile) // Find target profile - SUCCESS
                .mockResolvedValueOnce(null); // Check name conflict - NONE
            mockPrismaClient.userProfile.update.mockRejectedValue(prismaError); // Mock update failure

             // Silence console.error for this test
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledTimes(2); // Called for target and conflict check
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalled();
        });
    });

    // --- Test updateProfileStatus (after renaming from updateUserProfileStatus) ---
    describe('updateProfileStatus', () => {
        const profileId = 'profile-status-id';
        const newStatus = 'SUSPENDED'; // Using UserProfileStatus.SUSPENDED
        const existingProfile = { id: profileId, name: 'TestProfile', status: 'ACTIVE' }; // UserProfileStatus.ACTIVE
        // const updatedProfileMock = { ...existingProfile, status: newStatus, userAccountCount: 0, _count: undefined }; // No longer returns profile

        it('should update profile status successfully and return true', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(existingProfile);
            mockPrismaClient.userProfile.update.mockResolvedValue({ id: profileId, status: newStatus });

            const result = await userProfileEntity.updateProfileStatus(profileId, newStatus);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: { status: newStatus },
                select: { id: true },
            });
            expect(result).toBe(true);
        });

        // Basic input validation tests (missing profileId, invalid status) are removed
        // as these are now front-end responsibilities.
        // Entity tests focus on business logic and interaction with Prisma.

        it('should return 404 if profile not found', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null);
            const result = await userProfileEntity.updateProfileStatus(profileId, newStatus);
            expect(result).toEqual({ error: { status: 404, error: 'User profile not found.' } });
        });

        it('should return 500 if prisma update fails', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(existingProfile);
            mockPrismaClient.userProfile.update.mockRejectedValue(new Error('DB Error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.updateProfileStatus(profileId, newStatus);
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to update user profile status due to a server error.' } });
        });
    });


    // --- Test simulateProfile ---
    describe('simulateProfile', () => {
        const profileName = ' Test Profile '; // With whitespace
        const trimmedProfileName = 'Test Profile';
        // Include permissions in mock data
        const mockProfile = {
            id: 'sim-profile-id',
            name: trimmedProfileName,
            permissions: ['SIM_READ', 'SIM_WRITE'],
        };

        it('should return profile data for a valid profile name', async () => {
            const mockProfileWithStatus = { ...mockProfile, status: 'ACTIVE' }; // Add status
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfileWithStatus);

            const result = await userProfileEntity.simulateProfile(profileName);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({
                where: { name: trimmedProfileName },
                select: {
                    id: true,
                    name: true,
                    permissions: true, // Include permissions
                    status: true, // Add status
                }
            });
            expect(result).toEqual(mockProfileWithStatus);
        });

        it('should return 400 error if profile name is empty (entity safeguard)', async () => {
            const expectedError = { error: { status: 400, error: 'Profile name cannot be empty for simulation.' } };
            expect(await userProfileEntity.simulateProfile('')).toEqual(expectedError);
            expect(await userProfileEntity.simulateProfile('   ')).toEqual(expectedError);
            // Null/undefined would likely be caught by `profileName.trim()` if profileName is not checked for truthiness first.
            // For simplicity, testing empty/whitespace.
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
        });

        it('should return 404 error if profile is not found', async () => {
            const expectedError = { error: { status: 404, error: `User profile '${trimmedProfileName}' not found.` } };
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Simulate not found

            const result = await userProfileEntity.simulateProfile(profileName);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({
                where: { name: trimmedProfileName },
                select: { id: true, name: true, permissions: true, status: true } // Add status
            });
            expect(result).toEqual(expectedError);
        });

        it('should return 500 error if prisma findUnique fails', async () => {
            const prismaError = new Error("Database connection failed");
            const expectedError = { error: { status: 500, error: 'Failed to retrieve user profile for simulation due to a server error.' } };
            mockPrismaClient.userProfile.findUnique.mockRejectedValue(prismaError);

            // Silence console.error for this test
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.simulateProfile(profileName);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({
                where: { name: trimmedProfileName },
                select: { id: true, name: true, permissions: true, status: true } // Add status
            });
            expect(result).toEqual(expectedError);
        });
    });

    // --- Test searchUserProfiles ---
    describe('searchUserProfiles', () => {
        const profileNameKeyword = 'TestProfileForSearch';
        const mockProfileData = {
            id: 'profile-search-id',
            name: profileNameKeyword,
            permissions: ['SEARCH_PERM'],
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const mockUserAccountsData = [
            { id: 'user-acc-1', username: 'userOne', email: 'one@test.com', status: 'ACTIVE', createdAt: new Date() },
            { id: 'user-acc-2', username: 'userTwo', email: 'two@test.com', status: 'ACTIVE', createdAt: new Date() },
        ];
        const mockProfileWithAccounts = { ...mockProfileData, userAccounts: mockUserAccountsData };
        const mockProfileWithoutAccounts = { ...mockProfileData, userAccounts: [] };

        it('should return profile with accounts if filter is "name" and profile exists', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfileWithAccounts);
            const result = await userProfileEntity.searchUserProfiles({ filter: 'name', keyword: profileNameKeyword });

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({
                where: { name: profileNameKeyword },
                include: {
                    userAccounts: {
                        select: { id: true, username: true, email: true, status: true, createdAt: true },
                        orderBy: { username: 'asc' }
                    }
                }
            });
            expect(result).toEqual(mockProfileWithAccounts);
        });

        it('should return profile with empty accounts array if profile exists but has no accounts', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(mockProfileWithoutAccounts);
            const result = await userProfileEntity.searchUserProfiles({ filter: 'name', keyword: profileNameKeyword });
            expect(result).toEqual(mockProfileWithoutAccounts);
        });

        it('should return 404 error if profile name not found', async () => {
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null);
            const result = await userProfileEntity.searchUserProfiles({ filter: 'name', keyword: 'NonExistentProfile' });
            expect(result).toEqual({ error: { status: 404, error: "User profile with name 'NonExistentProfile' not found." } });
        });

        // Removed tests for invalid filter type and empty/missing keyword,
        // as these are now front-end responsibilities or handled by controller context.
        // The entity now assumes `filter` will be 'name' and `keyword` will be non-empty if provided.

        it('should return 500 error if Prisma findUnique fails', async () => {
            const dbError = new Error('DB query failed');
            mockPrismaClient.userProfile.findUnique.mockRejectedValue(dbError);
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.searchUserProfiles({ filter: 'name', keyword: profileNameKeyword });
            consoleErrorSpy.mockRestore();
            expect(result).toEqual({ error: { status: 500, error: 'Failed to search user profile due to a server error.' } });
        });
    });
});
