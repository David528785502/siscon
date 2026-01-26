import pool from '../config/database.js';

export const getEmolumentosByCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { periodo: periodoParam, grup_per: grupPer } = req.query;
    
    // Calcular periodo del mes anterior si no se proporciona
    let periodo = periodoParam;
    if (!periodo) {
      const today = new Date();
      let mes = today.getMonth(); // 0-11
      let anio = today.getFullYear();
      if (mes === 0) {
        mes = 12;
        anio = anio - 1;
      }
      periodo = `${mes.toString().padStart(2, '0')}-${anio}`;
    }

    // Determinar qué tabla consultar según grup_per
    // 6=276 asistencial, 7=276 administrativo -> sc_emol_p1
    // 2=728 asistencial, 3=728 administrativo -> sc_emol_p2
    // 4=cas asistencial, 5=cas administrativo, E=cas covid, F=cas emerg -> sc_emol_p3
    // 8=practicantes -> sc_emol_p5
    
    let tableName = null;
    if (grupPer === '6' || grupPer === '7') {
      tableName = 'sc_emol_p1';
    } else if (grupPer === '2' || grupPer === '3') {
      tableName = 'sc_emol_p2';
    } else if (grupPer === '4' || grupPer === '5' || grupPer === 'E' || grupPer === 'F') {
      tableName = 'sc_emol_p3';
    } else if (grupPer === '8') {
      tableName = 'sc_emol_p5';
    }

    let allRows = [];
    
    if (tableName) {
      // Consultar solo la tabla correspondiente
      const query = `
        SELECT concepto, descripcion, importe
        FROM ${tableName}
        WHERE codigo = ? AND periodo = ? AND anulado = 0 AND tipo = 'HABERES'
        ORDER BY orden
      `;
      const [rows] = await pool.query(query, [codigo, periodo]);
      allRows = rows;
    }

    // Separar en ingresos y descuentos (concepto empieza con 9=ingresos, 8=descuentos)
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
