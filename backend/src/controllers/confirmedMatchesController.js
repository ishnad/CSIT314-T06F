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
        const userProfileName = req.user?.profile?.name;

        // Authorization: Ensure user is authenticated
        if (!cleanerId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        // Authorization: Ensure user is a 'Cleaner'
        if (userProfileName !== 'Cleaner') {
            return res.status(403).json({ error: 'Forbidden: Only Cleaners can view their confirmed matches.' });
        }

        // Extract filters from query parameters
        const { serviceType, startDate, endDate } = req.query;
        const filters = {};
        if (serviceType) filters.serviceType = serviceType;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        try {
            const result = await this.matchServiceEntity.fetchConfirmedMatches(cleanerId, filters);

            if (result.error) {
                return res.status(result.error.status).json({ error: result.error.error });
            }
            
            if (result.message) { // e.g., "No confirmed matches found..."
                return res.status(200).json(result);
            }

            // Success: return the list of matches
            res.status(200).json(result);

        } catch (error) {
            // Catch unexpected errors during the process
            console.error(`Controller error fetching confirmed matches for cleaner ${cleanerId}:`, error);
            res.status(500).json({ error: 'An unexpected error occurred while fetching confirmed matches.' });
        }
    }
}

module.exports = { ConfirmedMatchesController };