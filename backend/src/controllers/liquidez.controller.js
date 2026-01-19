import pool from '../config/database.js';

/**
 * Obtiene el ingreso neto de un trabajador (igual que en consulta personal)
 */
export const calcularLiquidez = async (req, res) => {
  const { codigo } = req.params;

  try {
    // Calcular periodo del mes anterior (igual que en consulta personal: YYYY-MM)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const periodo = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    // Query exacta de consulta personal
    const query = `
      SELECT 
        p.codigo,
        p.nombres AS nombre_completo,
        COALESCE(
          (SELECT 
            SUM(CASE 
              WHEN LEFT(concepto, 1) = '9' THEN importe 
              WHEN LEFT(concepto, 1) = '8' THEN -importe 
              ELSE 0 
            END)
           FROM sc_emol_p1 
           WHERE codigo = p.codigo 
             AND periodo = ?
             AND anulado = 0),
          (SELECT 
            SUM(CASE 
              WHEN LEFT(concepto, 1) = '9' THEN importe 
              WHEN LEFT(concepto, 1) = '8' THEN -importe 
              ELSE 0 
            END)
           FROM sc_emol_p2 
           WHERE codigo = p.codigo 
             AND periodo = ?
             AND anulado = 0),
          (SELECT 
            SUM(CASE 
              WHEN LEFT(concepto, 1) = '9' THEN importe 
              WHEN LEFT(concepto, 1) = '8' THEN -importe 
              ELSE 0 
            END)
           FROM sc_emol_p3 
           WHERE codigo = p.codigo 
             AND periodo = ?
             AND anulado = 0),
          0
        ) AS ingreso_neto
      FROM sc_personal p
      WHERE p.codigo = ? AND p.act = 1
      LIMIT 1
    `;

    const [rows] = await pool.query(query, [periodo, periodo, periodo, codigo]);

    if (rows.length === 0) {
      return res.json({
        existe: false,
        mensaje: 'Trabajador no registrado en el sistema'
      });
    }

    // MySQL devuelve el valor como string, convertir a número
    const ingresoNeto = parseFloat(rows[0].ingreso_neto) || 0;

    return res.json({
      existe: true,
      codigo: rows[0].codigo,
      nombreCompleto: rows[0].nombre_completo,
      ingresoNeto: parseFloat(ingresoNeto.toFixed(2)),
      periodo
    });

  } catch (error) {
    console.error('Error al obtener datos del trabajador:', error);
    return res.status(500).json({
      existe: false,
      error: 'Error al obtener datos del trabajador',
      detalle: error.message
    });
  }
};
