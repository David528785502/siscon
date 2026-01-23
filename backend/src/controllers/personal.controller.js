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

    // Query de conteo: solo un registro por código
    const countQuery = `
      SELECT COUNT(DISTINCT codigo) as total
      FROM sc_personal
      ${whereClause}
    `;

    const [[{ total }]] = await pool.query(countQuery, queryParams);
    const totalPaginas = Math.ceil(total / limiteNum);

    console.log('Backend - Total registros únicos:', total, 'Total páginas:', totalPaginas);

    // Query principal: un registro por código (toma el más reciente por periodo)
    const dataQuery = `
      SELECT 
        codigo,
        documento,
        nombres AS nombre_completo,
        status,
        fch_ing
      FROM sc_personal
      ${whereClause}
      GROUP BY codigo
      ORDER BY nombres
      LIMIT ? OFFSET ?
    `;

    // Traer 1 registro extra para saber si hay más páginas
    const [rows] = await pool.query(dataQuery, [...queryParams, limiteNum + 1, offset]);
    
    // Verificar si hay más páginas
    const hayMasPaginas = rows.length > limiteNum;
    
    // Eliminar el registro extra si existe
    const datos = hayMasPaginas ? rows.slice(0, limiteNum) : rows;
    
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
