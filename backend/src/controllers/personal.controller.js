import pool from '../config/database.js';

export const getPersonal = async (req, res) => {
  try {
    // Calcular periodo del mes anterior
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const periodo = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const query = `
      SELECT 
        p.codigo,
        p.documento,
        p.nombres AS nombre_completo,
        pd.cargo,
        pd.area,
        pd.clas_cont,
        p.status,
        p.fch_ing,
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
      LEFT JOIN sc_personal_detalle pd ON p.codigo = pd.codigo
      WHERE p.act = 1
      ORDER BY p.paterno, p.materno, p.nombres
      LIMIT 100
    `;

    const [rows] = await pool.query(query, [periodo, periodo, periodo]);

    res.json({
      success: true,
      data: rows,
      total: rows.length,
      periodo: periodo
    });

  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos del personal'
    });
  }
};
