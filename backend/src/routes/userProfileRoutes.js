const express = require('express');
const userProfileController = require('../controllers/userProfileController');

const router = express.Router();

const createUserAccountController = new userProfileController.CreateUserAccountController();

// Create a new user profile
router.post('/', (req, res) => createUserAccountController.createUserAccount(req, res));

module.exports = router;