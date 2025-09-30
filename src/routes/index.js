const express = require('express');
const weatherRoutes = require('./weatherRoutes');
const alertRoutes = require('./alertRoutes');

const router = express.Router();

// Agrupa as rotas da aplicação
router.use(weatherRoutes);
router.use(alertRoutes);

module.exports = router;
