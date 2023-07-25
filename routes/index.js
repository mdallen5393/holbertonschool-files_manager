const express = require('express');

const router = express.Router();

// Require controllers
const AppController = require('../controllers/AppController');

// Endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;
