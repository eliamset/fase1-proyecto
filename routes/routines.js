// routes/routines.js
const express = require('express');
const router = express.Router();

// ejemplo simple
router.get('/', (req, res) => {
  res.json({ message: 'Rutas de rutinas funcionando' });
});

module.exports = router;
