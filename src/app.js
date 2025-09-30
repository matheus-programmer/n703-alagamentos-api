const express = require('express');
const connectDB = require('./config/db');
const mainRoutes = require('./routes');

// Carrega as variáveis de ambiente
require('dotenv').config();

// Inicializa o Express
const app = express();

// Conecta ao banco de dados
connectDB();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Middleware de log simples para requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas principais da aplicação
app.use('/api', mainRoutes);

// Middleware para tratamento de rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint não encontrado.' });
});

// Middleware para tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
});

module.exports = app;
