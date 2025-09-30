// Middleware para autenticação via token simples
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  // O formato esperado é "Bearer SEU_TOKEN"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }

  const token = parts[1];

  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }

  next();
};

module.exports = authMiddleware;
