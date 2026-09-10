// kirana-backend/routes/orderRoutes.js
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

// 🟢 1. Admin Dashboard Route
router.get('/admin/dashboard', protect, admin, getAdminDashboard);

// 🟢 2. User History Routes
router.get('/history', protect, getOrderHistory);
router.get('/myorders', protect, getOrderHistory);

// 🟢 3. Payment / Checkout Endpoints
// Yeh teeno mapping kisi bhi URL pattern ko 404 nahi hone dengi:
router.post('/', protect, createRazorpayOrder);           // 👉 Handles POST to /api/checkout
router.post('/checkout', protect, createRazorpayOrder);   // 👉 Handles POST to /api/orders/checkout
router.post('/razorpay', protect, createRazorpayOrder);   // 👉 Handles POST to /api/orders/razorpay
router.post('/verify', protect, verifyPayment);

// 🟢 4. Admin Update Status
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;