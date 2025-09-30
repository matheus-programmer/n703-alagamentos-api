const weatherService = require('../services/weatherService');
const Precipitation = require('../models/Precipitation');

exports.getCurrentRain = async (req, res) => {
  try {
    const weatherData = await weatherService.getFortalezaWeather();

    // Extrai e formata os dados relevantes
    const formattedData = {
      cidade: weatherData.name,
      pais: weatherData.sys.country,
      temperatura: weatherData.main.temp,
      sensacao_termica: weatherData.main.feels_like,
      umidade: weatherData.main.humidity,
      descricao_clima: weatherData.weather[0].description,
      // O campo 'rain' pode não existir se não estiver chovendo
      precipitacao_1h_mm: weatherData.rain ? weatherData.rain['1h'] : 0,
      timestamp: new Date(weatherData.dt * 1000),
    };

    // Salva o registro no banco de dados (operação assíncrona, mas não precisa bloquear a resposta)
    const precipitationRecord = new Precipitation(formattedData);
    precipitationRecord.save().catch(err => console.error("Erro ao salvar dados de precipitação:", err));
    
    res.status(200).json(formattedData);

  } catch (error) {
    console.error('Erro no controlador de clima:', error.message);
    if (error.response) {
      // Erro vindo da API externa
      return res.status(error.response.status).json({
        message: 'Falha ao consultar a API de clima.',
        details: error.response.data,
      });
    }
    // Outros erros
    res.status(500).json({ message: 'Erro interno ao processar a requisição de clima.' });
  }
};
