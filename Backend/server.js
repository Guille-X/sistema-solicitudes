const dotenv = require('dotenv');
dotenv.config(); 

const path = require('path');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const requestRoutes = require('./routes/requestRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();

// ---------- CORS ----------
const normalize = (url) => (url || '').trim().replace(/\/+$/, '');

const allowedOrigins = [
  ...(process.env.FRONTEND_URL || '').split(',').map(normalize),
  'https://nice-beach-056ffe810.5.azurestaticapps.net',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Peticiones sin origen (curl, Postman, health checks) se permiten
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(normalize(origin))) return callback(null, true);
      console.warn('Origen bloqueado por CORS:', origin);
      return callback(null, false); // No lanzar error: evita respuestas 500 sin cabeceras
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());

// ---------- Health check ----------
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Sistema de Solicitudes API' });
});

app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: err.message });
  }
});

// ---------- Rutas ----------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roles', roleRoutes);

// ---------- Manejo de errores global ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

// ---------- Inicio del servidor ----------
const PORT = process.env.PORT || 5000;

// El servidor escucha SIEMPRE, aunque la BD falle, para que CORS y el health check respondan
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

sequelize
  .sync()
  .then(() => console.log('Base de datos sincronizada'))
  .catch((err) => console.error('Error al conectar DB:', err));