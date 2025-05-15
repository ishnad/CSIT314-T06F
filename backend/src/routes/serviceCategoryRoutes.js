const express = require('express');
const router = express.Router();
const { CreateServiceCatController, ViewServiceCategoriesController, SearchServiceCatController } = require('../controllers/serviceCategoryController');

const createServiceCatController = new CreateServiceCatController();
const viewServiceCategoriesController = new ViewServiceCategoriesController();
const searchServiceCatController = new SearchServiceCatController();

router.post('/service-categories', (req, res) => createServiceCatController.createServiceCategory(req, res));
router.get('/service-categories', (req, res) => viewServiceCategoriesController.getAllServiceCategories(req, res));
router.get( '/service-categories/search', (req, res) => searchServiceCatController.searchServiceCategories(req, res));

module.exports = router;