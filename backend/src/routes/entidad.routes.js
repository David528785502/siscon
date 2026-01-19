import express from 'express';
import { getEntidades, getEntidadByCodigo } from '../controllers/entidad.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getEntidades);
router.get('/codigo/:codigo', authenticateToken, getEntidadByCodigo);

export default router;
