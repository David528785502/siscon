import express from 'express';
import { getPersonal } from '../controllers/personal.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, getPersonal);

export default router; 