import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar datos de entrada
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const [users] = await pool.query(
      'SELECT id, codigo, username, password_hash, email FROM usuario WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    // Actualizar último acceso
    await pool.query(
      'UPDATE usuario SET ultimo_acceso = CURDATE() WHERE id = ?',
      [user.id]
    );

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        codigo: user.codigo
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Responder con éxito
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user: {
          id: user.id,
          codigo: user.codigo,
          username: user.username,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const logout = async (req, res) => {
  // En JWT stateless, el logout se maneja en el frontend eliminando el token
  res.json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
};

export const verifyToken = async (req, res) => {
  // Este endpoint verifica si el token es válido
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      user: req.user
    }
  });
};