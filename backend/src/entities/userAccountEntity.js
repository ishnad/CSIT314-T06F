const { PrismaClient, UserStatus } = require('../generated/prisma');
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
        // Basic validation first (presence of fields)
        if (!id || !username || !userProfileName || !email || !status) {
             return { error: { status: 400, error: 'ID, username, userProfileName, email, and status are required' } };
        }
         // Validate email format
        if (!email.includes('@')) {
            return { error: { status: 400, error: 'Invalid email format' } };
        }

        // Validate and convert status to uppercase enum value
        const validStatuses = Object.values(UserStatus); // Get ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED']
        const upperCaseStatus = status.toUpperCase();
        if (!validStatuses.includes(upperCaseStatus)) {
             return { error: { status: 400, error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` } };
        }


        try {
            // Find the profile ID based on the provided name
            const profile = await this.prisma.userProfile.findUnique({
                where: { name: userProfileName },
                select: { id: true }
            });

            if (!profile) {
                return { error: { status: 404, error: `User profile '${userProfileName}' not found.` } };
            }

            // Check if the new username conflicts with another existing user (if username is being changed)
            const currentUser = await this.prisma.userAccount.findUnique({ where: { id } });
            if (!currentUser) {
                 // This case should ideally not happen if ID is valid, but good to check
                 return { error: { status: 404, error: 'User to update not found.' } };
            }
            if (username !== currentUser.username) {
                const existingUserWithNewUsername = await this.prisma.userAccount.findUnique({ where: { username } });
                if (existingUserWithNewUsername) {
                    return { error: { status: 409, error: 'New username already exists.' } };
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
                // Include profile with permissions
                include: { userProfile: { select: { name: true, permissions: true } } }
            });

            return {
                username: updatedUser.username,
                userProfile: updatedUser.userProfile.name, // Keep name for simplicity here
                permissions: updatedUser.userProfile.permissions, // Add permissions
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
     * @returns {Promise<boolean|{error: {status: number, error: string}}>} True if successful, or an error object.
     */
    async createUserAccount({ username, password, email, userProfileName }) {
        if (!userProfileName) {
             return { error: { status: 400, error: 'User profile name is required.' } };
        }
        if (!email) { // validation for email
             return { error: { status: 400, error: 'Email is required.' } };
        }
        // Basic email format check
        if (!email.includes('@')) {
            return { error: { status: 400, error: 'Invalid email format.' } };
        }
        const usernameError = await this.checkUsernameExists(username);
        if (usernameError) {
            return { error: usernameError };
        }

        // Find the profile ID based on the provided name
        const profile = await this.prisma.userProfile.findUnique({
            where: { name: userProfileName },
            select: { id: true }
        });

        if (!profile) {
            return { error: { status: 404, error: `User profile '${userProfileName}' not found.` } };
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.prisma.userAccount.create({
            data: {
                username,
                email,
                password: hashedPassword,
                userProfileId: profile.id,
            },
            // Include profile with permissions
            include: { userProfile: { select: { name: true, permissions: true } } }
        });

        // If newUser is created successfully, Prisma returns the object.
        // If it failed, an error would have been thrown and caught by the controller's try/catch,
        // or by specific error handling within this method if we added more.
        return true;
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
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    async suspendUserAccount(username) {
        try {
            // Find user by username first to ensure it exists
            const userExists = await this.prisma.userAccount.findUnique({ where: { username } });
            if (!userExists) {
                 console.error(`Suspend failed: User '${username}' not found.`);
                 return false;
            }

            await this.prisma.userAccount.update({
                where: { username },
                data: { status: UserStatus.SUSPENDED }
            });
            return true;
        } catch (error) {
            console.error("Error suspending user:", error);
            return false;
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
        // Basic validation
        if (!username || typeof username !== 'string' || username.trim() === '') {
            return { error: { status: 400, message: 'Username is required.' } };
        }
        if (!password || typeof password !== 'string' || password === '') {
            // Note: Password validation (length, complexity) should happen on signup/update, not necessarily login attempt.
            return { error: { status: 400, message: 'Password is required.' } };
        }

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
}

module.exports = UserAccountEntity;
