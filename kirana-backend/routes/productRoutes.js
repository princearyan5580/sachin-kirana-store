// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Fetch All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Search Filter public endpoint
router.get('/search', async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    const data = await Product.find(query);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Add New Product (Stop duplication by Name & Price)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, category, price, image_url, stock, unit } = req.body;

    const productExists = await Product.findOne({
      $and: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { price: Number(price) }
      ]
    });

    if (productExists) {
      return res.status(400).json({ success: false, message: "Product pehle se is price par maujood hai!" });
    }

    // Dynamic field custom integration mapping sheet including unit entry
    const product = new Product({ 
      name, 
      category, 
      price: Number(price), 
      image_url, 
      stock: Number(stock),
      unit: unit || 'kg' // Default backup fallback tracking
    });
    
    // Agar schema me strict dynamic options na ho toh ye parameter automatically collection fields me save ho jayega.
    if(!product.unit) { product.set('unit', unit || 'kg', { strict: false }); }

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Edit / Modify Product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, category, price, image_url, stock, unit } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.price = price !== undefined ? Number(price) : product.price;
      product.image_url = image_url || product.image_url;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      
      product.set('unit', unit || 'kg', { strict: false });

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔥 NEW ACTION: Delete Product Entry from Inventory Database Collection
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ success: true, message: "Product permanently removed from catalog ledger!" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;