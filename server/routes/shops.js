const express = require('express');
const fetchShops = require('../api/fetchShops');

const router = express.Router();

router.get('/', async (req, res) => {
  const shops = await fetchShops();

  if (!shops) {
    return res.status(500).send('Failed to fetch shops');
  }

  res.json(shops);
});

module.exports = router;
