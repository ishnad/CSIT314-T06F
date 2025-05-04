const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

// Instantiate controllers
const createUserProfileController = new userProfileController.CreateUserProfileController();
const viewUserProfileController = new userProfileController.ViewUserProfileController();
const editUserProfileController = new userProfileController.EditUserProfileController();
const simulateUserProfileController = new userProfileController.SimulateUserProfileController();

router.post('/', (req, res) => createUserProfileController.createUserProfile(req, res));
router.get('/', (req, res) => viewUserProfileController.listUserProfiles(req, res));
router.put('/:id', (req, res) => editUserProfileController.updateUserProfile(req, res));
router.get('/simulate/:profileName', (req, res) => simulateUserProfileController.simulateProfile(req, res));


module.exports = router;