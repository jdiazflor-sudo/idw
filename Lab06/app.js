const express = require('express');
const path = require('path');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Middleware global incorporado para parsear JSON
app.use(express.json());

// Servir la página web estática (Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware personalizado de Auditoría (Logger)
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} en ${req.originalUrl} - Estado: ${res.statusCode} - Tiempo: ${duration}ms`);
  });

  next();
});

// Enrutamiento principal de la API REST
app.use('/api/cursos', courseRoutes);

// Middleware global de Manejo de Errores (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Ocurrió un error interno en el servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;