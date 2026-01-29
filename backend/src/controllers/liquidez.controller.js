import pool from '../config/database.js';

// Clasificación de conceptos (igual que en frontend)
const conceptos = {
  ingresosPermanentes: [
    '9200', '9201', '9202', '9220', '9204', '9205', '9206', '9207', 
    '9208', '9209', '9219', '9244', '9221', '9223', '9214', '9216', 
    '9218', '9234', '9249', '9274'
  ],
  ingresosOtros: ['9260', '9261', '9236', '9237', '9239'],
  descuentosLey: [
    '8015', '8007', '8008', '8009', '8011', '8012', '8019', '8020', 
    '8021', '8022', '8013', '8015', '8016', '8017', '8023', '8025', 
    '8026', '8018', '8032', '8033'
  ],
  descuentosJudiciales: ['8019', '8020', '8021', '8022', '8090', '8091'],
  descuentosInstitucionales: [
    '8034', '8035', '8039', '8040', '8046', '8047', '8058', '8059', 
    '8068', '8069', '8072', '8073', '8074', '8075', '8079', '8080',
    '8081', '8082', '8083', '8085', '8087', '8088', '8090', '8091',
    '8094', '8095', '8096', '8097', '8098', '8101',
    '8206', '8207', '8209', '8210', '8211', '8212', '8215', '8217',
    '8219', '8221', '8223', '8224', '8226', '8228',
    '8229', '8233', '8234', '8237', '8238', '8239', '8243', '8244',
    '8249', '8250', '8260', '8261', '8265', '8274', '8293'
  ],
  descuentosSindicales: [
    '8301', '8302', '8303', '8304', '8305', '8307', '8308', '8309',
    '8310', '8311', '8312', '8313', '8339', '8340', '8342', '8358',
    '8359', '8360', '8361', '8362', '8363', '8364', '8373', '8380',
    '8388', '8389', '8391', '8393', '8394', '8395', '8396', '8397',
    '8398', '8399', '8400', '8401', '8402', '8403', '8404', '8405',
    '8406', '8407', '8440', '8464', '8465', '8473', '8477', '8479',
    '8484', '8487', '8488', '8495'
  ],
  descuentosTerceros: [
    '8102', '8106', '8107', '8108', '8109', '8111', '8112', '8116',
    '8120', '8121', '8123', '8124', '8126', '8128', '8130', '8134',
    '8139', '8141', '8144', '8148', '8150', '8151',
    '8498', '8499', '8500', '8501', '8504', '8505'
  ]
};

/**
 * Calcula la liquidez de un trabajador usando el mismo algoritmo que consulta-personal
 */
export const calcularLiquidez = async (req, res) => {
  const { codigo } = req.params;

  try {
    // 1. Verificar si el trabajador existe
    const queryExiste = `
      SELECT codigo, nombres AS nombre_completo, grup_per
      FROM sc_personal_lista
      WHERE codigo = ?
      LIMIT 1
    `;

    const [trabajador] = await pool.query(queryExiste, [codigo]);

    if (trabajador.length === 0) {
      return res.json({
        existe: false,
        mensaje: 'Trabajador no registrado en el sistema'
      });
    }

    // 2. Determinar tabla de emolumentos según grup_per
    const grupPer = trabajador[0].grup_per;
    let tableName = null;
    if (grupPer === '6' || grupPer === '7') tableName = 'sc_emol_p1';
    else if (grupPer === '2' || grupPer === '3') tableName = 'sc_emol_p2';
    else if (grupPer === '4' || grupPer === '5' || grupPer === 'E' || grupPer === 'F') tableName = 'sc_emol_p3';
    else if (grupPer === '8') tableName = 'sc_emol_p5';

    if (!tableName) {
      return res.json({
        existe: false,
        mensaje: 'Tipo de trabajador no válido para cálculo de liquidez'
      });
    }

    // 3. Calcular periodo del mes anterior
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const periodo = `${String(lastMonth.getMonth() + 1).padStart(2, '0')}-${lastMonth.getFullYear()}`;

    // 4. Obtener todos los emolumentos del periodo
    const queryEmolumentos = `
      SELECT concepto, importe, tipo
      FROM ${tableName}
      WHERE codigo = ? AND periodo = ? AND anulado = 0 AND tipo = 'HABERES'
    `;

    const [emolumentos] = await pool.query(queryEmolumentos, [codigo, periodo]);

    // 5. Clasificar ingresos y descuentos
    const ingresos = emolumentos.filter(e => e.concepto.startsWith('9'));
    const descuentos = emolumentos.filter(e => e.concepto.startsWith('8'));

    // 6. Calcular según algoritmo de consulta-personal
    // Ingresos permanentes al 100%
    const ingresosPermanentes100 = ingresos
      .filter(ing => conceptos.ingresosPermanentes.includes(ing.concepto))
      .reduce((sum, ing) => sum + parseFloat(ing.importe || 0), 0);

    // Ingresos otros al 50%
    const ingresosOtros50 = ingresos
      .filter(ing => conceptos.ingresosOtros.includes(ing.concepto))
      .reduce((sum, ing) => sum + (parseFloat(ing.importe || 0) * 0.5), 0);

    // Total ingresos permanentes
    const ingresosPermanentes = ingresosPermanentes100 + ingresosOtros50;

    // Clasificar descuentos
    const descuentosLey = descuentos
      .filter(desc => conceptos.descuentosLey.includes(desc.concepto))
      .reduce((sum, desc) => sum + parseFloat(desc.importe || 0), 0);

    const descuentosJudiciales = descuentos
      .filter(desc => conceptos.descuentosJudiciales.includes(desc.concepto))
      .reduce((sum, desc) => sum + parseFloat(desc.importe || 0), 0);

    const descuentosInstitucionales = descuentos
      .filter(desc => conceptos.descuentosInstitucionales.includes(desc.concepto))
      .reduce((sum, desc) => sum + parseFloat(desc.importe || 0), 0);

    const descuentosSindicales = descuentos
      .filter(desc => conceptos.descuentosSindicales.includes(desc.concepto))
      .reduce((sum, desc) => sum + parseFloat(desc.importe || 0), 0);

    const descuentosTerceros = descuentos
      .filter(desc => conceptos.descuentosTerceros.includes(desc.concepto))
      .reduce((sum, desc) => sum + parseFloat(desc.importe || 0), 0);

    // Cálculo de Ingreso
    const ingreso = ingresosPermanentes 
      - descuentosLey 
      - descuentosJudiciales 
      - descuentosInstitucionales 
      - descuentosSindicales;

    // Algoritmo de Capacidad de Endeudamiento
    const capacidad40 = ingreso * 0.40;
    const capacidadEndeudamiento50 = (ingresosPermanentes - descuentosLey) * 0.50;
    const variableTemporal = capacidad40 + descuentosJudiciales + descuentosSindicales;

    let capacidad = 0;
    if (variableTemporal > capacidadEndeudamiento50) {
      capacidad = capacidadEndeudamiento50 - descuentosJudiciales - descuentosSindicales;
    } else {
      capacidad = capacidad40;
    }

    // Cálculo de Liquidez
    let liquidez = capacidad - descuentosTerceros;
    if (liquidez < 0) {
      liquidez = 0;
    }

    return res.json({
      existe: true,
      codigo: trabajador[0].codigo,
      nombreCompleto: trabajador[0].nombre_completo,
      liquidez: parseFloat(liquidez.toFixed(2)),
      capacidad: parseFloat(capacidad.toFixed(2)),
      ingreso: parseFloat(ingreso.toFixed(2)),
      periodo
    });

  } catch (error) {
    console.error('Error al calcular liquidez:', error);
    return res.status(500).json({
      existe: false,
      error: 'Error al calcular liquidez del trabajador',
      detalle: error.message
    });
  }
};
