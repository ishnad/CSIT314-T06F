const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

// Instantiate controllers
const createUserProfileController = new userProfileController.CreateUserProfileController();

// Define routes for /api/profiles (prefix added in server.js)

// POST /api/profiles - Create a new user profile
router.post('/', (req, res) => createUserProfileController.createUserProfile(req, res));

// Add other profile routes later (GET, PUT, DELETE)
// router.get('/', ...);
// router.get('/:id', ...);
// router.put('/:id', ...);
// router.delete('/:id', ...);


module.exports = router; // Export the router