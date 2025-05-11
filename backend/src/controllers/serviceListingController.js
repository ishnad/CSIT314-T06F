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
        const { serviceType, title, description, ratePerHr: ratePerHrString } = req.body;
        
        const numericRate = parseFloat(ratePerHrString);

        const result = await this.serviceListingEntity.createServiceListing(
            serviceType,
            title,
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
    async getListingDetails(req, res) {
        const requestingUserId = req.user?.id;
        const listingId = req.params.id; // Get listing ID from route parameters

        // Call the entity method, passing both listing ID and the requesting user's ID
        const result = await this.serviceListingEntity.getListingDetails(listingId, requestingUserId);

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
        const cleanerId = req.user?.id;

        const { serviceType, description, ratePerHr } = req.body;
        const updateData = {};

        // Only include fields in updateData if they are present in the request body
        if (serviceType !== undefined) updateData.serviceType = serviceType;
        if (description !== undefined) updateData.description = description;
        if (ratePerHr !== undefined) {
            const numericRate = parseFloat(ratePerHr);
            updateData.ratePerHr = numericRate;
        }

        const result = await this.serviceListingEntity.editServiceListing(listingId, cleanerId, updateData);

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
    async suspendServiceListing(req, res) {
        const listingId = req.params.id;
        const cleanerId = req.user?.id;

        const result = await this.serviceListingEntity.suspendServiceListing(listingId, cleanerId);

        if (result.error) {
            res.status(result.error.status).json({ error: result.error.error });
        } else if (result === true) {
            // Entity returned true, meaning success
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
            return res.status(result.error.status).json({ error: result.error.error });
        }
        else {
            res.status(200).json({listing: result});
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