const express = require('express');
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @route   POST /api/alerta
 * @desc    Envia um alerta de alagamento para os moradores cadastrados
 * @access  Privado (requer token)
 */
router.post('/alerta', authMiddleware, alertController.sendAlert);

module.exports = router;
