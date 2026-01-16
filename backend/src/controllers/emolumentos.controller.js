import pool from '../config/database.js';

export const getEmolumentosByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    
    // Calcular periodo del mes anterior
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const periodo = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    // Consultar en las 3 tablas de emolumentos
    const queryP1 = `
      SELECT concepto, descripcion, importe
      FROM sc_emol_p1
      WHERE codigo = ? AND periodo = ? AND anulado = 0
      ORDER BY orden
    `;

    const queryP2 = `
      SELECT concepto, descripcion, importe
      FROM sc_emol_p2
      WHERE codigo = ? AND periodo = ? AND anulado = 0
      ORDER BY orden
    `;

    const queryP3 = `
      SELECT concepto, descripcion, importe
      FROM sc_emol_p3
      WHERE codigo = ? AND periodo = ? AND anulado = 0
      ORDER BY orden
    `;

    const [rowsP1] = await pool.query(queryP1, [codigo, periodo]);
    const [rowsP2] = await pool.query(queryP2, [codigo, periodo]);
    const [rowsP3] = await pool.query(queryP3, [codigo, periodo]);

    // Combinar resultados
    const allRows = [...rowsP1, ...rowsP2, ...rowsP3];

    // Separar en ingresos y descuentos
    const ingresos = allRows.filter(row => row.concepto.startsWith('9'));
    const descuentos = allRows.filter(row => row.concepto.startsWith('8'));

    // Calcular totales
    const totalIngresos = ingresos.reduce((sum, item) => sum + parseFloat(item.importe), 0);
    const totalDescuentos = descuentos.reduce((sum, item) => sum + parseFloat(item.importe), 0);

    res.json({
      success: true,
      data: {
        ingresos,
        descuentos,
        totalIngresos,
        totalDescuentos,
        totalNeto: totalIngresos - totalDescuentos
      },
      periodo
    });

  } catch (error) {
    console.error('Error al obtener emolumentos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener emolumentos del personal'
    });
  }
};
