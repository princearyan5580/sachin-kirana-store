// controllers/productController.js
const Product = require('../models/Product');

// @desc    Get products with search, category filter, and price limits
// @route   GET /api/products/search
const searchProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice } = req.query;
    
    // Empty query object banayein
    let query = {};

    // 1. GLOBAL SEARCH LOGIC (Name ya Category dono me se kahi bhi keyword match ho)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },      // 'i' means case-insensitive (e.g., 'rice' or 'Rice' matches both)
        { category: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 2. CATEGORY FILTER (Agar specifically category filter side-menu se select ho)
    if (category) {
      query.category = category;
    }

    // 3. PRICE RANGE FILTER (Budget tracking ke liye)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice); // $gte = Greater Than or Equal To
      if (maxPrice) query.price.$lte = Number(maxPrice); // $lte = Less Than or Equal To
    }

    // Database query execute karein aur response bhejein
    const filteredProducts = await Product.find(query);
    
    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search Query Failed!',
      error: error.message
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, category, price, image_url, stock, unit } = req.body;
    const product = new Product({
      name,
      category,
      price,
      image_url: image_url || 'https://placehold.co/300x300?text=Groceries',
      stock: stock || 100,
      unit: unit || 'kg'
    });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { searchProducts, addProduct };