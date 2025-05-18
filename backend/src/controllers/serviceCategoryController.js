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
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    async searchServiceCategories(req, res) {
        const { keyword, status } = req.query;

        // If no search parameters provided, return all categories
        if (!keyword && !status) {
            const allCategories = await this.serviceCategoryEntity.getAllServiceCategories();
            return res.status(200).json(allCategories);
        }

        // Otherwise process filters
        let validatedStatus = null;
        if (status) {
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

class ViewServiceCatController {
    constructor() {
        this.serviceCategoryEntity = new ServiceCategoryEntity();
    }

    /**
     * Handles HTTP request to view details of a specific service category.
     * @param {import('express').Request} req - Express request object, with req.params.id for categoryId.
     * @param {import('express').Response} res - Express response object.
     */
    async getCategoryDetails(req, res) {
        const { id: categoryId } = req.params; // Get categoryId from URL parameters (e.g., /service-categories/:id)
        const result = await this.serviceCategoryEntity.getCategoryDetailsById(categoryId);

        if (result.error) {
            // Alternate flow: 2a. System fails to retrieve category details
            if (result.error.status === 404) {
                 return res.status(404).json({ error: "Service category not found." });
            }
            return res.status(result.error.status || 500).json({ error: "Unable to retrieve category details. Please try again!" });
        }

        return res.status(200).json(result);
    }
}

class EditServiceCatController {
    constructor() {
        this.serviceCategoryEntity = new ServiceCategoryEntity();
    }

    /**
     * Handles HTTP request to edit an existing service category.
     * @param {import('express').Request} req - Express request object (req.params.id, req.body for data).
     * @param {import('express').Response} res - Express response object.
     */
    async updateServiceCategory(req, res) {
        const { id: categoryId } = req.params;
        const { serviceCatName, serviceCatDescription, status } = req.body;

        const result = await this.serviceCategoryEntity.updateServiceCategory(
            categoryId,
            { serviceCatName, serviceCatDescription, status }
        );

        if (result.error) {
            // Handle specific errors from entity based on status codes
            if (result.error.status === 409) { // Duplicate name
                return res.status(409).json({ error: result.error.message }); // "Service Category Already Exists!"
            }
            if (result.error.status === 404) { // Category not found to update
                // The BCE has "4c. System fails to retrieve category details..." which might fit here
                return res.status(404).json({ error: "Unable to retrieve category details. Please try again!" });
            }
            return res.status(result.error.status || 500).json({ error: result.error.message });
        }

        // Normal flow: 6. System displays updated details in "View Service Category" section
        return res.status(200).json(result); // result is the updated ServiceCategory object
    }
}

class SuspendServiceCatController {
    constructor() {
        this.serviceCategoryEntity = new ServiceCategoryEntity();
    }

    /**
     * Handles HTTP request to suspend a service category.
     * @param {import('express').Request} req - Express request object (req.params.id for categoryId).
     * @param {import('express').Response} res - Express response object.
     */
    async suspendServiceCategory(req, res) {
        const { id: categoryId } = req.params;

        const result = await this.serviceCategoryEntity.suspendServiceCategory(categoryId);

        if (result.error) {
            return res.status(result.error.status || 500).json({ 
                success: false, 
                message: result.error.message 
            });
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Category status toggled successfully' 
        });
    }
}

module.exports = {
    CreateServiceCatController,
    ViewServiceCategoriesController,
    SearchServiceCatController,
    ViewServiceCatController,
    EditServiceCatController,
    SuspendServiceCatController
};
