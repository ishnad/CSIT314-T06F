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

class SearchServiceHistoryController {
    constructor() {
        this.serviceBookingEntity = new ServiceBookingEntity();
    }

    /**
     * Handles the HTTP request to search a homeowner's service history.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchServiceHistory(req, res) {
        const homeownerId = req.user.id;

        // Extract search parameters from query string
        const { keyword, serviceType, serviceDate, status } = req.query;

        const filters = {
            keyword,
            serviceType,
            serviceDate,
            status
        };

        const result = await this.serviceBookingEntity.getServiceHistory(homeownerId, filters);

        if (result.error) {
            return res.status(result.error.status || 500).json({ error: result.error.message });
        }

        if (result.length === 0) {
            // Alternate flow: No matching past services
            return res.status(200).json({ message: "No service history matches your search", history: [] });
        }

        // Normal flow: Display list of matching past services
        return res.status(200).json(result);
    }
}

module.exports = {
    ViewServiceHistoryController,
    SearchServiceHistoryController
};