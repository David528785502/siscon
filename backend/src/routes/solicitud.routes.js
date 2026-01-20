import express from 'express';
import { guardarSolicitudes, obtenerSolicitudes } from '../controllers/solicitud.controller.js';

const router = express.Router();

// GET /api/solicitudes - Obtener todas las solicitudes
router.get('/', obtenerSolicitudes);

// POST /api/solicitudes - Guardar múltiples solicitudes
router.post('/', guardarSolicitudes);

export default router;
