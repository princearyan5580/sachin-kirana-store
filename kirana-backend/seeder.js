// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // Sahi relative path check kar lein

// Environment variables configure karein
dotenv.config();

// Aapke HTML file se fetch kiya gaya complete structured data arrays[cite: 1]
const productsData = [
  // === Rice Category ===
  { name: 'Parboiled Rice', category: 'Rice', price: 60, image_url: 'pictures/parboiled rice.jpeg' },
  { name: 'Boiled Rice', category: 'Rice', price: 55, image_url: 'pictures/boiled rice.jpeg' },
  { name: 'Raw Rice', category: 'Rice', price: 50, image_url: 'pictures/raw rice.jpeg' },
  { name: 'Basmati Rice', category: 'Rice', price: 125, image_url: 'pictures/basmati rice.jpeg' },

  // === Pulses Category ===
  { name: 'Toor Dal', category: 'Pulses', price: 140, image_url: 'pictures/toor dal.jpg' },
  { name: 'Masoor Dal', category: 'Pulses', price: 110, image_url: 'pictures/masoor dal1.jpeg' },
  { name: 'Chana Dal', category: 'Pulses', price: 90, image_url: 'pictures/chana dal.jpeg' },
  { name: 'Moong Dal', category: 'Pulses', price: 120, image_url: 'pictures/moong dal.jpeg' },

  // === Flours Category ===
  { name: 'Wheat Flour', category: 'Flours', price: 45, image_url: 'pictures/wheat flours.jpeg' },
  { name: 'Gram Flour', category: 'Flours', price: 70, image_url: 'pictures/gram flour.jpeg' },
  { name: 'Sujji', category: 'Flours', price: 50, image_url: 'pictures/sujji.jpg' },
  { name: 'Maida', category: 'Flours', price: 45, image_url: 'pictures/maida.jpeg' },

  // === Spices & Masalas Category ===
  { name: 'Jeera Seeds', category: 'Whole Spices Masalas', price: 350, image_url: 'pictures/jeera.jpeg' },
  { name: 'Elakki & Papper', category: 'Whole Spices Masalas', price: 800, image_url: 'pictures/Elaichi & paper seeds.jpeg' },
  { name: 'Saunf & Ajwain', category: 'Whole Spices Masalas', price: 200, image_url: 'pictures/saunf & ajwain.jpeg' },
  { name: 'Mustard & Methi', category: 'Whole Spices Masalas', price: 120, image_url: 'pictures/mustard & methi.jpg' },
  { name: 'Coriander Seeds', category: 'Whole Spices Masalas', price: 180, image_url: 'pictures/coriander seeds.jpeg' },
  { name: 'Ellu (Til)', category: 'Whole Spices Masalas', price: 240, image_url: 'pictures/til.jpeg' },
  { name: 'Lavanga', category: 'Whole Spices Masalas', price: 900, image_url: 'pictures/lavanga.jpeg' },
  { name: 'Dalcinni', category: 'Whole Spices Masalas', price: 300, image_url: 'pictures/cinnamon & star anise.jpeg' },
  { name: 'Dry Red Chilli', category: 'Whole Spices Masalas', price: 280, image_url: 'pictures/red chilli.png' },

  // === Vegetables Category ===
  { name: 'Potato', category: 'Vegetables', price: 30, image_url: 'pictures/potato.jpg' },
  { name: 'Onion', category: 'Vegetables', price: 40, image_url: 'pictures/onion.jpg' },
  { name: 'Garlic', category: 'Vegetables', price: 180, image_url: 'pictures/garlic.jpeg' },

  // === Oil & Ghee Category ===
  { name: 'Palmolein Oil', category: 'Oil', price: 110, image_url: 'pictures/palmolein oil.jpeg' },
  { name: 'Mustard Oil', category: 'Oil', price: 160, image_url: 'pictures/mustard oil.jpeg' },
  { name: 'Soyabean Oil', category: 'Oil', price: 140, image_url: 'pictures/soyabean oil.jpeg' },
  { name: 'Blended Oil', category: 'Oil', price: 130, image_url: 'pictures/blended oil.jpeg' },
  { name: 'Sudha Cow Ghee', category: 'Ghee', price: 630, image_url: 'pictures/sudha ghee.jpeg' },
  { name: 'Amul Pure Ghee', category: 'Ghee', price: 670, image_url: 'pictures/amul pure ghee.jpeg' },
  { name: 'Amul Cow Ghee', category: 'Ghee', price: 650, image_url: 'pictures/amul cow ghee.jpeg' },
  { name: 'Patanjali Cow Ghee', category: 'Ghee', price: 640, image_url: 'pictures/patanjali cow ghee.jpeg' },

  // Tea, Coffee, Milk Drink Mixes
  { name: 'Tea', category: 'Tea Coffee Milk Drink Mixes', price: 290, image_url: 'pictures/tea.jpeg' },
  { name: 'Coffee', category: 'Tea Coffee Milk Drink Mixes', price: 450, image_url: 'pictures/coffee.jpeg' },
  { name: 'Bornvita', category: 'Tea Coffee Milk Drink Mixes', price: 480, image_url: 'pictures/milk drink.jpeg' },
  { name: 'Horlicks', category: 'Tea Coffee Milk Drink Mixes', price: 460, image_url: 'pictures/milk drink.jpeg' },
  
  // === Ice Cream Milk Products ===
  { name: 'Ice Cream', category: 'Ice Cream Milk Products', price: 30, image_url: 'pictures/ice cream3.jpg' },
  { name: 'Amul Butter', category: 'Ice Cream Milk Products', price: 65, image_url: 'pictures/amul butter.jpg' },
  { name: 'Lassi', category: 'Ice Cream Milk Products', price: 15, image_url: 'pictures/lassi.jpg' },
  { name: 'Milk', category: 'Ice Cream Milk Products', price: 28, image_url: 'pictures/milk3.jpeg' },

  // === Beverages Dairy === 
  { name: 'Soft Drinks', category: 'Beverages Dairy', price: 40, image_url: 'pictures/soft drinks.jpeg' },
  { name: 'Fruit Drinks', category: 'Beverages Dairy', price: 50, image_url: 'pictures/fruit drinks.jpeg' },
  { name: 'Energy Drinks', category: 'Beverages Dairy', price: 70, image_url: 'pictures/energy drinks.jpg' },
  { name: 'Amul Kool', category: 'Beverages Dairy', price: 25, image_url: 'pictures/dairy drinks.jpeg' },
  
  // === Sweets ===
  { name: 'Gulab Jamun', category: 'Sweets', price: 150, image_url: 'pictures/gulab-jamun.jpg' },
  { name: 'Rassogulla', category: 'Sweets', price: 140, image_url: 'pictures/rasogulla.jpeg' },
  { name: 'Peda', category: 'Sweets', price: 90, image_url: 'pictures/peda.jpeg' },
  { name: 'Soan Papdi', category: 'Sweets', price: 120, image_url: 'pictures/soan papdi.jpeg' },

  // === Dry Fruits === 
  { name: 'Makhana(Foxnuts)', category: 'Dry Fruits', price: 350, image_url: 'pictures/makhana.jpeg' },
  { name: 'Cashews', category: 'Dry Fruits', price: 800, image_url: 'pictures/cashews2.jpeg' },
  { name: 'Badam', category: 'Dry Fruits', price: 750, image_url: 'pictures/badam.jpeg' },
  { name: 'Pista', category: 'Dry Fruits', price: 900, image_url: 'pictures/pista2.jpeg' },
  { name: 'Dates', category: 'Dry Fruits', price: 3000, image_url: 'pictures/dates.jpeg' },
  { name: 'Dry Dates', category: 'Dry Fruits', price: 600, image_url: 'pictures/dry dates.jpeg' },
  { name: 'Dry Grapes', category: 'Dry Fruits', price: 600, image_url: 'pictures/dry grapes.jpeg' },
  { name: 'Walnuts', category: 'Dry Fruits', price: 650, image_url: 'pictures/walnut.jpeg' },

  // === Biscuit Chocolates Snacks
  { name: 'Biscuits', category: 'Biscuit Chocolates Snacks', price: 45, image_url: 'pictures/biscuts.jpg' },
  { name: 'Chocolates', category: 'Biscuit Chocolates Snacks', price: 90, image_url: 'pictures/chocolate.jpg' },
  { name: 'Cakes', category: 'Biscuit Chocolates Snacks', price: 30, image_url: 'pictures/cakes.jpeg' },
  { name: 'Snakes', category: 'Biscuit Chocolates Snacks', price: 90, image_url: 'pictures/snaks.jpeg' },
  { name: 'Namkeen', category: 'Biscuit Chocolates Snacks', price: 90, image_url: 'pictures/namkeen.jpeg' },
  
  // === Personal Care === 
  { name: 'Body Sops', category: 'Personal Care', price: 45, image_url: 'pictures/soap.jpeg' },
  { name: 'Toothpaste', category: 'Hair Oral Care', price: 85, image_url: 'pictures/toothpaste.jpeg' },
  
  // === Home Care === 
  { name: 'Detergent Powder', category: 'Home Care', price: 110, image_url: 'pictures/detergent2.jpeg' }
];

const seedProducts = async () => {
  try {
    // 1. Database connection verify karein
    console.log('Connecting to MongoDB standard instance...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully! 🔗');

    // 2. Data duplicate hone se bachane ke liye purana empty karein
    console.log('Cleaning existing collection database logs...');
    await Product.deleteMany();

    // 3. Bulk Insert execution perform karein
    console.log(`Injecting ${productsData.length} records into Products collection...`);
    await Product.insertMany(productsData);

    console.log('🎉 Boom! Complete dynamic inventory loaded into MongoDB smoothly.');
    process.exit(0); // Success exit
  } catch (error) {
    console.error(`❌ Data Import Process Crashed: ${error.message}`);
    process.exit(1); // Failure exit
  }
};

seedProducts();