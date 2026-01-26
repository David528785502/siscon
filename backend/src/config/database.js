import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectAttributes: {
    _client_name: 'siscon-backend',
    _client_version: '1.0.0'
  }
});

// Verificar conexión
pool.getConnection()
  .then(async connection => {
    console.log('[OK] Conexión a MySQL establecida correctamente');
    await connection.query("SET NAMES 'utf8mb4'");
    await connection.query("SET CHARACTER SET utf8mb4");
    connection.release();
  })
  .catch(err => {
    console.error('[ERROR] Error al conectar a MySQL:', err.message);
  });

export default pool;
