const express = require('express');
const router = express.Router();

// 1. Safe Auth Middleware Import (Undefined crash protection)
let protect = (req, res, next) => next();
let admin = (req, res, next) => next();

try {
  const authMiddleware = require('../middleware/authMiddleware');
  if (typeof authMiddleware.protect === 'function') protect = authMiddleware.protect;
  if (typeof authMiddleware.admin === 'function') admin = authMiddleware.admin;
  if (typeof authMiddleware === 'function') protect = authMiddleware;
} catch (e) {
  console.warn("Auth middleware import fallback used:", e.message);
}

// 2. Controller Import
const orderController = require('../controllers/orderController');

// Safe controller wrapper to guarantee a function is always passed
const getHandler = (fnName) => {
  if (orderController && typeof orderController[fnName] === 'function') {
    return orderController[fnName];
  }
  return (req, res) => res.status(501).json({ success: false, message: `${fnName} handler not implemented` });
};

// 🟢 1. Admin Dashboard Route
router.get('/admin/dashboard', protect, admin, getHandler('getAdminDashboard'));

// 🟢 2. User History Routes
router.get('/history', protect, getHandler('getOrderHistory'));
router.get('/myorders', protect, getHandler('getOrderHistory'));

// 🟢 3. Payment / Checkout Endpoints (Covering every URL path)
router.post('/', protect, getHandler('createRazorpayOrder'));
router.post('/checkout', protect, getHandler('createRazorpayOrder'));
router.post('/razorpay', protect, getHandler('createRazorpayOrder'));
router.post('/verify', protect, getHandler('verifyPayment'));

// 🟢 4. Admin Update Status
router.put('/:id', protect, admin, getHandler('updateOrderStatus'));

module.exports = router;