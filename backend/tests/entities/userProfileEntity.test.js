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
    return {
        PrismaClient: jest.fn(() => mockPrisma),
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
        it('should return null for valid input', () => {
            const result = userProfileEntity.validateUserProfileInput('ValidName', 'Valid Description');
            expect(result).toBeNull();
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
        const profileData = { name: 'NewProfile', description: 'A new test profile' };
        const profileDataNoDesc = { name: 'NewProfileNoDesc' };
        const expectedProfile = {
            id: 'profile-id-123',
            name: profileData.name,
            description: profileData.description,
            createdAt: new Date(),
        };
         const expectedProfileNoDesc = {
            id: 'profile-id-456',
            name: profileDataNoDesc.name,
            description: null, // Expect null when description is omitted
            createdAt: new Date(),
        };

        it('should create a new user profile successfully with description', async () => {
            // Mock Prisma calls
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist
            mockPrismaClient.userProfile.create.mockResolvedValue(expectedProfile);

            const result = await userProfileEntity.createUserProfile(profileData);

            // Assertions
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileData.name } });
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalledWith({
                data: {
                    name: profileData.name,
                    description: profileData.description,
                },
                select: { id: true, name: true, description: true, createdAt: true },
            });
            expect(result).toEqual(expectedProfile);
        });

         it('should create a new user profile successfully without description', async () => {
            // Mock Prisma calls
            mockPrismaClient.userProfile.findUnique.mockResolvedValue(null); // Profile doesn't exist
            mockPrismaClient.userProfile.create.mockResolvedValue(expectedProfileNoDesc);

            const result = await userProfileEntity.createUserProfile(profileDataNoDesc);

            // Assertions
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: profileDataNoDesc.name } });
            expect(mockPrismaClient.userProfile.create).toHaveBeenCalledWith({
                data: {
                    name: profileDataNoDesc.name,
                    description: null, // Ensure null is passed when description is undefined
                },
                select: { id: true, name: true, description: true, createdAt: true },
            });
            expect(result).toEqual(expectedProfileNoDesc);
        });

        it('should return validation error if profile name is missing', async () => {
            const invalidData = { name: '', description: 'Test' };
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
        const mockProfilesRaw = [
            { id: 'p1', name: 'Admin', description: 'Admin profile', createdAt: new Date(), _count: { userAccounts: 5 } },
            { id: 'p2', name: 'Editor', description: 'Editor profile', createdAt: new Date(), _count: { userAccounts: 10 } },
            { id: 'p3', name: 'Viewer', description: null, createdAt: new Date(), _count: { userAccounts: 2 } },
        ];
         const mockProfilesExpected = [
            { id: 'p1', name: 'Admin', description: 'Admin profile', createdAt: mockProfilesRaw[0].createdAt, userAccountCount: 5 },
            { id: 'p2', name: 'Editor', description: 'Editor profile', createdAt: mockProfilesRaw[1].createdAt, userAccountCount: 10 },
            { id: 'p3', name: 'Viewer', description: null, createdAt: mockProfilesRaw[2].createdAt, userAccountCount: 2 },
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
                    description: true,
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
            expect(result).toEqual(mockProfilesExpected);
        });

        it('should return a filtered list of user profiles based on keyword', async () => {
            const keyword = 'admin';
            const filteredRaw = [mockProfilesRaw[0]];
            const filteredExpected = [mockProfilesExpected[0]];
            mockPrismaClient.userProfile.findMany.mockResolvedValue(filteredRaw);

            const result = await userProfileEntity.listUserProfiles({ keyword });

            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalledWith({
                where: { name: { contains: keyword, mode: 'insensitive' } },
                 select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
            expect(result).toEqual(filteredExpected);
        });

         it('should handle keyword with leading/trailing whitespace', async () => {
            const keyword = '  Editor  ';
            const filteredRaw = [mockProfilesRaw[1]];
            const filteredExpected = [mockProfilesExpected[1]];
            mockPrismaClient.userProfile.findMany.mockResolvedValue(filteredRaw);

            const result = await userProfileEntity.listUserProfiles({ keyword });

            expect(mockPrismaClient.userProfile.findMany).toHaveBeenCalledWith({
                where: { name: { contains: 'Editor', mode: 'insensitive' } }, // Trimmed keyword
                 select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    _count: { select: { userAccounts: true } },
                },
                orderBy: { name: 'asc' },
            });
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
                    description: true,
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
        const existingProfile = { id: profileId, name: 'OriginalName' };
        const updateDataNameOnly = { name: ' Updated Name ' }; // With whitespace
        const updateDataDescOnly = { description: ' New Description ' }; // With whitespace
        const updateDataBoth = { name: 'BothUpdated', description: 'Both Desc' };
        const updatedProfileMock = {
            id: profileId,
            name: 'Updated Name', // Assume trimmed name
            description: 'Original Description', // Assume description wasn't updated here
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should update profile name successfully', async () => {
            const expectedData = { name: 'Updated Name' }; // Trimmed
            const mockReturn = { ...updatedProfileMock, name: expectedData.name };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check for name conflict (none)
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturn);

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: expectedData.name }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData,
                select: { id: true, name: true, description: true, createdAt: true, updatedAt: true },
            });
            expect(result).toEqual(mockReturn);
        });

        it('should update profile description successfully (including setting to null or empty)', async () => {
            const expectedDataDesc = { description: 'New Description' }; // Trimmed
            const mockReturnDesc = { ...updatedProfileMock, name: existingProfile.name, description: expectedDataDesc.description };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            // No name conflict check needed if name isn't changing
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturnDesc);

            const resultDesc = await userProfileEntity.updateUserProfile(profileId, updateDataDescOnly);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataDesc,
                select: { id: true, name: true, description: true, createdAt: true, updatedAt: true },
            });
            expect(resultDesc).toEqual(mockReturnDesc);

            // Test setting description to empty string
            const expectedDataEmpty = { description: '' };
            const mockReturnEmpty = { ...mockReturnDesc, description: '' };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile);
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturnEmpty);
            const resultEmpty = await userProfileEntity.updateUserProfile(profileId, { description: '  ' }); // Whitespace only
             expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataEmpty,
                select: { id: true, name: true, description: true, createdAt: true, updatedAt: true },
            });
            expect(resultEmpty).toEqual(mockReturnEmpty);

             // Test setting description to null
            const expectedDataNull = { description: null };
            const mockReturnNull = { ...mockReturnDesc, description: null };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile);
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturnNull);
            const resultNull = await userProfileEntity.updateUserProfile(profileId, { description: null });
             expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedDataNull,
                select: { id: true, name: true, description: true, createdAt: true, updatedAt: true },
            });
            expect(resultNull).toEqual(mockReturnNull);
        });

         it('should update both name and description successfully', async () => {
            const expectedData = { name: 'BothUpdated', description: 'Both Desc' };
            const mockReturn = { ...updatedProfileMock, ...expectedData };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check name conflict
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturn);

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataBoth);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: expectedData.name }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: expectedData,
                select: { id: true, name: true, description: true, createdAt: true, updatedAt: true },
            });
            expect(result).toEqual(mockReturn);
        });


        it('should return error if no fields are provided for update', async () => {
            const expectedError = { error: { status: 400, error: 'At least name or description must be provided for update.' } };
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
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(conflictingProfile); // Found conflict

            const result = await userProfileEntity.updateUserProfile(profileId, updateDataNameOnly);

            expect(result).toEqual(expectedError);
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { name: 'Updated Name' }, select: { id: true } });
            expect(mockPrismaClient.userProfile.update).not.toHaveBeenCalled();
        });

         it('should allow updating if new name exists but belongs to the same profile (no actual name change)', async () => {
            // Simulate providing the same name it already has
            const sameNameData = { name: existingProfile.name };
            const mockReturn = { ...updatedProfileMock, name: existingProfile.name, description: null }; // Assuming desc wasn't provided
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            // Name conflict check is skipped because new name === existing name
            mockPrismaClient.userProfile.update.mockResolvedValue(mockReturn);

            const result = await userProfileEntity.updateUserProfile(profileId, sameNameData);

            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledWith({ where: { id: profileId }, select: { id: true, name: true } });
            // Second findUnique (for conflict) should NOT have been called
            expect(mockPrismaClient.userProfile.findUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaClient.userProfile.update).toHaveBeenCalledWith({
                where: { id: profileId },
                data: { name: existingProfile.name }, // Data to update
                select: { id: true, name: true, description: true, createdAt: true, updatedAt: true },
            });
            expect(result).toEqual(mockReturn);
        });

        it('should return server error if prisma update fails', async () => {
            const prismaError = new Error("DB connection failed");
            const expectedError = { error: { status: 500, error: 'Failed to update user profile due to a server error.' } };
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(existingProfile); // Find target profile
            mockPrismaClient.userProfile.findUnique.mockResolvedValueOnce(null); // Check name conflict (none)
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
});