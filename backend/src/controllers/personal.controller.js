import pool from '../config/database.js';
import { limpiarTexto } from '../utils/textHelper.js';

export const getPersonal = async (req, res) => {
  try {
    // Obtener parámetros de filtro
    const { nombre, dni, codigo, periodo: periodoParam, pagina = 1, limite = 10 } = req.query;
    
    // Calcular mes anterior como periodo por defecto
    const hoy = new Date();
    let mes = hoy.getMonth(); // 0-11
    let anio = hoy.getFullYear();
    if (mes === 0) {
      mes = 12;
      anio = anio - 1;
    }
    const periodoDefault = `${mes.toString().padStart(2, '0')}-${anio}`;
    const periodo = periodoParam || periodoDefault;
    
    console.log('Backend - Periodo recibido:', periodoParam, '-> Usando:', periodo);
    
    // Paginación
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const offset = (paginaNum - 1) * limiteNum;
    
    console.log('Backend - Página:', paginaNum, 'Límite:', limiteNum, 'Offset:', offset);
    
    // Construir WHERE dinámicamente (SIN periodo, se ignora)
    let whereConditions = [];
    let queryParams = [];
    
    if (nombre) {
      whereConditions.push('p.nombres LIKE ?');
      queryParams.push(`%${nombre}%`);
    }
    
    if (dni) {
      whereConditions.push('p.documento LIKE ?');
      queryParams.push(`%${dni}%`);
    }

    if (codigo) {
      whereConditions.push('p.codigo LIKE ?');
      queryParams.push(`%${codigo}%`);
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    console.log('Backend - WHERE:', whereClause, 'Params:', queryParams);

    // Query de conteo: conteo rápido desde la tabla de lista
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM sc_personal p
      ${whereClause}
    `;

    const [[{ total }]] = await pool.query(countQuery, queryParams);
    const totalPaginas = Math.ceil(total / limiteNum);

    console.log('Backend - Total registros:', total, 'Total páginas:', totalPaginas);

    if (total === 0) {
      return res.json({ success: true, data: [], totalPaginas: 0 });
    }

    // "Deferred Join": Obtener primero los 10 codigos rápidos
    const fastCodigosQuery = `
      SELECT p.id
      FROM sc_personal p
      ${whereClause}
      ORDER BY p.nombres
      LIMIT ? OFFSET ?
    `;
    const [fastRows] = await pool.query(fastCodigosQuery, [...queryParams, limiteNum, offset]);
    
    const idsList = fastRows.map(r => r.id);
    
    if (idsList.length === 0) {
      return res.json({ success: true, data: [], totalPaginas });
    }

    // Query principal: agrupando historial SOLO para los 10 registros extraidos
    const dataQuery = `
      SELECT 
        p.codigo,
        p.posicion,
        p.documento,
        p.nombres AS nombre_completo,
        MAX(p.status) as status,
        MAX(p.fch_ing) as fch_ing,
        MAX(p.id_doc) as id_doc,
        CASE WHEN pd.grup_per IN ('E', 'F') THEN '4' ELSE pd.grup_per END as grup_per
      FROM sc_personal p
      LEFT JOIN sc_personal_detalle pd ON p.codigo = pd.codigo AND DATE(p.fch_ing) = DATE(pd.fch_ing)
      WHERE p.id IN (?)
      GROUP BY p.codigo, p.posicion, p.documento, p.nombres, CASE WHEN pd.grup_per IN ('E', 'F') THEN '4' ELSE pd.grup_per END
      ORDER BY p.nombres, MAX(p.status) DESC
    `;

    // Ejecutar query
    const [dataRows] = await pool.query(dataQuery, [idsList]);
    
    // Limpiar textos antes de enviar
    const datosLimpios = dataRows.map(row => ({
      ...row,
      nombre_completo: limpiarTexto(row.nombre_completo)
    }));
    
    // Verificar si hay más páginas
    const hayMasPaginas = paginaNum < totalPaginas;
    
    console.log('Registros en página:', datosLimpios.length, 'Hay más:', hayMasPaginas);

    res.json({
      success: true,
      data: datosLimpios,
      hayMasPaginas: hayMasPaginas,
      pagina: paginaNum,
      limite: limiteNum,
      totalPaginas: totalPaginas,
      totalRegistros: total,
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
