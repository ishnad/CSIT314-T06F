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

router.post('/', (req, res) => createUserAccountController.createUserAccount(req, res));
router.get('/', (req, res) => viewUserAccountController.viewUserAccount(req, res));
router.put('/', (req, res) => editUserAccountController.editUserAccount(req, res));
router.post('/suspend', (req, res) => suspendUserAccountController.suspendUserAccount(req, res));
router.get('/search', (req, res) => searchUserAccountController.searchUserAccount(req, res));
router.post('/login', (req, res) => verifyLoginCredentialsController.verifyLoginCredentials(req, res));

// Add other user routes here later
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router; // Export the router