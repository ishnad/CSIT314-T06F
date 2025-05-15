const ServiceCategoryEntity = require('../entities/serviceCategoryEntity');

class CreateServiceCatController {
    constructor() {
        this.serviceCategoryEntity = new ServiceCategoryEntity();
    }

    /**
     * Handles the HTTP request to create a new service category.
     * In an Express controller, these would typically come from req.body.
     * @param {import('express').Request} req - Express request object, expected to have { serviceCatName, serviceCatDescription } in body.
     * @param {import('express').Response} res - Express response object.
     */
    async createServiceCategory(req, res) {
        const { serviceCatName, serviceCatDescription } = req.body;

        const result = await this.serviceCategoryEntity.createServiceCategory(serviceCatName, serviceCatDescription);

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        } else {
            return res.status(201).json(result);
        }
    }
}

class ViewServiceCategoriesController {
    constructor() {
        this.serviceCategoryEntity = new ServiceCategoryEntity();
    }

    async getAllServiceCategories(req, res) {
        const result = await this.serviceCategoryEntity.getAllServiceCategories();

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        } else {
            return res.status(200).json(result);
        }
    }
}

class SearchServiceCatController {
    constructor() {
        this.serviceCategoryEntity = new ServiceCategoryEntity();
    }

    /**
     * Handles HTTP request to search for service categories.
     * Expects 'keyword' and 'status' as query parameters.
     * The 'filter' from BCE is interpreted as 'status'.
     * Corresponds to BCE: SearchServiceCatController's +searchServiceCat (String filter, String keyword): List<ServiceCategory>
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchServiceCategories(req, res) {
        const { keyword, status } = req.query; // Get keyword and status from query params

        let validatedStatus = null;
        if (status && typeof status === 'string') {
            const upperStatus = status.toUpperCase();
            if (Object.values(ServiceCategoryStatus).includes(upperStatus)) {
                validatedStatus = upperStatus;
            }
        }

        const result = await this.serviceCategoryEntity.searchServiceCategories({
            keyword: keyword ? String(keyword) : undefined,
            status: validatedStatus,
        });

        if (result.error) {
            return res.status(result.error.status).json({ error: result.error.message });
        }

        if (result.length === 0) {
            // Alternate flow: 1a. No categories match
            return res.status(200).json({ message: "No matching categories found", categories: [] });
        }

        // Normal flow: 2. System retrieves and displays list of relevant service categories
        return res.status(200).json(result); // List<ServiceCategory>
    }
}

module.exports = {
    CreateServiceCatController,
    ViewServiceCategoriesController,
    SearchServiceCatController
};