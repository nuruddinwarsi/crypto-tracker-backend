const express = require('express');
const router = express.Router();

const {
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio,
} = require('../controllers/portfolio.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/api/v1/getPortfolio', authenticate, getPortfolio);
router.post('/api/v1/addToPortfolio', authenticate, addToPortfolio);
router.patch(
  '/api/v1/removeFromPortfolio/:cryptoId',
  authenticate,
  removeFromPortfolio
);

module.exports = router;
