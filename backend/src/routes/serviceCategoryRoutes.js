const express = require('express');
const router = express.Router();
const { CreateServiceCatController, ViewServiceCategoriesController } = require('../controllers/serviceCategoryController');

const createServiceCatController = new CreateServiceCatController();
const viewServiceCategoriesController = new ViewServiceCategoriesController();

router.post('/service-categories', (req, res) => createServiceCatController.createServiceCategory(req, res));
router.get('/service-categories', (req, res) => viewServiceCategoriesController.getAllServiceCategories(req, res));


module.exports = router;