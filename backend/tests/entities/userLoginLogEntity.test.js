const UserLoginLogEntity = require('../../src/entities/userLoginLogEntity');
const { PrismaClient } = require('../../src/generated/prisma');

// Mock lib/prismaClient by defining the mock object within the factory
jest.mock('../../src/lib/prismaClient', () => ({
    userLoginLog: {
        create: jest.fn(),
        count: jest.fn(),
    },
}));

jest.mock('../../src/generated/prisma', () => {
    const actualGeneratedPrisma = jest.requireActual('../../src/generated/prisma');
    return {
        ...actualGeneratedPrisma,
        PrismaClient: jest.fn(() => require('../../src/lib/prismaClient')), // Return the same mock
    };
});

describe('UserLoginLogEntity', () => {
    let userLoginLogEntity;
    let mockPrisma;
    let consoleErrorSpy;

    beforeEach(() => {
        jest.clearAllMocks(); // Ensure mocks are cleared
        // Suppress console.error for expected error handling tests
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        // Get a reference to the mocked prisma client from lib/prismaClient
        mockPrisma = require('../../src/lib/prismaClient');
        userLoginLogEntity = new UserLoginLogEntity();
    });

    afterEach(() => {
        // Restore console.error
        if (consoleErrorSpy) {
            consoleErrorSpy.mockRestore();
        }
        jest.clearAllMocks();
    });

    describe('logLogin', () => {
        const userId = 'user123';
        const ipAddress = '127.0.0.1';
        const userAgent = 'TestBrowser';

        it('should successfully log a user login', async () => {
            const mockLoginLog = {
                id: 'log1',
                userId,
                ipAddress,
                userAgent,
                loginTime: new Date(),
            };
            mockPrisma.userLoginLog.create.mockResolvedValue(mockLoginLog);

            const result = await userLoginLogEntity.logLogin(userId, ipAddress, userAgent);

            expect(mockPrisma.userLoginLog.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    ipAddress,
                    userAgent,
                    loginTime: expect.any(Date), // loginTime is set by the method
                },
            });
            expect(result).toEqual(mockLoginLog);
        });

        it('should successfully log a user login even with optional params missing', async () => {
            const mockLoginLog = {
                id: 'log2',
                userId,
                ipAddress: undefined,
                userAgent: undefined,
                loginTime: new Date(),
            };
            mockPrisma.userLoginLog.create.mockResolvedValue(mockLoginLog);

            const result = await userLoginLogEntity.logLogin(userId); // ipAddress and userAgent are optional

            expect(mockPrisma.userLoginLog.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    ipAddress: undefined,
                    userAgent: undefined,
                    loginTime: expect.any(Date),
                },
            });
            expect(result).toEqual(mockLoginLog);
        });

        it('should return an error object if Prisma create fails', async () => {
            mockPrisma.userLoginLog.create.mockRejectedValue(new Error('DB Error'));

            const result = await userLoginLogEntity.logLogin(userId, ipAddress, userAgent);

            expect(result).toEqual({
                error: { status: 500, message: 'Failed to log user login.' },
            });
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error logging user login:", expect.any(Error));
        });
    });

    describe('getTotalLoginsInPeriod', () => {
        const startDate = new Date('2024-01-01T00:00:00.000Z');
        const endDate = new Date('2024-01-31T23:59:59.999Z');

        it('should return the total number of logins in the specified period', async () => {
            const mockCount = 150;
            mockPrisma.userLoginLog.count.mockResolvedValue(mockCount);

            const result = await userLoginLogEntity.getTotalLoginsInPeriod(startDate, endDate);

            expect(mockPrisma.userLoginLog.count).toHaveBeenCalledWith({
                where: {
                    loginTime: {
                        gte: startDate,
                        lt: endDate,
                    },
                },
            });
            expect(result).toBe(mockCount);
        });

        it('should return an error object if Prisma count fails', async () => {
            mockPrisma.userLoginLog.count.mockRejectedValue(new Error('DB Count Error'));

            const result = await userLoginLogEntity.getTotalLoginsInPeriod(startDate, endDate);

            expect(result).toEqual({
                error: { status: 500, message: 'Failed to retrieve total logins.' },
            });
            expect(consoleErrorSpy).toHaveBeenCalledWith("Error getting total logins in entity:", expect.any(Error));
        });
    });

    describe('getTotalLogins', () => {
        const startDate = new Date('2024-02-01T00:00:00.000Z');
        const endDate = new Date('2024-02-28T23:59:59.999Z');

        it('should call getTotalLoginsInPeriod and return its result', async () => {
            const mockCount = 75;
            // We can spy on the instance's method to ensure it's called
            const getTotalLoginsInPeriodSpy = jest.spyOn(userLoginLogEntity, 'getTotalLoginsInPeriod').mockResolvedValue(mockCount);

            const result = await userLoginLogEntity.getTotalLogins(startDate, endDate);

            expect(getTotalLoginsInPeriodSpy).toHaveBeenCalledWith(startDate, endDate);
            expect(result).toBe(mockCount);

            getTotalLoginsInPeriodSpy.mockRestore(); // Clean up the spy
        });

        it('should return an error object if getTotalLoginsInPeriod fails', async () => {
            const errorResponse = { error: { status: 500, message: 'Failed to retrieve total logins.' } };
            const getTotalLoginsInPeriodSpy = jest.spyOn(userLoginLogEntity, 'getTotalLoginsInPeriod').mockResolvedValue(errorResponse);
            
            const result = await userLoginLogEntity.getTotalLogins(startDate, endDate);

            expect(getTotalLoginsInPeriodSpy).toHaveBeenCalledWith(startDate, endDate);
            expect(result).toEqual(errorResponse);

            getTotalLoginsInPeriodSpy.mockRestore();
        });
    });
});
