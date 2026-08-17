const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Config load karein
dotenv.config();

const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes'); // 👈 1. Auth Routing File Import Ki

// App initialization
const app = express();

// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Body parser json request ke liye[cite: 2]

// Picture Static Folder Mapping
app.use('/pictures', express.static('pictures'));

// Base Route
app.get('/', (req, res) => {
  res.send('Sachin Kirana API is running...');
});

// API Routes Mapping
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes); // 👈 2. Auth Routes ko API Pipeline me Link Kiya

// Server listening listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT} 🔥`);
});