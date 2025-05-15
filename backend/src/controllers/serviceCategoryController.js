// ../controllers/serviceCategoryController.js
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

module.exports = {
    CreateServiceCatController,
    ViewServiceCategoriesController
};