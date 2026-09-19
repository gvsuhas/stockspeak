const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const { sampleProducts } = require('../utils/seeder');
const mongoose = require('mongoose');

let inMemoryProducts = sampleProducts.map((p, idx) => ({
  _id: (idx + 1).toString(),
  ...p,
  createdAt: new Date().toISOString()
}));

let inMemoryTransactions = [];

const isMongoReady = () => mongoose.connection.readyState === 1;

const getProducts = async () => {
  if (isMongoReady()) {
    try {
      const prods = await Product.find().sort({ name: 1 });
      if (prods && prods.length > 0) return prods;
    } catch (e) {
      console.error('Mongo getProducts error:', e.message);
    }
  }
  return inMemoryProducts;
};

const createProduct = async (data) => {
  if (isMongoReady()) {
    try {
      return await Product.create(data);
    } catch (e) {
      console.error('Mongo createProduct error:', e.message);
    }
  }
  const newProd = {
    _id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString()
  };
  inMemoryProducts.push(newProd);
  return newProd;
};

const updateProductStock = async (id, delta) => {
  if (isMongoReady()) {
    try {
      const p = await Product.findById(id);
      if (p) {
        p.stockQuantity = Math.max(0, p.stockQuantity + delta);
        await p.save();
        return p;
      }
    } catch (e) {}
  }
  const item = inMemoryProducts.find(p => p._id.toString() === id.toString());
  if (item) {
    item.stockQuantity = Math.max(0, item.stockQuantity + delta);
  }
  return item;
};

const deleteProduct = async (id) => {
  if (isMongoReady()) {
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Product.findByIdAndDelete(id);
        await Alert.deleteMany({ product: id });
        await Transaction.deleteMany({ product: id });
      } else {
        await Product.deleteOne({ _id: id });
      }
    } catch (e) {
      console.error('Mongo deleteProduct error:', e.message);
    }
  }
  inMemoryProducts = inMemoryProducts.filter(p => p._id.toString() !== id.toString());
  return true;
};

const saveTransaction = async (txData) => {
  if (isMongoReady()) {
    try {
      return await Transaction.create(txData);
    } catch (e) {}
  }
  const tx = { _id: Date.now().toString(), ...txData, createdAt: new Date().toISOString() };
  inMemoryTransactions.unshift(tx);
  return tx;
};

const getTransactions = async () => {
  if (isMongoReady()) {
    try {
      return await Transaction.find().sort({ createdAt: -1 });
    } catch (e) {}
  }
  return inMemoryTransactions;
};

const getAlerts = async () => {
  if (isMongoReady()) {
    try {
      return await Alert.find({ isResolved: false });
    } catch (e) {}
  }
  const prods = await getProducts();
  return prods
    .filter(p => p.stockQuantity <= p.minThreshold)
    .map(p => ({
      _id: 'alert_' + p._id,
      productName: p.name,
      alertType: p.stockQuantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
      currentStock: p.stockQuantity,
      minThreshold: p.minThreshold,
      unit: p.unit,
      suggestedReorderQuantity: Math.max(10, p.minThreshold * 2 - p.stockQuantity)
    }));
};

const resetStore = async () => {
  if (isMongoReady()) {
    try {
      await Product.deleteMany({});
      await Transaction.deleteMany({});
      await Alert.deleteMany({});
      await Product.insertMany(sampleProducts);
    } catch (e) {}
  }
  inMemoryProducts = sampleProducts.map((p, idx) => ({
    _id: (idx + 1).toString(),
    ...p,
    createdAt: new Date().toISOString()
  }));
  inMemoryTransactions = [];
};

module.exports = {
  getProducts,
  createProduct,
  updateProductStock,
  deleteProduct,
  saveTransaction,
  getTransactions,
  getAlerts,
  resetStore,
  inMemoryProducts
};
