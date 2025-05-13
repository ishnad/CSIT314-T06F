const ShortlistEntity = require('../entities/shortlistEntity');

class SaveShortlistController {
    constructor() {
        this.shortlistEntity = new ShortlistEntity();
    }

    /**
     * Handles the HTTP request to add a cleaner to the homeowner's shortlist.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async shortlistCleaner(req, res) {
        const { cleanerId } = req.body; // Or req.params.cleanerId if using URL parameter

        const result = await this.shortlistEntity.shortlistCleaner(homeownerId, cleanerId);

        if (result === true) {
            res.status(201).json(true); // Successfully shortlisted
        } else if (result.error) {
            // Error object returned from entity
            res.status(result.error.status).json({ error: result.error.message });
        }
    }
}

class SearchShortlistCleanerController {
    constructor() {
        this.shortlistEntity = new ShortlistEntity();
    }

    /**
     * Handles the HTTP request to search for a cleaner within the authenticated homeowner's shortlist.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchShortlistCleaner(req, res) {
        const homeownerId = req.user?.id;
        const { keyword } = req.query; // Get keyword from query params: /api/shortlist/search?keyword=reliable

        const result = await this.shortlistEntity.searchShortlistCleaner(homeownerId, keyword || ""); // Pass empty string if keyword is undefined

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        }

        // if (result.length === 0 && keyword) {
        //     return res.status(200).json({ message: "No cleaners found in your shortlist matching your search.", data: [] });
        // }
        // if (result.length === 0 && !keyword) {
        //     return res.status(200).json({ message: "Your shortlist is currently empty or no active cleaners are shortlisted.", data: [] });
        // }

        res.status(200).json(result);
    }
}

class ViewShortlistController {
    constructor() {
        this.shortlistEntity = new ShortlistEntity();
    }

    /**
     * Handles the HTTP request to retrieve all cleaners in the authenticated homeowner's shortlist.
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async viewCleanerProfile(req, res) {
        const homeownerId = req.user?.id;
        
        const result = await this.shortlistEntity.fetchAllCleanersForHomeowner(homeownerId);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        }

        if (result.length === 0) {
            return res.status(200).json({ message: "You have no shortlisted cleaners yet.", data: [] });
        }

        res.status(200).json(result);
    }
}

module.exports = {
    SaveShortlistController,
    SearchShortlistCleanerController,
    ViewShortlistController
};