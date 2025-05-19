const { UserProfileStatus } = require('../generated/prisma');
const prisma = require('../lib/prismaClient');

class UserProfileEntity {
    constructor() {
        this.prisma = prisma;
    }

    /**
     * Creates a new user profile.
     * @param {object} profileData - Data for the new profile.
     * @param {string} profileData.name - The name of the profile.
     * @param {string[]} [profileData.permissions] - Optional list of permissions.
     * @returns {Promise<boolean|{error: {status: number, error: string}}>} True on successful creation, or an error object on failure.
     */
    async createUserProfile({ name, permissions = [] }) { // Default to empty array if not provided
        const trimmedName = name ? name.trim() : '';

        try {
            // Check if profile name already exists
            const existingProfile = await this.prisma.userProfile.findUnique({
                where: { name: trimmedName },
            });

            if (existingProfile) {
                return { error: { status: 409, error: 'A profile with this name already exists.' } };
            }

            // Create the new profile
            await this.prisma.userProfile.create({
                data: {
                    name: trimmedName,
                    permissions: permissions,
                    status: UserProfileStatus.ACTIVE, // Default status
                },
                // Select clause is useful for Prisma to know what to process,
                // even if we only return true.
                select: { 
                    id: true,
                }
            });

            return true; // Return true on successful creation

        } catch (error) {
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
                    permissions: true,
                    status: true,
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
     * @param {string[]} [updateData.permissions] - The new list of permissions.
     * @returns {Promise<boolean|{error: {status: number, error: string}}>} True on successful update, or an error object on failure.
     */
    async updateUserProfile(profileId, { name, permissions }) {
        const trimmedName = name ? name.trim() : undefined; // Trim if name is provided

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

            // Prepare data for update
            const dataToUpdate = {};
            if (trimmedName !== undefined) {
                dataToUpdate.name = trimmedName;
            }
            if (permissions !== undefined) {
                dataToUpdate.permissions = permissions;
            }

            // Update the profile
            await this.prisma.userProfile.update({
                where: { id: profileId },
                data: dataToUpdate,
                select: { // Select clause for Prisma
                    id: true,
                }
            });

            return true; // Return true on successful update

        } catch (error) {
            console.error("Error updating user profile:", error);
            return { error: { status: 500, error: 'Failed to update user profile due to a server error.' } };
        }
    }

    /**
     * Updates the status of an existing user profile.
     * @param {string} profileId - The ID of the profile to update.
     * @param {UserProfileStatus} newStatus - The new status for the profile.
     * @returns {Promise<boolean|{error: {status: number, error: string}}>} True on successful status update, or an error object on failure.
     */
    async updateProfileStatus(profileId, newStatus) {
        try {
            const existingProfile = await this.prisma.userProfile.findUnique({
                where: { id: profileId },
            });
            if (!existingProfile) {
                return { error: { status: 404, error: 'User profile not found.' } };
            }

            await this.prisma.userProfile.update({
                where: { id: profileId },
                data: { status: newStatus },
                select: { // Select clause for Prisma
                    id: true,
                }
            });
            
            return true; // Return true on successful update

        } catch (error) {
            console.error(`Error updating status for profile ${profileId}:`, error);
            return { error: { status: 500, error: 'Failed to update user profile status due to a server error.' } };
        }
    }

    /**
     * Finds a user profile by name for simulation purposes.
     * @param {string} profileName - The name of the profile to simulate.
     * @returns {Promise<object>} The profile object or an error object.
     */
    async simulateProfile(profileName) {
        // Basic validation (empty name) is assumed to be done by the front-end.
        const trimmedName = profileName ? profileName.trim() : '';

        if (!trimmedName) {
            // Safeguard, or remove if strict "no validation in entity"
            return { error: { status: 400, error: 'Profile name cannot be empty for simulation.' } };
        }

        try {
            const profile = await this.prisma.userProfile.findUnique({
                where: { name: trimmedName },
                select: { // Select the necessary fields for the frontend to simulate
                    id: true,
                    name: true,
                    permissions: true,
                    status: true,
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

    /**
     * Searches for a specific user profile by name and returns it along with associated user accounts.
     * @param {object} params - The search parameters.
     * @param {string} params.filter - The filter type, expected to be 'name'.
     * @param {string} params.keyword - The keyword for the filter (e.g., the profile name).
     * @returns {Promise<object>} The UserProfile object with associated userAccounts, or an error object.
     */
    async searchUserProfiles({ filter, keyword }) {
        const trimmedKeyword = keyword ? keyword.trim() : '';
        
        try {
            const profile = await this.prisma.userProfile.findUnique({
                where: { name: trimmedKeyword }, // Assumes filter is 'name'
                include: {
                    userAccounts: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            status: true,
                            createdAt: true,
                        },
                        orderBy: { // Optional: order accounts by username or createdAt
                            username: 'asc'
                        }
                    }
                }
            });
            if (!profile) {
                return { error: { status: 404, error: `User profile with name '${trimmedKeyword}' not found.` } };
            }

            // If profile is found, it will include userAccounts (empty array if none)
            return profile;

        } catch (error) {
            console.error(`Error searching user profile by name '${trimmedKeyword}':`, error);
            return { error: { status: 500, error: 'Failed to search user profile due to a server error.' } };
        }
    }
}

module.exports = UserProfileEntity;
