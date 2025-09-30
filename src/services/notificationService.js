const nodemailer = require('nodemailer');
require('dotenv').config();

// Configura o transporter do Nodemailer usando variáveis de ambiente
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envia um e-mail de alerta de alagamento.
 * @param {string[]} recipients - Array de e-mails dos destinatários.
 * @param {string} subject - O assunto do e-mail.
 * @param {string} message - A mensagem de texto do corpo do e-mail.
 * @returns {Promise<void>}
 */
const sendFloodAlert = async (recipients, subject, message) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: recipients.join(', '), // Nodemailer aceita uma string de e-mails separados por vírgula
    subject: subject,
    text: message,
    html: `<p>${message}</p>`, // Pode-se usar HTML para um e-mail mais elaborado
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail de alerta enviado com sucesso:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail de alerta:', error);
    // Repassa o erro para ser tratado no controlador
    throw error;
  }
};

module.exports = { sendFloodAlert };
