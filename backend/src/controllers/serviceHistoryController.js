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
        try {
            const homeownerId = req.user.id;

            // Extract and validate search parameters
            const filters = {};
            if (req.query.keyword) filters.keyword = req.query.keyword;
            if (req.query.serviceType) filters.serviceType = req.query.serviceType;
            if (req.query.serviceDate) filters.serviceDate = req.query.serviceDate;
            if (req.query.status) filters.status = req.query.status;

            const result = await this.serviceBookingEntity.getServiceHistory(homeownerId, filters);

            if (result.error) {
                return res.status(result.error.status || 500).json({ 
                    error: result.error.message || "Error searching service history" 
                });
            }

            // Ensure we always return an array, even if empty
            const history = Array.isArray(result) ? result : [];
            
            return res.status(200).json({
                message: history.length > 0 
                    ? "Search results" 
                    : "No service history matches your search",
                history
            });
        } catch (error) {
            console.error('Error in searchServiceHistory:', error);
            return res.status(500).json({ 
                error: "An unexpected error occurred while searching service history" 
            });
        }
    }
}

module.exports = {
    ViewServiceHistoryController,
    SearchServiceHistoryController
};