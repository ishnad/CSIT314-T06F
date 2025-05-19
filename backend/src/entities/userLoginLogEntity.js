const prisma = require('../lib/prismaClient');

class UserLoginLogEntity {
    constructor() {
        this.prisma = prisma;
    }

    /**
     * Logs a user login attempt.
     * This method would be called after a successful login.
     * @param {string} userId - The ID of the user who logged in.
     * @param {string} [ipAddress] - Optional IP address of the user.
     * @param {string} [userAgent] - Optional user agent of the user.
     * @returns {Promise<object|{error: {status: number, message: string}}>} The created log entry or an error object.
     */
    async logLogin(userId, ipAddress, userAgent) {
        try {
            const loginLog = await this.prisma.userLoginLog.create({
                data: {
                    userId,
                    ipAddress,
                    userAgent,
                    loginTime: new Date(), // Ensures loginTime is set on creation
                },
            });
            return loginLog;
        } catch (error) {
            console.error("Error logging user login:", error);
            return { error: { status: 500, message: 'Failed to log user login.' } };
        }
    }

    /**
     * Gets the total number of logins within a specified period.
     * @param {Date} startDate - The start of the period.
     * @param {Date} endDate - The end of the period.
     * @returns {Promise<number|{error: {status: number, message: string}}>} The total count or an error object.
     */
    async getTotalLoginsInPeriod(startDate, endDate) {
        try {
            const count = await this.prisma.userLoginLog.count({
                where: {
                    loginTime: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
            });
            return count;
        } catch (error) {
            console.error("Error getting total logins in entity:", error);
            return { error: { status: 500, message: 'Failed to retrieve total logins.' } };
        }
    }

    async getTotalLogins(startDate, endDate) {
        return this.getTotalLoginsInPeriod(startDate, endDate);
    }
}

module.exports = UserLoginLogEntity;
