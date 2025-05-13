const express = require('express');
const shortlistController = require('../controllers/shortlistController');

const router = express.Router();
const shortlistController = new shortlistController.ShortlistController();

router.post('/add', (req, res) => shortlistController.shortlistCleaner(req, res));


module.exports = router;