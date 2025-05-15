const express = require('express');
const router = express.Router();
const { CreateServiceCatController, 
    ViewServiceCategoriesController, 
    SearchServiceCatController, 
    ViewServiceCatController,
    EditServiceCatController,
    SuspendServiceCatController } = require('../controllers/serviceCategoryController');

const createServiceCatController = new CreateServiceCatController();
const getAllServiceCategoriesController = new ViewServiceCategoriesController();
const searchServiceCatController = new SearchServiceCatController();
const viewServiceCatController = new ViewServiceCatController();
const editServiceCatController = new EditServiceCatController();
const suspendServiceCatController = new SuspendServiceCatController();

router.post('/service-categories', (req, res) => createServiceCatController.createServiceCategory(req, res));
router.get('/service-categories', (req, res) => getAllServiceCategoriesController.getAllServiceCategories(req, res));
router.get( '/service-categories/search', (req, res) => searchServiceCatController.searchServiceCategories(req, res));
router.get('/service-categories/:id', (req, res) => viewServiceCatController.getCategoryDetails(req, res));
router.put('/service-categories/:id', (req, res) => editServiceCatController.updateServiceCategory(req, res));
router.post('/service-categories/:id/suspend', (req, res) => suspendServiceCatController.suspendServiceCategory(req, res)
);

module.exports = router;