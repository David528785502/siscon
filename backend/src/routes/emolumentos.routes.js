import express from 'express';
import { getEmolumentosByCodigo } from '../controllers/emolumentos.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:codigo', authenticateToken, getEmolumentosByCodigo);

export default router;
