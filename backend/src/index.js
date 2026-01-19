import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import personalRoutes from './routes/personal.routes.js';
import emolumentosRoutes from './routes/emolumentos.routes.js';
import entidadRoutes from './routes/entidad.routes.js';
import liquidezRoutes from './routes/liquidez.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/emolumentos', emolumentosRoutes);
app.use('/api/entidades', entidadRoutes);
app.use('/api/liquidez', liquidezRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend SISCON funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n[SERVER] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[HEALTH] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[AUTH] Auth endpoint: http://localhost:${PORT}/api/auth/login\n`);
});
