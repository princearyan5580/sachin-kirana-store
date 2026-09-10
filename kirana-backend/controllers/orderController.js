// kirana-backend/controllers/orderController.js -> getAdminDashboard function

const getAdminDashboard = async (req, res) => {
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

    const metricsData = {
      totalOrdersCount,
      totalRevenue
    };

    return res.status(200).json({
      success: true,
      orders: safeOrders,
      metrics: metricsData,      // 👈 Frontend exact ye key expect kar raha hai
      totalRevenue,
      totalOrdersCount
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(200).json({
      success: true,
      orders: [],
      metrics: { totalOrdersCount: 0, totalRevenue: 0 },
      totalRevenue: 0,
      totalOrdersCount: 0
    });
  }
};