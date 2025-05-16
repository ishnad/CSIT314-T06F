const { Prisma, PrismaClient, UserStatus } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserAccountEntity {
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
    }

    /**
     * Edits an existing user account.
     * @param {string} id - The ID of the user account to edit.
     * @param {string} username - The new username.
     * @param {string} userProfileName - The name of the new user profile.
     * @param {string} email - The new email address.
     * @param {string} status - The new status for the user account (case-insensitive, will be converted to uppercase).
     * @returns {Promise<object|{error: {status: number, error: string}}>} The updated user object or an error object.
     */
    async editUserAccount(id, username, userProfileName, email, status) {
        // Convert status to uppercase enum value
        const upperCaseStatus = status.toUpperCase();

        try {
            // Find the profile ID based on the provided name
            const profile = await this.prisma.userProfile.findUnique({
                where: { name: userProfileName },
                select: { id: true }
            });
            if (!profile) {
                return { error: { status: 404, error: `User profile '${userProfileName}' not found.` } };
            }

            const currentUser = await this.prisma.userAccount.findUnique({ where: { id } });
            if (!currentUser) {
                 return { error: { status: 404, error: 'User to update not found.' } };
            }
            // Check if the new username conflicts with another existing user if username is being changed
            if (username !== currentUser.username) {
                const existingUserWithNewUsername = await this.prisma.userAccount.findUnique({ where: { username } });
                if (existingUserWithNewUsername) {
                    return { error: { status: 409, error: 'New username already exists.' } };
                }
            }
            // Check if the new email conflicts with another existing user if email is being changed
            if (email !== currentUser.email) {
                const existingUserWithNewEmail = await this.prisma.userAccount.findUnique({where: { email } });
                if (existingUserWithNewEmail) {
                    return { error: { status: 409, error: 'New email already exists.' } };
                }
            }

            const updatedUser = await this.prisma.userAccount.update({
                where: { id },
                data: {
                    username,
                    userProfileId: profile.id,
                    email,
                    status: upperCaseStatus
                },
                include: { userProfile: { select: { name: true, permissions: true } } }
            });

            return {
                username: updatedUser.username,
                userProfile: updatedUser.userProfile.name,
                permissions: updatedUser.userProfile.permissions,
                email: updatedUser.email,
                status: updatedUser.status
            };
        } catch (error) {
            console.error("Error updating user:", error);
            return {
                error: {
                    status: 500,
                    error: "Failed to update user"
                }
            };
        }
    }

    /**
     * Creates a new user account.
     * @param {object} userData - Data for the new user.
     * @param {string} userData.username - The username for the new account.
     * @param {string} userData.password - The password for the new account.
     * @param {string} userData.email - The email address for the new account.
     * @param {string} userData.userProfileName - The name of the user profile to associate with the account.
     * @returns {Promise<true|{error: {status: number, message: string}}>} True if successful, or an error object.
     */
async createUserAccount({ username, password, email, userProfileName }) {
        try {
            // Check if username exists
            const existingUser = await this.prisma.userAccount.findUnique({
                where: { username },
            });
            if (existingUser) {
                return { error: { status: 409, message: `Username '${username}' already exists.` } };
            }
            // Check if email exists
            const existingEmail = await this.prisma.userAccount.findUnique({
                where: { email },
            });
            if (existingEmail) {
                return { error: { status: 409, message: `Email '${email}' already exists.` } };
            }

            const profile = await this.prisma.userProfile.findUnique({
                where: { name: userProfileName },
                select: { id: true }
            });
            const hashedPassword = await this.hashPassword(password);
            await this.prisma.userAccount.create({
                data: {
                username,
                email,
                password: hashedPassword,
                userProfileId: profile.id,
            },
            include: { userProfile: { select: { name: true, permissions: true } } }
        });

            return true; // Account successfully created
        } catch (error) {
            return { error: { status: 500, message: 'An unexpected error occurred during user account creation.' } };
        }
    }

    /**
     * Checks if a username already exists in the database.
     * @param {string} username - The username to check.
     * @returns {Promise<{status: number, error: string}|null>} An error object if username exists, otherwise null.
     */
    async checkUsernameExists(username) {
        const existingUser = await this.prisma.userAccount.findUnique({
            where: { username },
        });

        if (existingUser) {
            return {
                status: 409,
                error: 'Username already exists.'
            };
        }
        return null;
    }

    /**
     * Hashes a password using bcrypt.
     * @param {string} password - The password to hash.
     * @returns {Promise<string>} The hashed password.
     */
    async hashPassword(password) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

    /**
     * Retrieves a list of user accounts, optionally filtered.
     * @param {string} [filter] - The field to filter by (e.g., 'username', 'email', 'userProfile', 'status').
     * @param {string} [keyword] - The keyword to use for filtering.
     * @returns {Promise<Array<object>>} A list of user account objects.
     */
    async viewUserAccount(filter, keyword) {
        const whereClause = {};

        // Adjust filtering for the userProfile relation
        if (filter === 'userProfile' && keyword) {
            // Filter based on the related UserProfile's name
            whereClause.userProfile = { name: { equals: keyword } };
        } else if (filter && keyword && filter !== 'userProfile') {
            // Handle other direct fields (username, email, status)
             // Ensure 'status' is handled correctly if it's an enum
            if (filter === 'status') {
                 whereClause[filter] = { equals: keyword }; // Assuming keyword matches enum value
            } else {
                 whereClause[filter] = { contains: keyword, mode: 'insensitive' }; // Case-insensitive for others
            }
        } else if (filter && !keyword) {
             // If filter is provided but keyword is empty, maybe fetch all for that filter type?
             // Or return error? For now, let it fetch all if keyword is missing.
        }


        const users = await this.prisma.userAccount.findMany({
            where: whereClause,
            select: {
                id: true,
                username: true,
                email: true,
                userProfile: { select: { name: true, permissions: true } }, // Select profile name and permissions
                status: true,
                createdAt: true
            }
        });

        // Map the result to return profile name and permissions directly
        return users.map(user => ({
            ...user,
            permissions: user.userProfile ? user.userProfile.permissions : [], // Add permissions
            userProfile: user.userProfile ? user.userProfile.name : null // Keep profile name
        }));
    }

    /**
     * Suspends a user account by setting its status to SUSPENDED.
     * @param {string} username - The username of the account to suspend.
     * @returns {Promise<true|{error: {status: number, message: string}}>} True if successful, or an error object.
     */
    async suspendUserAccount(username) {
        try {
            // Find user by username first to ensure it exists
            const userExists = await this.prisma.userAccount.findUnique({ where: { username } });
            if (!userExists) {
                 return { error: { status: 404, message: `User '${username}' not found.` } };
            }

            await this.prisma.userAccount.update({
                where: { username },
                data: { status: UserStatus.SUSPENDED }
            });
            return true;
        } catch (error) {
            console.error("Error suspending user account in entity:", error);
            return { error: { status: 500, message: 'An unexpected error occurred while suspending the user account.' } };
        }
    }

    /**
     * Searches for user accounts based on a filter and keyword.
     * @param {string} filter - The field to filter by (e.g., 'username', 'email', 'userProfile', 'status').
     * @param {string} [keyword] - The keyword to search for.
     * @returns {Promise<Array<object>>} A list of user account objects matching the search criteria.
     * @throws {Error} If the filter parameter is missing.
     */
    async searchUserAccount(filter, keyword) {
        if (!filter) {
            throw new Error('Filter parameter is required for search');
        }

        const whereClause = {};
         // Adjust filtering for the userProfile relation
        if (filter === 'userProfile' && keyword) {
            whereClause.userProfile = { name: { contains: keyword, mode: 'insensitive' } };
        } else if (filter && keyword && filter !== 'userProfile') {
             // Ensure 'status' is handled correctly if it's an enum
            if (filter === 'status') {
                 whereClause[filter] = { equals: keyword }; // Assuming keyword matches enum value
            } else {
                 whereClause[filter] = { contains: keyword, mode: 'insensitive' }; // Case-insensitive for others
            }
        } else if (filter && !keyword) {
            // If filter is provided but keyword is empty, search where the field exists or is not null?
            // Or maybe require keyword? For now, search based on filter existing if keyword is empty.
            // This might need refinement based on desired behavior.
             if (filter === 'userProfile') {
                 whereClause.userProfile = { isNot: null };
             } else {
                 // This might not be meaningful for other fields like username/email
                 // Consider returning an error or fetching all if keyword is missing.
             }
        }


        const users = await this.prisma.userAccount.findMany({
            where: whereClause,
            select: {
                id: true,
                username: true,
                email: true,
                userProfile: { select: { name: true, permissions: true } }, // Select profile name and permissions
                status: true
            }
        });

        // Map the result to return profile name and permissions directly
        return users.map(user => ({
            ...user,
            permissions: user.userProfile ? user.userProfile.permissions : [], // Add permissions
            userProfile: user.userProfile ? user.userProfile.name : null // Keep profile name
        }));
    }

    /**
     * Verifies login credentials for an admin user.
     * Checks username, password, status (must be ACTIVE), and profile permissions (must include ADMIN_PRIVILEGES).
     * @param {object} credentials - The login credentials.
     * @param {string} credentials.username - The username.
     * @param {string} credentials.password - The password.
     * @returns {Promise<boolean>} True if credentials are valid for an admin, false otherwise.
     */
    async verifyLoginCredentials({ username, password }) {
        const user = await this.prisma.userAccount.findUnique({
            where: { username },
            // Include the related userProfile to check its name and permissions
            include: {
                userProfile: {
                    select: { name: true, permissions: true } // Include permissions
                }
            }
        });

        // Check status using the imported enum and if the related profile exists and has ADMIN_PRIVILEGES permission
        if (!user || user.status !== UserStatus.ACTIVE || !user.userProfile || !user.userProfile.permissions.includes('ADMIN_PRIVILEGES')) {
            return false; // User is not active or not an admin based on permissions
        }

        return await bcrypt.compare(password, user.password);
    }

    /**
     * Validates user login credentials.
     * Finds user by username and compares the provided password with the stored hash.
     * Includes user profile information on successful validation.
     * @param {string} username - The username entered by the user.
     * @param {string} password - The password entered by the user.
     * @returns {Promise<object>} User object with profile if valid, otherwise an error object.
     */
    async validateLogin(username, password) {
        const trimmedUsername = username.trim();

        try {
            // Find the user by username, include their profile details
            const userAccount = await this.prisma.userAccount.findUnique({
                where: { username: trimmedUsername },
                include: {
                    userProfile: { // Include the related user profile
                        select: {
                            id: true,
                            name: true, // Select profile name (role)
                            permissions: true // Select permissions
                        }
                    }
                }
            });

            // Check if user exists and is active
            if (!userAccount || userAccount.status !== UserStatus.ACTIVE) { // Use UserStatus enum
                // Generic error for security (don't reveal if username exists but is inactive)
                return { error: { status: 401, message: 'Invalid username or password.' } };
            }

            // Compare the provided password with the stored hash
            const isPasswordValid = await bcrypt.compare(password, userAccount.password);

            if (!isPasswordValid) {
                return { error: { status: 401, message: 'Invalid username or password.' } };
            }

            // Login successful: Return user data (excluding password)
            const { password: _, ...userWithoutPassword } = userAccount; // Destructure to omit password
            // userWithoutPassword now contains id, username, email, status, userProfileId, userProfile { id, name, permissions }
            return userWithoutPassword;

        } catch (error) {
            console.error(`Error during login validation for user ${trimmedUsername}:`, error);
            return { error: { status: 500, message: 'Login failed due to a server error.' } };
        }
    }

    /**
     * Retrieves a cleaner's profile, including their active service listings.
     * @param {string} cleanerId - The ID of the cleaner (UserAccount ID).
     * @returns {Promise<object|{error: {status: number, error: string}}>} The cleaner's profile data or an error object.
     */
    async getCleanerProfile(cleanerId) {
        try {
            const cleanerAccount = await this.prisma.userAccount.findUnique({
                where: { id: cleanerId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    status: true,
                    userProfile: {
                        select: {
                            name: true
                        }
                    },
                    serviceListings: {
                        where: {
                            status: 'ACTIVE' // Only fetch active service listings
                        },
                        select: {
                            id: true,
                            description: true,
                            ratePerHr: true,
                            status: true,
                            serviceCategory: {
                                select: {
                                    serviceCatName: true
                                }
                            }
                        }
                    }
                }
            });

            return {
                id: cleanerAccount.id,
                username: cleanerAccount.username,
                email: cleanerAccount.email,
                status: cleanerAccount.status,
                profileName: cleanerAccount.userProfile.name,
                serviceListings: cleanerAccount.serviceListings.map(listing => ({
                    ...listing,
                    serviceType: listing.serviceCategory?.serviceCatName || 'Cleaning Service'
                }))
            };

        } catch (error) {
            console.error(`Error fetching cleaner profile for ID ${cleanerId}:`, error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2023') {
                // Invalid CUID format for cleanerId
                return { error: { status: 400, error: 'Invalid cleaner ID format.' } };
            }
            return { error: { status: 500, error: 'Failed to retrieve cleaner profile due to a server error.' } };
        }
    }

    /**
     * Searches for cleaner profiles based on a keyword.
     * The keyword is matched against username, and details within their active service listings
     * like service type, title, and description.
     * @param {string} keyword - The keyword to search for.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of matching cleaner profiles or an error object.
     */
    async searchCleaners(keyword) {
        try {
            const cleanerProfile = await this.prisma.userProfile.findUnique({
                where: { name: 'CLEANER' },
                select: { id: true }
            });

            const cleaners = await this.prisma.userAccount.findMany({
                where: {
                    userProfileId: cleanerProfile.id, // Filter by cleaner profile
                    status: UserStatus.ACTIVE,        // Only search for active cleaners
                    OR: keyword ? [ // Only apply OR filters if keyword is provided
                        { username: { contains: keyword, mode: 'insensitive' } },
                        { email: { contains: keyword, mode: 'insensitive' } },
                        {
                            serviceListings: {
                                some: { // Check if any service listing matches
                                    status: 'ACTIVE', // Only consider active service listings
                                    OR: [
                                        { serviceType: { contains: keyword, mode: 'insensitive' } },
                                        { title: { contains: keyword, mode: 'insensitive' } },
                                        { description: { contains: keyword, mode: 'insensitive' } },
                                    ],
                                },
                            },
                        },
                    ] : undefined, // If no keyword, this will fetch all active cleaners
                },
                select: {
                    id: true, // cleanerID
                    username: true,
                    email: true, // For contact or display
                    serviceListings: {
                        where: {
                            status: 'ACTIVE', // Ensure we only fetch active listings
                        },
                        select: {
                            id: true,
                            serviceType: true,
                            title: true,
                            description: true,
                            ratePerHr: true,
                        }
                    },
                }
            });
            return cleaners.map(cleaner => ({
                id: cleaner.id,
                username: cleaner.username,
                email: cleaner.email,
                serviceListings: cleaner.serviceListings, 
            }));

        } catch (error) {
            console.error("Error searching for cleaners in entity:", error);
            return {
                error: {
                    status: 500,
                    message: 'An unexpected error occurred while searching for cleaners.'
                }
            };
        }
    }

    /**
     * Fetches all active cleaners with their service listings.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>}
     */
    async fetchAllActiveCleaners() {
        try {
            // Get the cleaner profile ID
            const cleanerProfile = await this.prisma.userProfile.findUnique({
                where: { name: 'Cleaner' },
                select: { id: true }
            });

            if (!cleanerProfile) {
                throw new Error("Cleaner profile not found in database");
            }

            // Find all active cleaners with their service listings
            const cleaners = await this.prisma.userAccount.findMany({
                where: {
                    userProfileId: cleanerProfile.id,
                    status: UserStatus.ACTIVE
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    status: true,
                    serviceListings: {
                        where: { status: 'ACTIVE' },
                        select: {
                            id: true,
                            description: true,
                            ratePerHr: true,
                            serviceCategory: {
                                select: {
                                    serviceCatName: true
                                }
                            }
                        }
                    }
                }
            });

            return cleaners.map(cleaner => ({
                id: cleaner.id,
                username: cleaner.username,
                email: cleaner.email,
                status: cleaner.status,
                serviceListings: cleaner.serviceListings.map(listing => ({
                    ...listing,
                    serviceType: listing.serviceCategory?.serviceCatName || 'Cleaning Service'
                }))
            }));

        } catch (error) {
            console.error("Error fetching all active cleaners:", error);
            return {
                error: {
                    status: 500,
                    message: "Failed to retrieve active cleaners"
                }
            };
        }
    }

    /**
     * Gets the total number of new user registrations within a specified period.
     * @param {Date} startDate - The start of the period.
     * @param {Date} endDate - The end of the period.
     * @returns {Promise<number|{error: {status: number, message: string}}>} The total count or an error object.
     */
    async getTotalRegistrations(startDate, endDate) {
        try {
            const count = await this.prisma.userAccount.count({
                where: {
                    createdAt: {
                        gte: startDate, // Greater than or equal to start date
                        lt: endDate,    // Less than end date
                    },
                },
            });
            return count;
        } catch (error) {
            console.error("Error getting total registrations in entity:", error);
            return { error: { status: 500, message: 'Failed to retrieve total registrations.' } };
        }
    }
}

module.exports = UserAccountEntity;
