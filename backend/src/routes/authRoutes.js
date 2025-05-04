const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Instantiate the combined controller
const authControllerInstance = new authController.AuthController();

router.post('/login', (req, res) => authControllerInstance.login(req, res));
router.post('/logout', (req, res) => authControllerInstance.logout(req, res));

module.exports = router;