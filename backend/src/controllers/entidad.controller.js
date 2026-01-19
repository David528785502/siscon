import pool from '../config/database.js';

export const getEntidades = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM entidad WHERE activo = 1 ORDER BY nombre_entidad'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener entidades:', error);
    res.status(500).json({ 
      error: 'Error al obtener entidades',
      details: error.message 
    });
  }
};

export const getEntidadByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM entidad WHERE codigo_entidad = ? AND activo = 1',
      [codigo]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Entidad no encontrada' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al buscar entidad:', error);
    res.status(500).json({ 
      error: 'Error al buscar entidad',
      details: error.message 
    });
  }
};
