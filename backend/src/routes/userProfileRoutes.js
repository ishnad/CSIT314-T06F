const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

// Instantiate the controllers
const createUserProfileController = new userProfileController.CreateUserProfileController();
const viewUserProfileController = new userProfileController.ViewUserProfileController();

// Create a new user profile
router.post('/', (req, res) => createUserProfileController.createUserProfile(req, res));
// View list of user profiles
router.get('/', (req, res) => viewUserProfileController.listUserProfiles(req, res));

module.exports = router;