const MatchServiceEntity = require('../entities/matchServiceEntity');

class ConfirmedMatchesController {
    constructor() {
        this.matchServiceEntity = new MatchServiceEntity();
    }

    /**
     * Handles the HTTP request to fetch confirmed matches for the authenticated cleaner.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async fetchConfirmedMatches(req, res) {
        const cleanerId = req.user?.id;

        // Extract filters from query parameters
        const { serviceType, startDate, endDate } = req.query;
        const filters = {};
        if (serviceType) filters.serviceType = serviceType;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const result = await this.matchServiceEntity.fetchConfirmedMatches(cleanerId, filters);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }
        else {
            // Success: return the list of matches
            res.status(200).json(result);
        }
    }
}

class SearchConfirmedMatchesController {
    constructor() {
        this.matchServiceEntity = new MatchServiceEntity();
    }

    /**
     * Handles the HTTP request to search confirmed matches for the authenticated cleaner,
     * supporting filters like serviceType, date range, and status.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async searchConfirmedMatches(req, res) {
        const cleanerId = req.user?.id;

        // Extract filters from query parameters
        const { serviceType, startDate, endDate, status } = req.query;
        const filters = {};
        if (serviceType) filters.serviceType = serviceType;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        if (status) filters.status = status;

        const result = await this.matchServiceEntity.searchCleanerConfirmedMatches(cleanerId, filters);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }
        else {
            // Success: return the list of matches
            res.status(200).json(result);
        }
    }
}

module.exports = { ConfirmedMatchesController, SearchConfirmedMatchesController };