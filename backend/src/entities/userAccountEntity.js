const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserAccountEntity {
    static STATUS_ACTIVE = 'active';
    static STATUS_SUSPENDED = 'suspended';
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
    }

    // Validation might need adjustment depending on how profile is passed (name vs id)
    validateEditInput(username, userProfileName, email, status) {
        if (!username || !userProfileName || !email || !status) {
            return {
                status: 400,
                error: 'All fields are required'
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

    async editUserAccount(username, userProfileName, email, status) {
        const validationError = this.validateEditInput(username, userProfileName, email, status);
        if (validationError) {
            return { error: validationError };
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

            const updatedUser = await this.prisma.userAccount.update({
                where: { username },
                data: {
                    userProfileId: profile.id, // Link using the found profile ID
                    email,
                    status
                },
                include: { userProfile: true } // Include the related profile data
            });

            return {
                username: updatedUser.username,
                userProfile: updatedUser.userProfile.name, // Return profile name
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

    // Updated to accept userProfileName instead of enum value
    async createUserAccount({ username, password, userProfileName }) {
        if (!userProfileName) {
             return { error: { status: 400, error: 'User profile name is required.' } };
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
                password: hashedPassword,
                userProfileId: profile.id, // Link using the found profile ID
            },
            include: { userProfile: true } // Include the related profile data
        });

        return {
            id: newUser.id,
            username: newUser.username,
            userProfile: newUser.userProfile.name, // Return profile name
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
                username: true,
                email: true,
                userProfile: { select: { name: true } }, // Select profile name
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
            const user = await this.prisma.userAccount.update({
                where: { username },
                data: { status: UserAccountEntity.STATUS_SUSPENDED }
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

        // Check status and if the related profile exists and is named 'UserAdmin'
        if (!user || user.status !== UserAccountEntity.STATUS_ACTIVE || !user.userProfile || user.userProfile.name !== 'UserAdmin') {
            return false;
        }

        return await bcrypt.compare(password, user.password);
    }

    async confirmLogout() {
        try {
            // Clear session data
            this.sessionID = null;
            this.userID = null;
            return true;
        } catch (error) {
            console.error("Error confirming logout:", error);
            return false;
        }
    }

    cancelLogout() {
        // Simply return true since we're not actually logging out
        return true;
    }
}

module.exports = UserAccountEntity;