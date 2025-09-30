const mongoose = require('mongoose');

const PrecipitationSchema = new mongoose.Schema({
  cidade: {
    type: String,
    required: true,
    default: 'Fortaleza',
  },
  pais: {
    type: String,
    required: true,
    default: 'BR',
  },
  temperatura: {
    type: Number,
  },
  precipitacao_1h_mm: {
    type: Number,
    required: true,
    default: 0,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  registrado_em: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Precipitation', PrecipitationSchema);
