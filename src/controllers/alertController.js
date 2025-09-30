const notificationService = require('../services/notificationService');

exports.sendAlert = async (req, res) => {
  try {
    // A mensagem pode vir do corpo da requisição ou ser padrão
    const message = req.body.message || 'Alerta de risco de alagamento na sua região. Tome as devidas precauções.';
    const subject = req.body.subject || 'ALERTA DE ALAGAMENTO - FORTALEZA';

    // Obtém a lista de e-mails do .env
    const recipients = process.env.ALERT_RECIPIENT_EMAIL.split(',').map(email => email.trim());

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ message: 'Nenhum destinatário configurado para receber alertas.' });
    }

    await notificationService.sendFloodAlert(recipients, subject, message);

    res.status(200).json({ message: `Alerta enviado com sucesso para ${recipients.length} destinatário(s).` });
  
  } catch (error) {
    console.error('Erro no controlador de alerta:', error.message);
    res.status(500).json({ message: 'Falha ao enviar o alerta por e-mail.' });
  }
};
