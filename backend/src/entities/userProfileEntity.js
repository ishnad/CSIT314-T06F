const { PrismaClient } = require('../generated/prisma');

class UserProfileEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Validates the input for creating a user profile.
     * @param {string} name - The name of the profile.
     * @param {string} [description] - Optional description.
     * @returns {object|null} Error object or null if valid.
     */
    validateUserProfileInput(name, description) {
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return { status: 400, error: 'Profile name is required and cannot be empty.' };
        }
        // Add more validation as needed (e.g., length limits, character restrictions)
        return null;
    }

    /**
     * Creates a new user profile.
     * @param {object} profileData - Data for the new profile.
     * @param {string} profileData.name - The name of the profile.
     * @param {string} [profileData.description] - Optional description.
     * @returns {Promise<object>} The created profile object or an error object.
     */
    async createUserProfile({ name, description }) {
        const validationError = this.validateUserProfileInput(name, description);
        if (validationError) {
            return { error: validationError };
        }

        try {
            // Check if profile name already exists
            const existingProfile = await this.prisma.userProfile.findUnique({
                where: { name: name.trim() },
            });

            if (existingProfile) {
                return { error: { status: 409, error: 'A profile with this name already exists.' } };
            }

            // Create the new profile
            const newProfile = await this.prisma.userProfile.create({
                data: {
                    name: name.trim(),
                    description: description ? description.trim() : null,
                    // permissions: [] // Initialize permissions if field exists
                },
                select: { // Select only the fields to return
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true
                }
            });

            return newProfile; // Return the created profile data

        } catch (error) {
            console.error("Error creating user profile:", error);
            // Handle potential Prisma errors (e.g., database connection issues)
            return { error: { status: 500, error: 'Failed to create user profile due to a server error.' } };
        }
    }

}

module.exports = UserProfileEntity;