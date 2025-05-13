const ServiceBookingEntity = require('../entities/serviceBookingEntity');

class ViewServiceHistoryController {
    constructor() {
        this.serviceBookingEntity = new ServiceBookingEntity();
    }

    /**
     * Handles the HTTP request to view a homeowner's service history.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async viewServiceHistory(req, res) {
        const homeownerId = req.user.id;

        const result = await this.serviceBookingEntity.getPastBookings(homeownerId);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        }

        if (result.length === 0) {
            // Alternate flow: No confirmed or completed service bookings
            return res.status(200).json({ services: [] });
        }

        // Normal flow: Display list of all past confirmed or completed service bookings
        return res.status(200).json(result);
    }
}

module.exports = ViewServiceHistoryController;