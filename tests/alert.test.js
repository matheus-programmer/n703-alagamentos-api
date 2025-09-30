const request = require('supertest');
const app = require('../src/app');
const notificationService = require('../src/services/notificationService');

// Mock do serviço de notificação
jest.mock('../src/services/notificationService');

describe('POST /api/alerta', () => {
  beforeEach(() => {
    // Limpa mocks antes de cada teste
    notificationService.sendFloodAlert.mockClear();
  });

  it('deve retornar 200 e enviar o alerta com sucesso com token válido', async () => {
    notificationService.sendFloodAlert.mockResolvedValue();

    const response = await request(app)
      .post('/api/alerta')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .send({ message: 'Teste de alerta' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Alerta enviado com sucesso');
    // Verifica se a função de envio foi chamada
    expect(notificationService.sendFloodAlert).toHaveBeenCalledTimes(1);
    expect(notificationService.sendFloodAlert).toHaveBeenCalledWith(
      expect.any(Array), // recipients
      'ALERTA DE ALAGAMENTO - FORTALEZA', // subject
      'Teste de alerta' // message
    );
  });

  it('deve retornar 500 se o serviço de notificação falhar', async () => {
    notificationService.sendFloodAlert.mockRejectedValue(new Error('Falha no SMTP'));

    const response = await request(app)
      .post('/api/alerta')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .send({ message: 'Teste de alerta com falha' });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe('Falha ao enviar o alerta por e-mail.');
  });

  it('deve retornar 401 se nenhum token for fornecido', async () => {
    const response = await request(app).post('/api/alerta');
    expect(response.statusCode).toBe(401);
  });
});
