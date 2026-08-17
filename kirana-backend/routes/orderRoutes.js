// kirana-backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getOrderHistory, getAdminDashboardData } = require('../controllers/orderController'); // 👈 getAdminDashboardData add kiya
const { protect, admin } = require('../middleware/authMiddleware'); // 👈 Security locks import kiye

router.post('/checkout', createRazorpayOrder);
router.post('/verify',protect, verifyPayment);
router.get('/history',protect, getOrderHistory);

// 🔥 Naya ADMIN DASHBOARD route (Sirf Logged-in Admins ke liye secure kiya)
router.get('/admin/dashboard', protect, admin, getAdminDashboardData);

module.exports = router;