const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

class UserEntities {
    constructor() {
        this.prisma = new PrismaClient();
        this.SALT_ROUNDS = 10;
    }

    /**
     * Validate required fields for user creation
     * @param {object} data - User data to validate
     * @returns {object} - Error response if invalid, null if valid
     */
    validateCreateUser(data) {
        if (!data.username || !data.password || !data.userProfile) {
            return {
                status: 400,
                error: 'Username, password, and userProfile are required.'
            };
        }
        return null;
    }

    /**
     * Check if username already exists
     * @param {string} username - Username to check
     * @returns {Promise<object|null>} - Error response if exists, null if available
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
     * Hash a password
     * @param {string} password - Plain text password
     * @returns {Promise<string>} - Hashed password
     */
    async hashPassword(password) {
        return await bcrypt.hash(password, this.SALT_ROUNDS);
    }
}

module.exports = UserEntities;