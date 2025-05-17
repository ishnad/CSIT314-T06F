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
        const { name, serviceCatName, description, ratePerHr, cleanerId } = req.body;
        
        const result = await this.serviceListingEntity.createServiceListing(
            name,
            serviceCatName,
            description,
            ratePerHr,
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
        if (listingId === 'service-categories') {
            // Handle case where someone accidentally calls listing details endpoint for categories
            return res.status(400).json({ error: "Invalid listing ID" });
        }

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
        const { name, serviceCatName, description, ratePerHr } = req.body;

        const result = await this.serviceListingEntity.editServiceListing(listingId, {
            name,
            serviceCatName,
            description,
            ratePerHr
        });

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
        const { keyword: queryKeyword, serviceCatName: queryServiceCatName, minRate: queryMinRate, maxRate: queryMaxRate } = req.query;

        let numMinRate;
        numMinRate = parseFloat(queryMinRate);
        let numMaxRate;
        numMaxRate = parseFloat(queryMaxRate);

        const result = await this.serviceListingEntity.searchListings(
            searcherCleanerId,
            queryKeyword,
            queryServiceCatName,
            numMinRate,
            numMaxRate
        );

        if (result.error) {
            // Return empty array for 404 errors (no matches)
            if (result.error.status === 404) {
                return res.status(200).json([]);
            }
            return res.status(result.error.status).json({ error: result.error.error });
        }
        res.status(200).json(result);
    }
}


class ServiceCategoriesController {
    constructor() {
        this.serviceListingEntity = new ServiceListingEntity();
    }

    /**
     * Handles the HTTP request to get all active service categories.
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     */
    async getActiveServiceCategories(req, res) {
        try {
            const categories = await this.serviceListingEntity.getActiveServiceCategories();
            
            if (!Array.isArray(categories)) {
                return res.status(500).json({ error: 'Unexpected response format from service' });
            }
            
            return res.status(200).json(categories);
        } catch (error) {
            console.error('Error in ServiceCategoriesController:', error);
            res.status(500).json({ error: 'Failed to fetch service categories', details: error.message });
        }
    }
}

module.exports = {
    CreateServiceListingController,
    GetServiceListingController,
    EditServiceListingController,
    SuspendServiceListingController,
    SearchServiceListingsController,
    ServiceCategoriesController
};
