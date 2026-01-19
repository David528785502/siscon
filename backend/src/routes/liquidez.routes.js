import express from 'express';
import { calcularLiquidez } from '../controllers/liquidez.controller.js';

const router = express.Router();

// GET /api/liquidez/:codigo - Calcular liquidez de un trabajador
router.get('/:codigo', calcularLiquidez);

export default router;
