// controllers/orderController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🟢 1. Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100), 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Razorpay Order Creation Failed", error: error.message });
  }
};

// 🟢 2. Verify Razorpay Payment & Place Order
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      cartItems,
      totalAmount 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const newOrder = new Order({
        userId: req.user ? req.user._id : null, 
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount,
        status: 'Completed',
        paymentId: razorpay_payment_id
      });

      await newOrder.save();

      return res.status(200).json({
        success: true,
        message: "Payment Verified & Order Placed Successfully! 🎉",
        orderId: newOrder._id
      });
    } else {
      return res.status(400).json({ success: false, message: "Payment Verification Failed! Signature Mismatch." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// 🟢 3. Logged-in User Order History
const getOrderHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const orders = await Order.find({ userId: req.user._id })
      .populate('userId', 'name email')
      .populate('items.productId', 'name image_url unit') 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch order history", 
      error: error.message 
    });
  }
};

// 🟢 4. Admin Dashboard API (/api/orders/admin/dashboard)
const getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name image_url unit')
      .sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, item) => acc + (Number(item.totalAmount) || 0), 0);

    return res.status(200).json({
      success: true,
      orders,
      totalOrders,
      totalRevenue
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(200).json({
      success: true,
      orders: [],
      totalOrders: 0,
      totalRevenue: 0
    });
  }
};

// 🟢 5. Admin Order Status Update
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.body.status) {
      order.status = req.body.status;
    }

    await order.save();
    return res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { 
  createRazorpayOrder, 
  verifyPayment, 
  getOrderHistory, 
  getAdminDashboard,
  updateOrderStatus
};