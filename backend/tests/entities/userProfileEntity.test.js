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

    // --- Test validateUserProfileInput ---
    describe('validateUserProfileInput', () => {
        it('should return null for valid input (name only)', () => {
            // Permissions are optional, description is not part of validation
            const result = userProfileEntity.validateUserProfileInput('ValidName', undefined);
            expect(result).toBeNull();
        });

        it('should return null for valid input (name and permissions)', () => {
            const result = userProfileEntity.validateUserProfileInput('ValidName', ['READ', 'WRITE']);
            expect(result).toBeNull();
        });

        it('should return error if permissions is not an array', () => {
             const expectedError = { status: 400, error: 'Permissions must be an array of strings.' };
             expect(userProfileEntity.validateUserProfileInput('ValidName', 'not-an-array')).toEqual(expectedError);
        });

         it('should return error if permissions array contains non-strings', () => {
             // Update the expected error message to match the actual implementation
             const expectedError = { status: 400, error: 'Each permission must be a string.' };
             expect(userProfileEntity.validateUserProfileInput('ValidName', ['READ', 123])).toEqual(expectedError);
        });


        it('should return error if name is missing', () => {
            const expectedError = { status: 400, error: 'Profile name is required and cannot be empty.' };
            expect(userProfileEntity.validateUserProfileInput('', 'Desc')).toEqual(expectedError);
            expect(userProfileEntity.validateUserProfileInput(null, 'Desc')).toEqual(expectedError);
            expect(userProfileEntity.validateUserProfileInput(undefined, 'Desc')).toEqual(expectedError);
            expect(userProfileEntity.validateUserProfileInput('   ', 'Desc')).toEqual(expectedError); // Whitespace only
        });

        it('should return null if description is missing (optional)', () => {
             const result = userProfileEntity.validateUserProfileInput('ValidNameOnly');
             expect(result).toBeNull();
        });
    });


    // --- Test createUserProfile ---
    describe('createUserProfile', () => {
        // Include permissions in test data and expectations
        const profileData = { name: 'NewProfile', permissions: ['READ'] };
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
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist
            mockPrismaClient.userProfile.create.mockResolvedValue(expectedProfile);

            const result = await userProfileEntity.createUserProfile(profileData);

            // Assertions
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileData.name } });
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalledWith({
                data: {
                    name: profileData.name,
                    permissions: profileData.permissions, // Include permissions
                    status: 'ACTIVE', // Default status from entity
                },
                select: { id: true, name: true, permissions: true, status: true, createdAt: true },
            });
            // expectedProfile now includes status, so direct comparison is fine.
            // Using expect.objectContaining to be robust against minor differences in Date objects if not mocked perfectly.
            expect(result).toBe(true);
        });

         it('should create a new user profile successfully without permissions (defaults to empty array)', async () => {
            // Mock Prisma calls
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist
            mockPrismaClient.userProfile.create.mockResolvedValue(expectedProfileNoPerms);

            const result = await userProfileEntity.createUserProfile(profileDataNoPerms);

            // Assertions
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileDataNoPerms.name } });
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalledWith({
                data: {
                    name: profileDataNoPerms.name,
                    permissions: [], // Ensure empty array is passed when permissions are undefined
                    status: 'ACTIVE', // Default status from entity
                },
                select: { id: true, name: true, permissions: true, status: true, createdAt: true },
            });
            // expectedProfileNoPerms now includes status.
            expect(result).toBe(true);
        });

         it('should return validation error if permissions is not an array', async () => {
            const invalidData = { name: 'TestPerms', permissions: 'not-an-array' };
            const expectedError = { error: { status: 400, error: 'Permissions must be an array of strings.' } };
            const result = await userProfileEntity.createUserProfile(invalidData);
            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.create).not.toHaveBeenCalled();
         });

        it('should return validation error if profile name is missing', async () => {
            const invalidData = { name: '', permissions: [] };
            const expectedError = { error: { status: 400, error: 'Profile name is required and cannot be empty.' } };

            const result = await userProfileEntity.createUserProfile(invalidData);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.create).not.toHaveBeenCalled();
        });

        it('should return conflict error if profile name already exists', async () => {
            const existingProfile = { id: 'existing-id', name: profileData.name };
            const expectedError = { error: { status: 409, error: 'A profile with this name already exists.' } };

            // Mock findUnique to return an existing profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(existingProfile);

            const result = await userProfileEntity.createUserProfile(profileData);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileData.name } });
            expect(mockPrismaClient.userProfile.create).not.toHaveBeenCalled();
        });

        it('should return server error if prisma create fails', async () => {
            const prismaError = new Error("Database connection failed");
            const expectedError = { error: { status: 500, error: 'Failed to create user profile due to a server error.' } };

            // Mock findUnique to return null
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null);
            // Mock create to throw an error
            mockPrismaClient.userProfile.create.mockRejectedValue(prismaError);

            // Silence console.error for this specific test case
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            const result = await userProfileEntity.createUserProfile(profileData);
            consoleErrorSpy.mockRestore(); // Restore console.error

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileData.name } });
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
            const mockReturn = { ...updatedProfileMock, name: expectedData.name, status: 'ACTIVE' }; // Add status
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check for name conflict (none)
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturn);

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: expectedData.name }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData,
                select: { id: true, name: true, permissions: true, status: true, createdAt: true, updatedAt: true }, // Add status
            });
            expect(result).toBe(true);
        });

        // --- Split description tests ---
        it('should update profile permissions successfully', async () => {
            // Adjust expectation: The entity currently doesn't trim individual permissions
            const expectedDataPerms = { permissions: [' NEW ', ' PERMS '] };
            const mockReturnPerms = { ...updatedProfileMock, name: existingProfile.name, permissions: expectedDataPerms.permissions, status: 'ACTIVE' }; // Add status
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            // No name conflict check needed if name isn't changing
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturnPerms);

            const resultPerms = await userProfileEntity.updateUserProfile(profileId, updateDataPermsOnly);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataPerms,
                select: { id: true, name: true, permissions: true, status: true, createdAt: true, updatedAt: true }, // Add status
            });
            expect(resultPerms).toBe(true);
        });

        it('should update profile permissions to an empty array successfully', async () => {
            const expectedDataEmpty = { permissions: [] };
            const mockReturnEmpty = { ...updatedProfileMock, name: existingProfile.name, permissions: [], status: 'ACTIVE' }; // Add status
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile);
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturnEmpty);

            const resultEmpty = await userProfileEntity.updateUserProfile(profileId, { permissions: [] }); // Empty array

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataEmpty,
                select: { id: true, name: true, permissions: true, status: true, createdAt: true, updatedAt: true }, // Add status
            });
            expect(resultEmpty).toBe(true);
        });
        // --- End split description tests ---


         it('should update both name and permissions successfully', async () => {
            const expectedData = { name: 'BothUpdated', permissions: ['BOTH'] }; // Correct expected data
            const mockReturn = { ...updatedProfileMock, ...expectedData, status: 'ACTIVE' }; // Use spread for updated fields and add status
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check name conflict
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturn);

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataBoth);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: expectedData.name }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData, // Expect both fields
                select: { id: true, name: true, permissions: true, status: true, createdAt: true, updatedAt: true }, // Add status
            });
            expect(result).toBe(true);
        });


        it('should return error if no fields are provided for update', async () => {
            // Update expected error message
            const expectedError = { error: { status: 400, error: 'At least name or permissions must be provided for update.' } };
            const result = await userProfileEntity.updateUserProfile(profileId, {}); // Empty update data
            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.update).not.toHaveBeenCalled();
        });

         it('should return error if name is provided but empty after trimming', async () => {
            const expectedError = { error: { status: 400, error: 'Profile name cannot be empty.' } };
            const result = await userProfileEntity.updateUserProfile(profileId, { name: '   ' }); // Whitespace only name
            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
            expect(mockPrismaClient.userProfile.update).not.toHaveBeenCalled();
        });

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
            const expectedData = { name: existingProfile.name, permissions: ['NEW'] }; // Data sent to update
            const mockReturn = { ...updatedProfileMock, name: existingProfile.name, permissions: ['NEW'], status: 'ACTIVE' }; // What prisma returns, add status
            // Reset mocks
            mockPrismaClient.userProfile.findUnique.mockReset();
            mockPrismaClient.userProfile.update.mockReset();
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            // Name conflict check is skipped because new name === existing name
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturn);

            const result = await userProfileEntity.updateUserProfile(profileId, sameNameData);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            // Second findUnique (for conflict) should NOT have been called
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData, // Data to update (includes permissions)
                select: { id: true, name: true, permissions: true, status: true, createdAt: true, updatedAt: true }, // Add status
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
            mockPrismaClient.userProfile.update.mockResolvedValue({ ...existingProfile, status: newStatus }); // Prisma returns object

            const result = await userProfileEntity.updateProfileStatus(profileId, newStatus);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: { status: newStatus },
                select: expect.any(Object), // Select is still used by Prisma, but entity returns boolean
            });
            expect(result).toBe(true);
        });

        it('should return 400 if profileId is missing', async () => {
            const result = await userProfileEntity.updateProfileStatus(null, newStatus);
            expect(result).toEqual({ error: { status: 400, error: 'Profile ID is required.' } });
        });

        it('should return 400 if newStatus is invalid', async () => {
            const result = await userProfileEntity.updateProfileStatus(profileId, 'INVALID_STATUS');
            expect(result.error.status).toBe(400);
            expect(result.error.error).toContain('Invalid status provided.');
        });

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

        it('should return 400 error if profile name is missing or empty', async () => {
            const expectedError = { error: { status: 400, error: 'Profile name is required for simulation.' } };

            expect(await userProfileEntity.simulateProfile('')).toEqual(expectedError);
            expect(await userProfileEntity.simulateProfile('   ')).toEqual(expectedError);
            expect(await userProfileEntity.simulateProfile(null)).toEqual(expectedError);
            expect(await userProfileEntity.simulateProfile(undefined)).toEqual(expectedError);
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

        it('should return 400 error for invalid filter type', async () => {
            const result = await userProfileEntity.searchUserProfiles({ filter: 'id', keyword: 'some-id' });
            expect(result).toEqual({ error: { status: 400, error: "Invalid filter provided. Only searching by 'name' is supported." } });
            expect(mockPrismaClient.userProfile.findUnique).not.toHaveBeenCalled();
        });

        it('should return 400 error if filter is missing', async () => {
            const result = await userProfileEntity.searchUserProfiles({ keyword: profileNameKeyword });
            expect(result).toEqual({ error: { status: 400, error: "Invalid filter provided. Only searching by 'name' is supported." } });
        });

        it('should return 400 error if keyword is missing', async () => {
            const result = await userProfileEntity.searchUserProfiles({ filter: 'name', keyword: '' });
            expect(result).toEqual({ error: { status: 400, error: 'Keyword (profile name) is required for search.' } });
        });
         it('should return 400 error if keyword is whitespace only', async () => {
            const result = await userProfileEntity.searchUserProfiles({ filter: 'name', keyword: '   ' });
            expect(result).toEqual({ error: { status: 400, error: 'Keyword (profile name) is required for search.' } });
        });

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
