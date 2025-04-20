const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes for /api/users (prefix added in server.js)
router.post('/', userController.createUserAccount); // POST /api/users maps to createUserAccount

// Add other user routes here later
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router; // Export the router