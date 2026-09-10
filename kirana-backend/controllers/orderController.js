// kirana-backend/controllers/orderController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
  });
};

// 🟢 1. Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = getRazorpayInstance();

    const options = {
      amount: Math.round(Number(amount || 0) * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Razorpay Order Creation Failed", 
      error: error.message 
    });
  }
};

// 🟢 2. Verify Payment
exports.verifyPayment = async (req, res) => {
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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const newOrder = new Order({
        userId: req.user ? req.user._id : null, 
        items: (cartItems || []).map(item => ({
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
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// 🟢 3. Order History
exports.getOrderHistory = async (req, res) => {
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

// 🟢 4. Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name image_url unit')
      .sort({ createdAt: -1 });

    const safeOrders = orders || [];
    const totalOrdersCount = safeOrders.length;
    const totalRevenue = safeOrders.reduce(
      (acc, item) => acc + (Number(item.totalAmount) || Number(item.totalPrice) || 0), 
      0
    );

    return res.status(200).json({
      success: true,
      orders: safeOrders,
      metrics: {
        totalOrdersCount,
        totalRevenue
      },
      totalOrdersCount,
      totalRevenue
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      orders: [],
      metrics: { totalOrdersCount: 0, totalRevenue: 0 },
      totalOrdersCount: 0,
      totalRevenue: 0
    });
  }
};

// 🟢 5. Update Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.body.status) order.status = req.body.status;
    await order.save();
    return res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};