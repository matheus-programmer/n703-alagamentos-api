const express = require('express');
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   GET /api/chuva
 * @desc    Retorna a previsão de chuva atual para Fortaleza
 * @access  Privado (requer token)
 */
router.get('/chuva', authMiddleware, weatherController.getCurrentRain);

module.exports = router;
