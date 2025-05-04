const ServiceListingEntity = require('../entities/serviceListingEntity');

class CreateServiceListingController {
    constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to create a new service listing.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async createServiceListing(req, res) {
        const cleanerId = req.user?.id;
        const userProfileName = req.user?.profile?.name;

        // --- Authorization Check ---
        if (!cleanerId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (userProfileName !== 'Cleaner') {
             return res.status(403).json({ error: 'Forbidden: Only Cleaners can create service listings.' });
        }
        // --- End Authorization Check ---

        const { serviceType, title, description, ratePerHr, duration, availability } = req.body;

        // Basic check for required fields in the body (entity does more detailed validation)
        if (!serviceType || !title || !description || ratePerHr === undefined || duration === undefined || !availability) {
            return res.status(400).json({ error: 'Missing required fields in request body: serviceType, title, description, ratePerHr, duration, availability.' });
        }

        // Ensure numeric types are actually numbers before passing to entity
        const numericRate = parseFloat(ratePerHr);
        const numericDuration = parseFloat(duration);
        if (isNaN(numericRate) || isNaN(numericDuration)) {
             return res.status(400).json({ error: 'ratePerHr and duration must be valid numbers.' });
        }

        try {
            const listingData = {
                serviceType,
                title,
                description,
                ratePerHr: numericRate,
                duration: numericDuration,
                availability, // Pass as string, entity converts
                cleanerId // Pass the authenticated cleaner's ID
            };

            const result = await this.serviceListingEntity.createServiceListing(listingData);

            if (result.error) {
                // If the entity returned an error object, use its status and message
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success: return the created listing data
                res.status(201).json({ message: 'Service listing created successfully.', listing: result });
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Controller error creating service listing:", error);
            res.status(500).json({ error: 'An unexpected error occurred while creating the service listing.' });
        }
    }
}

module.exports = {
    CreateServiceListingController
};