const request = require('supertest');
const app = require('../src/app');
const weatherService = require('../src/services/weatherService');

// Mock do serviço de clima para não depender da API externa nos testes
jest.mock('../src/services/weatherService');
// Mock do Mongoose para não depender do banco de dados
jest.mock('../src/models/Precipitation', () => ({
  ...jest.requireActual('../src/models/Precipitation'),
  save: jest.fn().mockResolvedValue(true), // Mock do método save
}));


describe('GET /api/chuva', () => {
  it('deve retornar 200 e os dados do clima com o token válido', async () => {
    const mockWeatherData = {
      name: 'Fortaleza',
      sys: { country: 'BR' },
      main: { temp: 28, feels_like: 30, humidity: 80 },
      weather: [{ description: 'céu limpo' }],
      rain: { '1h': 1.5 },
      dt: Math.floor(Date.now() / 1000),
    };

    weatherService.getFortalezaWeather.mockResolvedValue(mockWeatherData);

    const response = await request(app)
      .get('/api/chuva')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('cidade', 'Fortaleza');
    expect(response.body).toHaveProperty('precipitacao_1h_mm', 1.5);
  });

  it('deve retornar 401 se nenhum token for fornecido', async () => {
    const response = await request(app).get('/api/chuva');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Token de autenticação não fornecido.');
  });

  it('deve retornar 403 se um token inválido for fornecido', async () => {
    const response = await request(app)
      .get('/api/chuva')
      .set('Authorization', 'Bearer tokeninvalido');
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Token inválido ou expirado.');
  });
});
