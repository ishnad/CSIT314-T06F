const { Prisma } = require('../generated/prisma');
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

        const { serviceType, title, description, ratePerHr } = req.body;

        // Basic check for required fields in the body (entity does more detailed validation)
        if (!serviceType || !title || !description || ratePerHr === undefined ) {
            return res.status(400).json({ error: 'Missing required fields in request body: serviceType, title, description, ratePerHr.' });
        }

        // Ensure numeric types are actually numbers before passing to entity
        const numericRate = parseFloat(ratePerHr);
        if (isNaN(numericRate)) {
             return res.status(400).json({ error: 'ratePerHr must be a valid number.' });
        }

        try {
            const listingData = {
                serviceType,
                title,
                description,
                ratePerHr: numericRate,
                cleanerId // Pass the authenticated cleaner's ID
            };

            const result = await this.serviceListingEntity.createServiceListing(listingData);

            if (result.error) {
                // If the entity returned an error object, use its status and message
                res.status(result.error.status).json({ error: result.error.error });
            } else if (result === true) {
                // Success: return a success message
                res.status(201).json({ message: 'Service listing created successfully.' });
            } else {
                // Should not happen if entity behaves as expected (true or error object)
                console.error("Controller error: createServiceListing entity returned unexpected value:", result);
                res.status(500).json({ error: 'Failed to create service listing due to an unexpected internal state.' });
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error("Controller error creating service listing:", error);
            res.status(500).json({ error: 'An unexpected error occurred while creating the service listing.' });
        }
    }
}

class GetServiceListingController {
     constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to get details for a specific service listing.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async getListingDetails(req, res) {
        const requestingUserId = req.user?.id;
        const listingId = req.params.id; // Get listing ID from route parameters

        // --- Authorization Check ---
        if (!requestingUserId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        if (!listingId) {
             return res.status(400).json({ error: 'Listing ID is required in the URL path.' });
        }

        try {
            // Call the entity method, passing both listing ID and the requesting user's ID
            const result = await this.serviceListingEntity.getListingDetails(listingId, requestingUserId);

            if (result.error) {
                // If the entity returned an error object, use its status and message
                res.status(result.error.status).json({ error: result.error.error });
            } else {
                // Success: return the listing data
                res.status(200).json({ message: 'Service listing details retrieved successfully.', listing: result });
            }
        } catch (error) {
            // Catch unexpected errors during the process
            console.error(`Controller error getting service listing ${listingId}:`, error);
            res.status(500).json({ error: 'An unexpected error occurred while retrieving the service listing.' });
        }
    }
}

class EditServiceListingController {
    constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to edit an existing service listing.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async editServiceListing(req, res) {
        const listingId = req.params.id;
        const cleanerId = req.user?.id;
        const userProfileName = req.user?.profile?.name;

        // --- Authorization Check ---
        if (!cleanerId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (userProfileName !== 'Cleaner') {
            return res.status(403).json({ error: 'Forbidden: Only Cleaners can edit service listings.' });
        }
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required in the URL path.' });
        }
        // --- End Authorization Check ---

        const { serviceType, description, ratePerHr } = req.body;
        const updateData = {};

        // Only include fields in updateData if they are present in the request body
        if (serviceType !== undefined) updateData.serviceType = serviceType;
        if (description !== undefined) updateData.description = description;
        if (ratePerHr !== undefined) {
            const numericRate = parseFloat(ratePerHr);
            if (isNaN(numericRate)) {
                return res.status(400).json({ error: 'ratePerHr must be a valid number.' });
            }
            updateData.ratePerHr = numericRate;
        }


        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No fields provided for update. Please provide serviceType, description, or ratePerHr.' });
        }

        try {
            const result = await this.serviceListingEntity.editServiceListing(listingId, cleanerId, updateData);

            if (result.error) {
                res.status(result.error.status).json({ error: result.error.error });
            } else if (result === true) {
                // Entity returned true, meaning success
                res.status(200).json({ message: 'Service listing updated successfully.' });
            } else {
                // Should not happen if entity behaves as expected (true or error object)
                console.error("Controller error: editServiceListing entity returned unexpected value:", result);
                res.status(500).json({ error: 'An unexpected error occurred while editing the service listing.' });
            }
        } catch (error) {
            console.error(`Controller error editing service listing ${listingId}:`, error);
            res.status(500).json({ error: 'An unexpected error occurred while editing the service listing.' });
        }
    }
}

class SuspendServiceListingController {
    constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to suspend an existing service listing.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async suspendServiceListing(req, res) {
        const listingId = req.params.id;
        const cleanerId = req.user?.id;
        const userProfileName = req.user?.profile?.name;

        // --- Authorization Check ---
        if (!cleanerId) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (userProfileName !== 'Cleaner') {
            return res.status(403).json({ error: 'Forbidden: Only Cleaners can suspend service listings.' });
        }
        if (!listingId) {
            return res.status(400).json({ error: 'Listing ID is required in the URL path.' });
        }
        // --- End Authorization Check ---

        try {
            const result = await this.serviceListingEntity.suspendServiceListing(listingId, cleanerId);

            if (result.error) {
                res.status(result.error.status).json({ error: result.error.error });
            } else if (result === true) {
                // Entity returned true, meaning success
                res.status(200).json({ message: 'Service listing suspended successfully.' });
            } else {
                // Should not happen if entity behaves as expected (true or error object)
                console.error("Controller error: suspendServiceListing entity returned unexpected value:", result);
                res.status(500).json({ error: 'An unexpected error occurred while suspending the service listing.' });
            }
        } catch (error) {
            console.error(`Controller error suspending service listing ${listingId}:`, error);
            res.status(500).json({ error: 'An unexpected error occurred while suspending the service listing.' });
        }
    }
}

class SearchServiceListingsController {
    constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to search for service listings.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async searchListings(req, res) {
        const searcherCleanerId = req.user?.id; // ID of the user performing the search
        const userProfileName = req.user?.profile?.name;

        // Authorization: Ensure user is authenticated
        if (!searcherCleanerId) {
            return res.status(401).json({ error: 'Authentication required to search listings.' });
        }
        // Optional: Restrict to Cleaners if desired, though BCE implies any logged-in user might search
        // For CL23, the actor is "Cleaner", so this check is appropriate.
        if (userProfileName !== 'Cleaner') {
            return res.status(403).json({ error: 'Forbidden: Only Cleaners can perform this search.' });
        }


        // Extract filters from query parameters
        const { keyword, serviceType, minRate, maxRate } = req.query;
        const filters = {};

        if (keyword) filters.keyword = keyword;
        if (serviceType) filters.serviceType = serviceType;
        if (minRate) {
            const numMinRate = parseFloat(minRate);
            if (!isNaN(numMinRate)) filters.minRate = numMinRate;
            else return res.status(400).json({ error: 'minRate must be a valid number.'});
        }
        if (maxRate) {
            const numMaxRate = parseFloat(maxRate);
            if (!isNaN(numMaxRate)) filters.maxRate = numMaxRate;
            else return res.status(400).json({ error: 'maxRate must be a valid number.'});
        }

        try {
            const result = await this.serviceListingEntity.searchListings(searcherCleanerId, filters);

            if (result.error) {
                return res.status(result.error.status).json({ error: result.error.error });
            }
            
            if (result.message) { // e.g., "No matching listings found."
                return res.status(200).json(result);
            }

            // Success: return the list of listings
            res.status(200).json(result);

        } catch (error) {
            console.error(`Controller error searching service listings:`, error);
            res.status(500).json({ error: 'An unexpected error occurred while searching service listings.' });
        }
    }
}


module.exports = {
    CreateServiceListingController,
    GetServiceListingController,
    EditServiceListingController,
    SuspendServiceListingController,
    SearchServiceListingsController
};