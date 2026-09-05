// kirana-backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Controller methods import
const { 
  createOrder, 
  getAllOrders, 
  getUserOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');

// All orders (Admin fetch karta hai)
router.get('/', protect, admin, getAllOrders);
router.get('/myorders', protect, getUserOrders);
router.post('/', protect, createOrder);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;