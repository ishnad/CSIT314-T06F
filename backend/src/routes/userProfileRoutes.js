const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

// Instantiate controllers
const createUserProfileController = new userProfileController.CreateUserProfileController();
const viewUserProfileController = new userProfileController.ViewUserProfileController();

router.post('/', (req, res) => createUserProfileController.createUserProfile(req, res));
router.get('/', (req, res) => viewUserProfileController.listUserProfiles(req, res));


module.exports = router; // Export the router