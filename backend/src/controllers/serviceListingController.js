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
        const { cleanerId } = req.body;
        if (!cleanerId) {
            return res.status(400).json({ error: "Cleaner ID is required" });
        }

        const { serviceType, description, ratePerHr: ratePerHrString } = req.body;
        
        const numericRate = parseFloat(ratePerHrString);
        if (isNaN(numericRate)) {
            return res.status(400).json({ error: "Invalid rate format" });
        }

        const result = await this.serviceListingEntity.createServiceListing(
            serviceType,
            description,
            numericRate,
            cleanerId
        );

        if (result.error) {
            // If the entity returned an error object, use its status and message
            res.status(result.error.status).json({ error: result.error.error });
        } else if (result === true) {
            // Success: return a success message
            res.status(201).json(result);
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
    async getAllListingDetails(req, res) {
        const { cleanerId } = req.params; // Get ID from URL parameter

        if (!cleanerId) {
            return res.status(400).json({ error: 'Cleaner ID is missing in the request path.' });
        }

        // Call the entity method with the cleaner's ID from the path
        const result = await this.serviceListingEntity.getAllCleanerListings(cleanerId);

        if (result.error) {
            // The entity already includes status in result.error
            return res.status(result.error.status).json({ error: result.error.error });
        }
        // The entity returns an array (possibly empty) on success
        return res.status(200).json({ listings: result });
    }

    /**
     * Handles the HTTP request to get details for a specific service listing.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async getListingDetails(req, res) {
        const listingId = req.params.id;
        const result = await this.serviceListingEntity.getListingDetails(listingId);

        if (result.error) {
            // If the entity returned an error object, use its status and message
            res.status(result.error.status).json({ error: result.error.error });
        } else {
            // Success: return the listing data
            res.status(200).json({listing: result });
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
        
        // Validate required fields exist in request body
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const { serviceType, title, description, ratePerHr } = req.body;
        
        // Validate required fields
        if (!serviceType || !title || !description || !ratePerHr) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const numericRate = parseFloat(ratePerHr);
        if (isNaN(numericRate)) {
            return res.status(400).json({ error: "Invalid rate format" });
        }

        const updateData = {
            serviceType,
            title,
            description,
            ratePerHr: numericRate
        };

        const result = await this.serviceListingEntity.editServiceListing(listingId, updateData);

        if (result.error) {
            res.status(result.error.status).json({ error: result.error.error });
        } else if (result === true) {
            // Entity returned true, meaning success
            res.status(200).json(result);
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
    async toggleListingStatus(req, res) {
        const listingId = req.params.id;
        const cleanerId = req.user?.id;

        const result = await this.serviceListingEntity.toggleListingStatus(listingId, cleanerId);

        if (result.error) {
            res.status(result.error.status).json({ error: result.error.error });
        } else {
            res.status(200).json(result);
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

        // Extract filters from query parameters
        const { keyword: queryKeyword, serviceType: queryServiceType, minRate: queryMinRate, maxRate: queryMaxRate } = req.query;

        let numMinRate;
        numMinRate = parseFloat(queryMinRate);
        let numMaxRate;
        numMaxRate = parseFloat(queryMaxRate);

        const result = await this.serviceListingEntity.searchListings(
            searcherCleanerId,
            queryKeyword,
            queryServiceType,
            numMinRate,
            numMaxRate
        );

        if (result.error) {
            // Only return error if there was an active search
            if (req.query.keyword || req.query.serviceType || req.query.minRate || req.query.maxRate) {
                return res.status(result.error.status).json({ error: result.error.error });
            }
            return res.status(200).json([]); // Return empty array when no filters
        }
        res.status(200).json(result);
    }
}


module.exports = {
    CreateServiceListingController,
    GetServiceListingController,
    EditServiceListingController,
    SuspendServiceListingController,
    SearchServiceListingsController
};
