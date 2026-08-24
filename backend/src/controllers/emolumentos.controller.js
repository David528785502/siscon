import pool from '../config/database.js';
import { limpiarTexto } from '../utils/textHelper.js';

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
    if (grupPer === '6' || grupPer === '7' || grupPer === '9') {
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
        ORDER BY concepto ASC
      `;
      const [rows] = await pool.query(query, [codigo, periodo]);
      allRows = rows.map(row => ({
        ...row,
        descripcion: limpiarTexto(row.descripcion)
      }));
    }

    // Separar en ingresos y descuentos y aportes patronales
    const ingresos = allRows.filter(row => row.concepto.startsWith('9'));
    const descuentos = allRows.filter(row => row.concepto.startsWith('8'));
    const aportesPatronales = allRows.filter(row => row.concepto.startsWith('7'));

    // Calcular totales
    const totalIngresos = ingresos.reduce((sum, item) => sum + parseFloat(item.importe), 0);
    const totalDescuentos = descuentos.reduce((sum, item) => sum + parseFloat(item.importe), 0);
    const totalAportes = aportesPatronales.reduce((sum, item) => sum + parseFloat(item.importe), 0);

    // Calcular Nominales (Ej. para 276/Pensionistas)
    let boniNominal = 0;
    let remuNominal = 0;
    ingresos.forEach(item => {
      if (item.concepto === '9209') {
        boniNominal += parseFloat(item.importe);
      } else if (['9200', '9201', '9202', '9203', '9204', '9205', '9206', '9207', '9208'].includes(item.concepto)) {
        remuNominal += parseFloat(item.importe);
      }
    });

    // Obtener detalles personales históricos para este periodo específico
    const queryDetalle = `
      SELECT pd.*, a.ccosto, a.codigo_cobol as dep_codigo
      FROM sc_personal_detalle pd
      LEFT JOIN sc_areas a ON pd.clav_org = a.codigo
      WHERE pd.codigo = ? AND pd.periodo = ? AND pd.anulado = 0
      LIMIT 1
    `;
    const [detalleRows] = await pool.query(queryDetalle, [codigo, periodo]);
    let personalDetalle = detalleRows.length > 0 ? detalleRows[0] : null;

    if (personalDetalle && personalDetalle.vacaciones) {
      const year = new Date(personalDetalle.vacaciones).getFullYear();
      if (year === 1899 || year === 1900) {
        personalDetalle.vacaciones = null;
      }
    }

    // Obtener Cuentas
    const queryCuentas = `
      SELECT tipo, banco, cuenta FROM sc_personal_cuentas
      WHERE codigo = ? AND periodo = ?
    `;
    const [cuentasRows] = await pool.query(queryCuentas, [codigo, periodo]);
    const cuentaHaberes = cuentasRows.find(c => c.tipo === 0) || null;
    const cuentaCts = cuentasRows.find(c => c.tipo === 5) || null;

    res.json({
      success: true,
      data: {
        ingresos,
        descuentos,
        aportesPatronales,
        totalIngresos,
        totalDescuentos,
        totalAportes,
        totalNeto: totalIngresos - totalDescuentos,
        boniNominal,
        remuNominal,
        personalDetalle,
        cuentaHaberes,
        cuentaCts
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

export const getHistorialEmolumentos = async (req, res) => {
  try {
    const { codigo } = req.params;
    const { grup_per: grupPer } = req.query;

    const query = `
      WITH all_emol AS (
        SELECT periodo, tipo, concepto, importe, codigo, anulado FROM sc_emol_p1 WHERE codigo = ? AND anulado = 0
        UNION ALL
        SELECT periodo, tipo, concepto, importe, codigo, anulado FROM sc_emol_p2 WHERE codigo = ? AND anulado = 0
        UNION ALL
        SELECT periodo, tipo, concepto, importe, codigo, anulado FROM sc_emol_p3 WHERE codigo = ? AND anulado = 0
        UNION ALL
        SELECT periodo, tipo, concepto, importe, codigo, anulado FROM sc_emol_p5 WHERE codigo = ? AND anulado = 0
      )
      SELECT 
        e.periodo, 
        e.tipo, 
        SUM(CASE WHEN e.concepto LIKE '9%' THEN e.importe ELSE 0 END) as ingresos,
        SUM(CASE WHEN e.concepto LIKE '8%' THEN e.importe ELSE 0 END) as descuentos,
        MAX(CASE 
            WHEN pd.cargo = 'MEDICO' AND pd.grup_prof = 'MGENERAL' THEN 'MEDICO 1' 
            ELSE pd.cargo 
        END) as cargo,
        MAX(CASE 
            WHEN pd.grup_prof = 'MGENERAL' THEN 'P1'
            WHEN pd.grup_prof = 'MGENE' THEN 'P1' 
            ELSE pd.grup_prof 
        END) as nivel,
        MAX(CASE WHEN pd.sociedad = '0200' THEN 'SALUD' ELSE 'AFESSALUD' END) as sociedad_desc,
        MAX(pd.area) as dependencia
      FROM all_emol e
      LEFT JOIN sc_personal_detalle pd ON e.codigo = pd.codigo AND e.periodo = pd.periodo
      GROUP BY e.periodo, e.tipo
      ORDER BY 
        SUBSTRING(e.periodo, 4, 4) DESC, 
        SUBSTRING(e.periodo, 1, 2) DESC,
        e.tipo ASC
    `;
    const [rows] = await pool.query(query, [codigo, codigo, codigo, codigo]);
    
    const historial = rows.map(row => ({
      periodo: row.periodo,
      tipo: row.tipo,
      ingresos: row.ingresos,
      neto: row.ingresos - row.descuentos,
      cargo: row.cargo || '-',
      nivel: row.nivel || '-',
      dependencia: row.dependencia || '-',
      sociedad_desc: row.sociedad_desc || 'AFESSALUD'
    }));

    res.json({ success: true, data: historial });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ success: false, message: 'Error al obtener historial' });
  }
};
