const { PrismaClient } = require('../generated/prisma');

class ServiceBookingEntity {
    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Retrieves a list of past service bookings for a given booking ID (or homeowner ID).
     * It fetches bookings that are 'CONFIRMED' or 'COMPLETED'.
     * @param {string} homeownerId - The ID of the homeowner whose past bookings are to be retrieved.
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of service booking objects or an error object.
     */
    async getPastBookings(homeownerId) {
        try {
            const pastBookings = await this.prisma.serviceBooking.findMany({
                where: {
                    homeownerId: homeownerId,
                    status: {
                        in: ['CONFIRMED', 'COMPLETED']
                    }
                },
                select: {
                    bookingID: true,
                    cleanerID: true,
                    serviceDate: true,
                    status: true,
                    serviceType: true,
                    ratePerHr: true
                },
                orderBy: {
                    serviceDate: 'desc'
                }
            });

            if (!pastBookings) {
                return []; // Return an empty list if no bookings are found, as per alternate flow
            }

            return pastBookings;

        } catch (error) {
            console.error(`Error fetching past bookings for homeowner ${homeownerId}:`, error);
            return {
                error: {
                    status: 500,
                    message: 'Failed to retrieve past service bookings due to a server error.'
                }
            };
        }
    }

    /**
     * Retrieves and filters the service history for a specific homeowner.
     *
     * @param {string} homeownerId - The ID of the logged-in homeowner.
     * @param {object} filters - An object containing filter criteria.
     * @param {string} [filters.keyword] - A general keyword to search across service type, and cleaner's name.
     * @param {string} [filters.serviceType] - Specific service type to filter by.
     * @param {Date} [filters.serviceDate] - Specific date to filter by.
     * @param {string} [filters.status] - Specific status to filter by (e.g., 'COMPLETED', 'CONFIRMED').
     * @returns {Promise<Array<object>|{error: {status: number, message: string}}>} A list of service booking objects or an error object.
     */
    async getServiceHistory(homeownerId, { keyword, serviceType, serviceDate, status }) {
        try {
            const whereClause = {
                homeownerId: homeownerId,
            };

            // Apply specific filters if provided
            if (serviceType) {
                whereClause.serviceType = { contains: serviceType, mode: 'insensitive' };
            }
            if (status) {
                whereClause.status = status; // Assuming exact match for status
            }
            if (serviceDate) {
                // For date, Prisma expects a DateTime object.
                // If serviceDate is just a date string, handle the range for that day.
                // Example: filter for bookings that occurred on the specific serviceDate.
                const date = new Date(serviceDate);
                if (!isNaN(date.getTime())) {
                    const gte = new Date(date.setHours(0, 0, 0, 0)); // Start of the day
                    const lt = new Date(date.setDate(date.getDate() + 1));   // Start of the next day
                    whereClause.serviceDate = {
                        gte: gte,
                        lt: lt,
                    };
                }
            }

            // Apply keyword search across multiple fields
            if (keyword && keyword.trim() !== "") {
                const trimmedKeyword = keyword.trim();
                whereClause.OR = [
                    { serviceType: { contains: trimmedKeyword, mode: 'insensitive' } },
                    { cleaner: { username: { contains: trimmedKeyword, mode: 'insensitive' } } },
                ];
            }

            if (!status) {
                whereClause.status = { in: ['CONFIRMED', 'COMPLETED'] };
            }

            const serviceHistory = await this.prisma.serviceBooking.findMany({
                where: whereClause,
                select: {
                    id: true, // bookingID
                    cleanerId: true,
                    serviceDate: true,
                    status: true,
                    serviceType: true,
                    ratePerHr: true,
                    cleaner: {
                        select: {
                            id: true,
                            username: true // Cleaner's name
                        }
                    }
                },
                orderBy: {
                    serviceDate: 'desc' // Show most recent first
                }
            });

            return serviceHistory;

        } catch (error) {
            console.error(`Error fetching service history for homeowner ${homeownerId}:`, error);
            // Check for specific Prisma errors if needed, e.g., invalid date format
            if (error.message.includes("Invalid `prisma.serviceBooking.findMany()` invocation")) {
                 return {
                    error: {
                        status: 400, // Bad Request
                        message: 'Invalid search criteria. Please check the format of your inputs (e.g., date).'
                    }
                };
            }
            return {
                error: {
                    status: 500,
                    message: 'Failed to retrieve service history due to a server error.'
                }
            };
        }
    }
}

module.exports = ServiceBookingEntity;