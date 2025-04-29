const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserAccountEntity {
    static STATUS_ACTIVE = 'active';
    static STATUS_SUSPENDED = 'suspended';
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
        this.sessionID = null;
        this.userID = null;
    }

    validate(username, userProfile, email, status) {
        if (!username || !userProfile || !email || !status) {
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

    async editUserAccount(username, userProfile, email, status) {
        const validationError = this.validate(username, userProfile, email, status);
        if (validationError) {
            return { error: validationError };
        }

        try {
            const updatedUser = await this.prisma.userAccount.update({
                where: { username },
                data: { userProfile, email, status }
            });

            return {
                username: updatedUser.username,
                userProfile: updatedUser.userProfile,
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

    async createUserAccount({ username, password, userProfile }) {
        const usernameError = await this.checkUsernameExists(username);
        if (usernameError) {
            return { error: usernameError };
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = await this.prisma.userAccount.create({
            data: {
                username,
                password: hashedPassword,
                userProfile,
            },
        });

        return {
            id: newUser.id,
            username: newUser.username,
            userProfile: newUser.userProfile,
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
        
        // Special handling for userProfile filter (Cleaner/Homeowner)
        if (filter === 'userProfile' && keyword) {
            whereClause.userProfile = { equals: keyword };
        }
        else if (filter && keyword) {
            whereClause[filter] = { contains: keyword, mode: 'insensitive' };
        }

        const users = await this.prisma.userAccount.findMany({
            where: whereClause,
            select: {
                username: true,
                email: true,
                userProfile: true,
                status: true,
                createdAt: true
            }
        });

        return users;
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
        if (keyword) {
            whereClause[filter] = { contains: keyword };
        }

        const users = await this.prisma.userAccount.findMany({
            where: whereClause,
            select: {
                username: true,
                email: true,
                userProfile: true,
                status: true
            }
        });

        return users;
    }

    async verifyLoginCredentials({ username, password }) {
        const user = await this.prisma.userAccount.findUnique({
            where: { username },
            select: {
                password: true,
                status: true,
                userProfile: true
            }
        });

        if (!user || user.status !== UserAccountEntity.STATUS_ACTIVE || user.userProfile !== 'UserAdmin') {
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