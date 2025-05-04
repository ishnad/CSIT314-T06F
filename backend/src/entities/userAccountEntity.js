const { PrismaClient, UserStatus } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserAccountEntity {
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
    }

    // Validation updated to include ID and check status format later
    validateEditInput(id, username, userProfileName, email, status) {
        if (!id || !username || !userProfileName || !email || !status) {
            return {
                status: 400,
                error: 'ID, username, userProfileName, email, and status are required'
            };
        }
        
        if (!email.includes('@')) {
            return {
                status: 400,
                error: 'Invalid email format'
            };
        }

        return null;
    }

    // Updated signature to accept ID first
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
                include: { userProfile: true }
            });

            return {
                username: updatedUser.username,
                userProfile: updatedUser.userProfile.name,
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

    // Updated to accept userProfileName and email
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
            include: { userProfile: true }
        });

        return {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            userProfile: newUser.userProfile.name,
            createdAt: newUser.createdAt,
        };
    }

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

    async hashPassword(password) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }

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
                userProfile: { select: { name: true } },
                status: true,
                createdAt: true
            }
        });

        // Map the result to return profile name directly
        return users.map(user => ({
            ...user,
            userProfile: user.userProfile ? user.userProfile.name : null // Handle potential null profile
        }));
    }

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
                userProfile: { select: { name: true } }, // Select profile name
                status: true
            }
        });

        // Map the result to return profile name directly
        return users.map(user => ({
            ...user,
            userProfile: user.userProfile ? user.userProfile.name : null // Handle potential null profile
        }));
    }

    async verifyLoginCredentials({ username, password }) {
        const user = await this.prisma.userAccount.findUnique({
            where: { username },
            // Include the related userProfile to check its name
            include: {
                userProfile: {
                    select: { name: true }
                }
            }
        });

        // Check status using the imported enum and if the related profile exists and is named 'UserAdmin'
        if (!user || user.status !== UserStatus.ACTIVE || !user.userProfile || user.userProfile.name !== 'UserAdmin') {
            return false;
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
                            name: true // Select profile name (role)
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
            return userWithoutPassword; // Contains id, username, email, status, userProfileId, userProfile { id, name }

        } catch (error) {
            console.error(`Error during login validation for user ${trimmedUsername}:`, error);
            return { error: { status: 500, message: 'Login failed due to a server error.' } };
        }
    }
}

module.exports = UserAccountEntity;