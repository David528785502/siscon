import pool from '../config/database.js';

/**
 * Convierte fecha de formato DD/MM/YYYY a YYYY-MM-DD
 */
const convertirFecha = (fechaStr) => {
  // Formato esperado: DD/M/YYYY o DD/MM/YYYY
  const partes = fechaStr.split('/');
  if (partes.length !== 3) return null;
  
  const dia = partes[0].padStart(2, '0');
  const mes = partes[1].padStart(2, '0');
  const año = partes[2];
  
  return `${año}-${mes}-${dia}`;
};

/**
 * Guarda múltiples solicitudes en la base de datos
 */
export const guardarSolicitudes = async (req, res) => {
  const { solicitudes, codigoEntidad, fechaSolicitud } = req.body;

  if (!solicitudes || !Array.isArray(solicitudes) || solicitudes.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No se recibieron solicitudes para guardar'
    });
  }

  // Convertir fecha al formato MySQL
  const fechaMysql = convertirFecha(fechaSolicitud);
  if (!fechaMysql) {
    return res.status(400).json({
      success: false,
      message: 'Formato de fecha inválido. Se espera DD/MM/YYYY'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const solicitudesGuardadas = [];
    const errores = [];

    for (const solicitud of solicitudes) {
      try {
        // Separar nombre completo en partes
        const nombresParts = solicitud.nombreCompleto.trim().split(/\s+/);
        let paterno = '';
        let materno = '';
        let nombres = '';

        if (nombresParts.length >= 3) {
          paterno = nombresParts[0];
          materno = nombresParts[1];
          nombres = nombresParts.slice(2).join(' ');
        } else if (nombresParts.length === 2) {
          paterno = nombresParts[0];
          nombres = nombresParts[1];
        } else {
          nombres = nombresParts[0];
        }

        // Calcular capacidad (liquidez / 0.40)
        const capacidad = solicitud.liquidez !== null ? solicitud.liquidez / 0.40 : null;

        // Obtener tipo de contrato del trabajador
        const [personal] = await connection.query(
          `SELECT pd.clas_cont 
           FROM sc_personal_detalle pd 
           WHERE pd.codigo = ? 
           LIMIT 1`,
          [solicitud.codigo]
        );

        const tipoContrato = personal.length > 0 ? personal[0].clas_cont : null;

        // Insertar solicitud
        const [result] = await connection.query(
          `INSERT INTO solicitud 
           (codigo, paterno, materno, nombres, monto_solicitado, plazo, cuota, tipo, 
            fecha_solicitud, estado, observacion, liquidez_al_solicitar, 
            capacidad_al_solicitar, tipo_contrato)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            solicitud.codigo,
            paterno,
            materno,
            nombres,
            solicitud.monto,
            solicitud.plazo,
            solicitud.cuota,
            solicitud.tipo,
            fechaMysql,
            solicitud.estado,
            solicitud.observacion || null,
            solicitud.liquidez,
            capacidad,
            tipoContrato
          ]
        );

        solicitudesGuardadas.push({
          id: result.insertId,
          codigo: solicitud.codigo
        });

      } catch (error) {
        // Si es un error de duplicado, registrarlo
        if (error.code === 'ER_DUP_ENTRY') {
          errores.push({
            codigo: solicitud.codigo,
            error: 'Ya existe una solicitud para este trabajador'
          });
        } else {
          throw error; // Re-lanzar otros errores
        }
      }
    }

    await connection.commit();

    return res.json({
      success: true,
      message: `${solicitudesGuardadas.length} solicitudes guardadas correctamente`,
      data: {
        guardadas: solicitudesGuardadas.length,
        errores: errores.length,
        detalleErrores: errores
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error al guardar solicitudes:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al guardar solicitudes',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

/**
 * Obtiene todas las solicitudes de la base de datos
 */
export const obtenerSolicitudes = async (req, res) => {
  try {
    const [solicitudes] = await pool.query(
      `SELECT 
        id,
        codigo,
        CONCAT(paterno, ' ', materno, ' ', nombres) as nombreCompleto,
        monto_solicitado as monto,
        plazo,
        cuota,
        tipo,
        fecha_solicitud as fechaSolicitud,
        estado,
        observacion,
        liquidez_al_solicitar as liquidez,
        capacidad_al_solicitar as capacidad,
        tipo_contrato as tipoContrato
      FROM solicitud
      ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: solicitudes
    });

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener solicitudes',
      error: error.message
    });
  }
};
