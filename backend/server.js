const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { seedProducts } = require('./utils/seeder');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));

// Dashboard Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Transaction = require('./models/Transaction');

    const products = await Product.find().catch(() => []);

    const totalProducts = products.length;

    const totalInventoryValue = products.reduce(
      (acc, p) => acc + (p.stockQuantity * p.pricePerUnit),
      0
    );

    const lowStockCount = products.filter(
      p => p.stockQuantity <= p.minThreshold
    ).length;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayTransactions = await Transaction.countDocuments({
      createdAt: { $gte: startOfDay }
    }).catch(() => 0);

    res.json({
      totalProducts,
      totalInventoryValue,
      lowStockCount,
      todayTransactions
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Explicit Re-Seed Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const Alert = require('./models/Alert');
    const Transaction = require('./models/Transaction');

    await Product.deleteMany({}).catch(() => {});
    await Alert.deleteMany({}).catch(() => {});
    await Transaction.deleteMany({}).catch(() => {});

    await seedProducts();

    res.json({
      message:
        'Database reset & seeded with sample Kirana store inventory successfully!'
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Root Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'StockSpeak API is operational',
    timestamp: new Date()
  });
});

// Render provides the PORT environment variable.
// 5000 is used when running locally.
const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
const startServer = async () => {
  try {
    await connectDB();

    await seedProducts();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(
        `StockSpeak Backend Server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();