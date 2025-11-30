const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Endpoint para finalizar compra
router.post('/', CartController.checkout);

module.exports = router;
