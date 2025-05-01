const UserProfileEntity = require('../../src/entities/userProfileEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// --- Mock Dependencies ---
jest.mock('../../src/generated/prisma', () => {
    const mockPrisma = {
        userProfile: {
            findUnique: jest.fn(),
            create: jest.fn(),
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


});