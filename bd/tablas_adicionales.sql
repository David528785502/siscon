
-- ============================================
-- TABLAS A IMPLEMENTAR
-- ============================================
USE siscon;

-- ============================================
-- TABLA: usuario
-- ============================================
CREATE TABLE IF NOT EXISTS usuario (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(50),
    username VARCHAR(100),
    password_hash VARCHAR(255),
    email VARCHAR(150),
    ultimo_acceso DATE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: entidad
-- ============================================
CREATE TABLE IF NOT EXISTS entidad (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo_entidad VARCHAR(20) NOT NULL,
    nombre_entidad VARCHAR(100) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_codigo_entidad (codigo_entidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: solicitud
-- ============================================
CREATE TABLE IF NOT EXISTS solicitud (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(20) NOT NULL,
    paterno VARCHAR(50) NOT NULL,
    materno VARCHAR(50) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    monto_solicitado DECIMAL(12,2) NOT NULL,
    plazo INT(3) NOT NULL,
    cuota DECIMAL(12,2) NOT NULL,
    tipo TINYINT(1) NOT NULL COMMENT '0=Nuevo, 1=Compra, 2=Ampliación',
    fecha_solicitud DATE NOT NULL,
    estado VARCHAR(20) NOT NULL,
    observacion VARCHAR(200),
    liquidez_al_solicitar DECIMAL(12,2),
    capacidad_al_solicitar DECIMAL(12,2),
    tipo_contrato VARCHAR(50),
    PRIMARY KEY (id),
    UNIQUE KEY uk_codigo_solicitud (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================
-- DATOS DE PRUEBA: entidad (Bancos)
-- ============================================
INSERT INTO entidad (codigo_entidad, nombre_entidad, activo) VALUES
('155', 'Banco de Crédito del Perú', 1),
('161', 'Banco BBVA', 1),
('162', 'Banco Interbank', 1),
('168', 'Scotiabank Perú', 1),
('175', 'Banco Falabella', 1),
('184', 'Banco Pichincha', 1),
('221', 'Banco Ripley', 1),
('160', 'Banco Prueba', 1);

-- ============================================
-- DATOS DE PRUEBA: usuario
-- ============================================
INSERT INTO usuario (codigo, username, password_hash, email, ultimo_acceso) VALUES
('USR001', 'admin', '$2a$12$YsUsDGfWxDelOUyclRJZn.KWZ57Vjav4zquid1HNlUpg/EktG1bNS', 'admin@sistema.com', '2026-01-16');

--usuario: admin
--contraseña1: admin