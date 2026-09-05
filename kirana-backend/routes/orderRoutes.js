// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createRazorpayOrder,
  verifyPayment,
  getOrderHistory,
  getAdminDashboard,
  updateOrderStatus
} = require('../controllers/orderController');

// 🟢 Admin Dashboard Route (Fixes 404)
router.get('/admin/dashboard', protect, admin, getAdminDashboard);

// 🟢 User History Route
router.get('/history', protect, getOrderHistory);
router.get('/myorders', protect, getOrderHistory);

// 🟢 Payment Endpoints
router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

// 🟢 Admin Update Status
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;