const express = require('express');
const router = express.Router();
const store = require('../config/store');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await store.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new product
router.post('/', async (req, res) => {
  try {
    const { name, category, stockQuantity, unit, minThreshold, pricePerUnit, aliases } = req.body;
    
    const aliasList = Array.isArray(aliases) ? aliases : (aliases ? aliases.split(',').map(s => s.trim()) : []);
    const cleanName = name.toLowerCase();
    if (!aliasList.includes(cleanName)) aliasList.push(cleanName);

    const savedProduct = await store.createProduct({
      name,
      category: category || 'General',
      stockQuantity: Number(stockQuantity) || 0,
      unit: unit || 'pieces',
      minThreshold: Number(minThreshold) || 5,
      pricePerUnit: Number(pricePerUnit) || 0,
      aliases: aliasList
    });

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update stock manually (+ / -)
router.patch('/:id/stock', async (req, res) => {
  try {
    const { delta } = req.body;
    const updated = await store.updateProductStock(req.params.id, Number(delta));
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const products = await store.getProducts();
    const idx = products.findIndex(p => p._id === req.params.id);
    if (idx !== -1) products.splice(idx, 1);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
