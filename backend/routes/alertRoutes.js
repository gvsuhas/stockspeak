const express = require('express');
const router = express.Router();
const store = require('../config/store');

router.get('/', async (req, res) => {
  try {
    const alerts = await store.getAlerts();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
