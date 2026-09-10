// kirana-backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

// Middleware safely import
let protect = (req, res, next) => next();
let admin = (req, res, next) => next();
try {
  const auth = require('../middleware/authMiddleware');
  if (typeof auth.protect === 'function') protect = auth.protect;
  if (typeof auth.admin === 'function') admin = auth.admin;
} catch (e) {}

// Admin Dashboard
router.get('/admin/dashboard', protect, admin, (req, res) => controller.getAdminDashboard(req, res));

// User History
router.get('/history', protect, (req, res) => controller.getOrderHistory(req, res));
router.get('/myorders', protect, (req, res) => controller.getOrderHistory(req, res));

// Payment Endpoints
router.post('/', protect, (req, res) => controller.createRazorpayOrder(req, res));
router.post('/checkout', protect, (req, res) => controller.createRazorpayOrder(req, res));
router.post('/razorpay', protect, (req, res) => controller.createRazorpayOrder(req, res));
router.post('/verify', protect, (req, res) => controller.verifyPayment(req, res));

// Admin Update
router.put('/:id', protect, admin, (req, res) => controller.updateOrderStatus(req, res));

module.exports = router;