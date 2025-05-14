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
        try {
            const cleanerId = req.params.cleanerId;
            if (!cleanerId) {
                return res.status(400).json({ error: "Cleaner ID is required" });
            }

            const stats = await this.profileInsightsEntity.fetchViewStats(cleanerId);
            res.status(200).json(stats);
        } catch (error) {
            console.error('Error in fetchViewStats:', error);
            res.status(500).json({ 
                error: 'Failed to fetch view statistics',
                details: error.message 
            });
        }
    }

    /**
     * Handles the HTTP request to fetch the shortlist count for the authenticated cleaner.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async fetchShortlistCount(req, res) {
        try {
            const cleanerId = req.params.cleanerId;
            if (!cleanerId) {
                return res.status(400).json({ error: "Cleaner ID is required" });
            }

            const result = await this.profileInsightsEntity.fetchShortlistCount(cleanerId);
            
            // For shortlists, we consider 0 count a normal case now
            res.status(200).json({
                shortlistCount: result.shortlistCount || 0
            });
        } catch (error) {
            console.error('Error in fetchShortlistCount:', error);
            res.status(500).json({ 
                error: 'Failed to fetch shortlist count',
                details: error.message 
            });
        }
    }
}

module.exports = { CleanerInsightsController };