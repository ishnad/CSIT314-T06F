const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserEntity {
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
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
        if (filter && keyword) {
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
}

module.exports = UserEntity;