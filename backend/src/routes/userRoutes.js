const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes for /api/users (prefix added in server.js)
const createUserAccountController = new userController.CreateUserAccountController();
router.post('/', (req, res) => createUserAccountController.create(req, res)); // POST /api/users maps to CreateUserAccountController.create

// Add other user routes here later
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router; // Export the router