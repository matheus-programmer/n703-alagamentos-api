const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const LAT = process.env.FORTALEZA_LAT;
const LON = process.env.FORTALEZA_LON;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Busca os dados de clima atuais para Fortaleza na API OpenWeather.
 * @returns {Promise<object>} Os dados da API de clima.
 */
const getFortalezaWeather = async () => {
  if (!API_KEY) {
    throw new Error('A chave da API OpenWeather (OPENWEATHER_API_KEY) não está configurada.');
  }

  const url = `${BASE_URL}?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=pt_br`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados na OpenWeather API:', error.message);
    // Repassa o erro para ser tratado no controlador
    throw error;
  }
};

module.exports = { getFortalezaWeather };
