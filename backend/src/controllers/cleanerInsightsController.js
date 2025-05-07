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
        const userProfileName = req.user?.profile?.name;

        // Authorization: Ensure user is authenticated
        if (!cleanerId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        // Authorization: Ensure user is a 'Cleaner'
        if (userProfileName !== 'Cleaner') {
            return res.status(403).json({ error: 'Forbidden: Only Cleaners can view profile insights.' });
        }

        try {
            const stats = await this.profileInsightsEntity.fetchViewStats(cleanerId);

            if (stats.error) {
                // If the entity returned an error object, use its status and message
                return res.status(stats.error.status).json({ error: stats.error.error });
            }
            
            // Handle "No profile views yet" message from entity
            if (stats.message) {
                return res.status(200).json(stats);
            }

            // Success: return the statistics
            res.status(200).json(stats);

        } catch (error) {
            // Catch unexpected errors during the process
            console.error(`Controller error fetching view stats for cleaner ${cleanerId}:`, error);
            res.status(500).json({ error: 'An unexpected error occurred while fetching profile view statistics.' });
        }
    }
}

module.exports = { CleanerInsightsController };