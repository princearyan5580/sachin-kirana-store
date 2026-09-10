// kirana-backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const protect = authMiddleware.protect || ((req, res, next) => next());
const admin = authMiddleware.admin || ((req, res, next) => next());

const {
  createRazorpayOrder,
  verifyPayment,
  getOrderHistory,
  getAdminDashboard,
  updateOrderStatus
} = require('../controllers/orderController');

// 🟢 1. Admin Dashboard Route
router.get('/admin/dashboard', protect, admin, getAdminDashboard);

// 🟢 2. User History Routes
router.get('/history', protect, getOrderHistory);
router.get('/myorders', protect, getOrderHistory);

// 🟢 3. Payment / Checkout Endpoints (Covering all URL patterns)
router.post('/', protect, createRazorpayOrder);
router.post('/checkout', protect, createRazorpayOrder);
router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

// 🟢 4. Admin Update Status
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;