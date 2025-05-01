const express = require('express');
const userAccountController = require('../controllers/userAccountController');

const router = express.Router();

// Define routes for /api/users (prefix added in server.js)
const createUserAccountController = new userAccountController.CreateUserAccountController();
const viewUserAccountController = new userAccountController.ViewUserAccountController();
const editUserAccountController = new userAccountController.EditUserAccountController();
const suspendUserAccountController = new userAccountController.SuspendUserAccountController();
const searchUserAccountController = new userAccountController.SearchUserAccountController();
const verifyLoginCredentialsController = new userAccountController.VerifyLoginCredentialsController();
const logoutController = new userAccountController.LogoutController();

router.post('/', (req, res) => createUserAccountController.createUserAccount(req, res));
router.get('/', (req, res) => viewUserAccountController.viewUserAccount(req, res));
router.put('/', (req, res) => editUserAccountController.editUserAccount(req, res));
router.post('/suspend', (req, res) => suspendUserAccountController.suspendUserAccount(req, res));
router.get('/search', (req, res) => searchUserAccountController.searchUserAccount(req, res));
router.post('/login', (req, res) => verifyLoginCredentialsController.verifyLoginCredentials(req, res));
router.post('/logout', (req, res) => logoutController.confirmLogout(req, res));

module.exports = router; // Export the router