const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();

// Define routes for /api/users (prefix added in server.js)
const createUserAccountController = new userAccountController.CreateUserAccountController();
const viewUserAccountController = new userAccountController.ViewUserAccountController();
const editUserAccountController = new userAccountController.EditUserAccountController();
const suspendUserAccountController = new userAccountController.SuspendUserAccountController();
const searchUserAccountController = new userAccountController.SearchUserAccountController();
const viewCleanerProfileController = new userAccountController.ViewCleanerProfileController();
const searchCleanerController = new userAccountController.SearchCleanerController();

router.post('/', (req, res) => createUserAccountController.createUserAccount(req, res));
router.get('/', (req, res) => viewUserAccountController.viewUserAccount(req, res));
router.put('/', (req, res) => editUserAccountController.editUserAccount(req, res));
router.post('/suspend', (req, res) => suspendUserAccountController.suspendUserAccount(req, res));
router.get('/search', (req, res) => searchUserAccountController.searchUserAccount(req, res));
router.get('/cleaners/active', (req, res) => viewCleanerProfileController.getAllActiveCleaners(req, res));
router.get('/:cleanerId/profile', (req, res) => viewCleanerProfileController.viewCleanerProfile(req, res));
router.get('/cleaners/search', (req, res) => searchCleanerController.searchCleaner(req, res));

module.exports = router;
