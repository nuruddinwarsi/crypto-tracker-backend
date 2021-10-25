const express = require('express');
const router = express.Router();

const {
  getPortfolio,
  addToPortfolio,
} = require('../controllers/portfolio.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/api/v1/getPortfolio', authenticate, getPortfolio);
router.post('/api/v1/addToPortfolio', authenticate, addToPortfolio);

module.exports = router;
