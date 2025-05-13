const ShortlistEntity = require('../entities/shortlistEntity');

class ShortlistController {
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

module.exports = ShortlistController;