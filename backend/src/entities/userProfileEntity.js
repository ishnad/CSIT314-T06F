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

    /**
     * Lists user profiles, optionally filtering by name, and includes user account counts.
     * @param {object} [options] - Optional parameters.
     * @param {string} [options.keyword] - Keyword to filter profile names (case-insensitive contains).
     * @returns {Promise<Array<object>|object>} Array of profile objects or an error object.
     */
    async listUserProfiles({ keyword } = {}) {
        try {
            const whereClause = {};
            if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
                whereClause.name = {
                    contains: keyword.trim(),
                    mode: 'insensitive',
                };
            }

            const profiles = await this.prisma.userProfile.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    _count: { // Include the count of related user accounts
                        select: { userAccounts: true },
                    },
                },
                orderBy: { // Optional: Order by name by default
                    name: 'asc',
                },
            });

            // Remap the result to place userAccount count at the top level for easier access
            const profilesWithCount = profiles.map(profile => ({
                ...profile,
                userAccountCount: profile._count.userAccounts, // Rename _count.userAccounts
                _count: undefined // Remove the original _count object
            }));

            return profilesWithCount;

        } catch (error) {
            console.error("Error listing user profiles:", error);
            return { error: { status: 500, error: 'Failed to retrieve user profiles due to a server error.' } };
        }
    }

    /**
     * Updates an existing user profile.
     * @param {string} profileId - The ID of the profile to update.
     * @param {object} updateData - Data to update.
     * @param {string} [updateData.name] - The new name for the profile.
     * @param {string} [updateData.description] - The new description for the profile.
     * @returns {Promise<object>} The updated profile object or an error object.
     */
    async updateUserProfile(profileId, { name, description }) {
        const nameProvided = name !== undefined;
        const descriptionProvided = description !== undefined;
        const trimmedName = nameProvided ? name.trim() : undefined;

        // Check 1: If name was provided but is empty after trimming
        if (nameProvided && !trimmedName) {
            return { error: { status: 400, error: 'Profile name cannot be empty.' } };
        }

        // Check 2: If neither a valid name nor a description was provided
        const validNameProvided = nameProvided && !!trimmedName; // Name provided and not empty after trim
        if (!validNameProvided && !descriptionProvided) {
            return { error: { status: 400, error: 'At least name or description must be provided for update.' } };
        }

        try {
            // Check if the target profile exists
            const existingProfile = await this.prisma.userProfile.findUnique({
                where: { id: profileId },
                select: { id: true, name: true } // Select current name for conflict check
            });

            if (!existingProfile) {
                return { error: { status: 404, error: 'User profile not found.' } };
            }

            // If name is being updated, check if the new name already exists on *another* profile
            if (trimmedName && trimmedName !== existingProfile.name) {
                const conflictingProfile = await this.prisma.userProfile.findUnique({
                    where: { name: trimmedName },
                    select: { id: true }
                });
                // Conflict if a profile with the new name exists AND it's not the same profile we are editing
                if (conflictingProfile && conflictingProfile.id !== profileId) {
                    return { error: { status: 409, error: 'A profile with this name already exists.' } };
                }
            }

            // Prepare data for update, only include fields that were provided and valid
            const dataToUpdate = {};
            if (validNameProvided) { // Use the flag determined earlier
                dataToUpdate.name = trimmedName;
            }
            if (descriptionProvided) { // Use the flag determined earlier
                // Trim description here before saving, handle null explicitly
                dataToUpdate.description = description === null ? null : description.trim();
            }

            // Update the profile
            const updatedProfile = await this.prisma.userProfile.update({
                where: { id: profileId },
                data: dataToUpdate,
                select: { // Select the fields to return
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return updatedProfile;

        } catch (error) {
            console.error("Error updating user profile:", error);
            return { error: { status: 500, error: 'Failed to update user profile due to a server error.' } };
        }
    }

    /**
     * Finds a user profile by name for simulation purposes.
     * @param {string} profileName - The name of the profile to simulate.
     * @returns {Promise<object>} The profile object or an error object.
     */
    async simulateProfile(profileName) {
        // Basic validation
        if (!profileName || typeof profileName !== 'string' || profileName.trim() === '') {
            return { error: { status: 400, error: 'Profile name is required for simulation.' } };
        }

        const trimmedName = profileName.trim();

        try {
            const profile = await this.prisma.userProfile.findUnique({
                where: { name: trimmedName },
                select: { // Select the necessary fields for the frontend to simulate
                    id: true,
                    name: true,
                    description: true,
                }
            });

            if (!profile) {
                return { error: { status: 404, error: `User profile '${trimmedName}' not found.` } };
            }

            return profile;

        } catch (error) {
            console.error(`Error finding profile '${trimmedName}' for simulation:`, error);
            return { error: { status: 500, error: 'Failed to retrieve user profile for simulation due to a server error.' } };
        }
    }
}

module.exports = UserProfileEntity;