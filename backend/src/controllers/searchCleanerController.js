const UserAccountEntity = require('../entities/userAccountEntity');

class SearchCleanerController {
    constructor() {
        this.userAccountEntity = new UserAccountEntity();
    }

    /**
     * Handles the HTTP request to search for cleaners.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchCleaner(req, res) {
        const { keyword } = req.query;
        
        const result = await this.userAccountEntity.searchCleaners(keyword);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        }

        if (result.length === 0) {
            // Alternate flow: No matching cleaner profiles
            return res.status(200).json({ message: "No cleaners match your search criteria", cleaners: [] });
        }

        // Normal flow: Display list of matching cleaner profiles
        return res.status(200).json(result);
    }
}

module.exports = SearchCleanerController;