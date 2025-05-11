const ProfileInsightsEntity = require('../entities/profileInsightsEntity');

class CleanerInsightsController {
    constructor() {
        this.profileInsightsEntity = new ProfileInsightsEntity();
    }

    /**
     * Handles the HTTP request to fetch profile view statistics for the authenticated cleaner.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async fetchViewStats(req, res) {
        const cleanerId = req.user?.id;

        const stats = await this.profileInsightsEntity.fetchViewStats(cleanerId);
        if (stats.error) {
            // If the entity returned an error object, use its status and message
            return res.status(stats.error.status).json({ error: stats.error.error });
        }
        else {
            // Success: return the statistics
            res.status(200).json(stats);
        }
    }

    /**
     * Handles the HTTP request to fetch the shortlist count for the authenticated cleaner.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async fetchShortlistCount(req, res) {
        const cleanerId = req.user?.id;

        const result = await this.profileInsightsEntity.fetchShortlistCount(cleanerId);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.error });
        }
        else {
            // Handle "You have not been shortlisted yet" message or success
            res.status(200).json(result);
        }
    }
}

module.exports = { CleanerInsightsController };