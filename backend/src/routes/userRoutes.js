const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes for /api/users (prefix added in server.js)
const createUserAccountController = new userController.CreateUserAccountController();
const viewUserAccountController = new userController.ViewUserAccountController();
const editUserAccountController = new userController.EditUserAccountController();
const suspendUserAccountController = new userController.SuspendUserAccountController();
const searchUserAccountController = new userController.SearchUserAccountController();

router.post('/', (req, res) => createUserAccountController.createUserAccount(req, res));
router.get('/', (req, res) => viewUserAccountController.viewUserAccount(req, res));
router.put('/', (req, res) => editUserAccountController.editUserAccount(req, res));
router.post('/suspend', (req, res) => suspendUserAccountController.suspendUserAccount(req, res));
router.get('/search', (req, res) => searchUserAccountController.searchUserAccount(req, res));

// Add other user routes here later
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router; // Export the router