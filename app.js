const express = require('express');
const path = require('path');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} en ${req.originalUrl} - Estado: ${res.statusCode} - Tiempo: ${duration}ms`);
  });

  next();
});

app.use('/api/cursos', courseRoutes);

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
  console.log(`Lab06 API Express y Página Web corriendo en el puerto ${PORT}`);
});

module.exports = app;