import express from 'express';
import { login, logout, verifyToken } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);
router.post('/logout', logout);

// Rutas protegidas
router.get('/verify', authenticateToken, verifyToken);

export default router;
