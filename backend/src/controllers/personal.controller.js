import pool from '../config/database.js';

export const getPersonal = async (req, res) => {
  try {
    // Obtener parámetros de filtro
    const { nombre, dni, periodo: periodoParam, pagina = 1, limite = 10 } = req.query;
    
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
      whereConditions.push('nombres LIKE ?');
      queryParams.push(`%${nombre}%`);
    }
    
    if (dni) {
      whereConditions.push('documento LIKE ?');
      queryParams.push(`%${dni}%`);
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    console.log('Backend - WHERE:', whereClause, 'Params:', queryParams);

    // Query de conteo: tabla optimizada
    const countQuery = `
      SELECT COUNT(*) as total
      FROM sc_personal_lista
      ${whereClause}
    `;

    const [[{ total }]] = await pool.query(countQuery, queryParams);
    const totalPaginas = Math.ceil(total / limiteNum);

    console.log('Backend - Total registros:', total, 'Total páginas:', totalPaginas);

    // Query principal: tabla optimizada (sin GROUP BY)
    const dataQuery = `
      SELECT 
        codigo,
        documento,
        nombres AS nombre_completo,
        status,
        fch_ing,
        grup_per
      FROM sc_personal_lista
      ${whereClause}
      ORDER BY nombres
      LIMIT ? OFFSET ?
    `;

    // Ejecutar query
    const [datos] = await pool.query(dataQuery, [...queryParams, limiteNum, offset]);
    
    // Verificar si hay más páginas
    const hayMasPaginas = paginaNum < totalPaginas;
    
    console.log('Registros en página:', datos.length, 'Hay más:', hayMasPaginas);

    res.json({
      success: true,
      data: datos,
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
