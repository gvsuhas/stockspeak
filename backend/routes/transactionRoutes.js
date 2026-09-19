const express = require('express');
const router = express.Router();
const store = require('../config/store');

router.get('/', async (req, res) => {
  try {
    const txs = await store.getTransactions();
    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
