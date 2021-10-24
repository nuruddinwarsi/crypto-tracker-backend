const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth.middleware');
const { home } = require('../controllers/index.controller');

router.get('/', authenticate, home);

module.exports = router;
