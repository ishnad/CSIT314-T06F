const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserEntity {
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
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
}

module.exports = UserEntity;