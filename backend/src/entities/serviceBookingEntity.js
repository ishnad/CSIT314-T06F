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
}

module.exports = ServiceBookingEntity;