const MatchServiceEntity = require('../entities/matchServiceEntity');

class ConfirmedMatchesController {
    constructor() {
        this.matchServiceEntity = new MatchServiceEntity();
    }

    /**
     * Fetches all confirmed matches for the authenticated cleaner
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async fetchAllConfirmedMatches(req, res) {
        const cleanerId = req.user?.id;

        const result = await this.matchServiceEntity.fetchAllConfirmedMatches(cleanerId);
        
        // Return empty array if no matches found instead of error
        res.status(200).json(Array.isArray(result) ? result : []);
    }

    /**
     * Fetches confirmed matches with optional filters
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async fetchConfirmedMatches(req, res) {
        const cleanerId = req.user?.id;
        if (!cleanerId) {
            return res.status(400).json({ error: "Cleaner ID is required" });
        }

        // Extract filters from query parameters
        const { serviceType, startDate, endDate } = req.query;
        const filters = { 
            serviceType: serviceType || '',
            startDate: startDate || '',
            endDate: endDate || ''
        };

        const result = await this.matchServiceEntity.fetchConfirmedMatches(cleanerId, filters);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }
        
        res.status(200).json(result);
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

class FetchPastMatchesController {
    constructor() {
        this.matchServiceEntity = new MatchServiceEntity();
    }

    /**
     * Handles the HTTP request to fetch past matches for a homeowner
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async fetchPastMatches(req, res) {
        const homeownerId = req.user?.id;
        
        const result = await this.matchServiceEntity.fetchPastMatchesHomeowner(homeownerId);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }

        res.status(200).json(result);
    }
}

class CreateMatchController {
    constructor() {
        this.matchServiceEntity = new MatchServiceEntity();
    }

    /**
     * Handles the HTTP request to create a new confirmed match
     * @param {object} req - Express request object
     * @param {object} res - Express response object
     */
    async createMatch(req, res) {
        const { serviceListingId, homeownerId } = req.body;
        
        const result = await this.matchServiceEntity.createMatch(homeownerId, serviceListingId);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }

        res.status(201).json(result);
    }
}

module.exports = { 
    ConfirmedMatchesController, 
    SearchConfirmedMatchesController,
    CreateMatchController,
    FetchPastMatchesController
};
