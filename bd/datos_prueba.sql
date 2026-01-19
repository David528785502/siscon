-- ============================================
-- DATOS DE PRUEBA - SISTEMA DE PRÉSTAMOS
-- ============================================

USE siscon;

-- ============================================
-- LIMPIAR DATOS EXISTENTES
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE sc_emol_p3;
TRUNCATE TABLE sc_emol_p2;
TRUNCATE TABLE sc_emol_p1;
TRUNCATE TABLE sc_personal_detalle;
TRUNCATE TABLE sc_personal;
TRUNCATE TABLE usuario;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- DATOS DE PRUEBA: usuario
-- ============================================
INSERT INTO usuario (codigo, username, password_hash, email, ultimo_acceso) VALUES
('USR001', 'admin', '$2a$12$YsUsDGfWxDelOUyclRJZn.KWZ57Vjav4zquid1HNlUpg/EktG1bNS', 'admin@sistema.com', '2026-01-16');

-- ============================================
-- DATOS DE PRUEBA: sc_personal
-- ============================================
INSERT INTO sc_personal (codigo, posicion, nombres, paterno, materno, nombre, are_nom, division, status, id_doc, documento, fch_ing, grup_prof, periodo, act) VALUES
('2000123', 'POS001', 'JUAN CARLOS PEREZ GOMEZ', 'PEREZ', 'GOMEZ', 'JUAN CARLOS', '01', '0001', 1, '01', '12345678', '2020-01-15', 'GP001', '2026-01', 1),
('3000234', 'POS002', 'MARIA ELENA RODRIGUEZ LOPEZ', 'RODRIGUEZ', 'LOPEZ', 'MARIA ELENA', '02', '0002', 1, '01', '23456789', '2021-03-10', 'GP002', '2026-01', 1),
('4000345', 'POS003', 'CARLOS ALBERTO SANCHEZ DIAZ', 'SANCHEZ', 'DIAZ', 'CARLOS ALBERTO', '03', '0003', 1, '01', '34567890', '2019-06-20', 'GP003', '2026-01', 1);

-- ============================================
-- DATOS DE PRUEBA: sc_personal_detalle
-- ============================================
INSERT INTO sc_personal_detalle (codigo, grup_per, are_nom, clave_org, area, division, division_pv, funcion, cargo, id_doc, documento, fch_ing, direccion, subg_prof, clas_cont, rh, fch_nac, est_civ, afp, cuspp, tip_com, grup_prof, sociedad, vacaciones, importe, periodo, anulado, clave_org_pv, usr_eli, fch_eli, usr_reg, fch_reg, nivel) VALUES
('2000123', '6', '01', 'ORG00001', 'AREA DE ENFERMERIA', '0001', NULL, 'FUN001', 'ENFERMERO(A)', '01', '12345678', '2020-01-15', 'AV. LOS HEROES 123', 1, 'P8', 1, '1990-05-12', 1, 'HABITAT', '123456789012', 1, 'GP001', 'SOC1', NULL, 3500.00, '2026-01', 0, NULL, NULL, NULL, 'admin', '2026-01-16 08:00:00', 'N1'),
('3000234', '7', '02', 'ORG00002', 'AREA ADMINISTRATIVA', '0002', NULL, 'FUN002', 'ASISTENTE ADMINISTRATIVO', '01', '23456789', '2021-03-10', 'JR. LAS FLORES 456', 1, 'P9', 2, '1985-08-25', 1, 'INTEGRA', '234567890123', 1, 'GP002', 'SOC1', NULL, 2800.00, '2026-01', 0, NULL, NULL, NULL, 'admin', '2026-01-16 08:00:00', 'N2'),
('4000345', '2', '03', 'ORG00003', 'AREA DE MEDICINA', '0003', NULL, 'FUN003', 'MEDICO CIRUJANO', '01', '34567890', '2019-06-20', 'AV. PRINCIPAL 789', 1, 'P8', 1, '1982-11-30', 1, 'PROFUTURO', '345678901234', 1, 'GP003', 'SOC1', '2026-02-15', 5500.00, '2026-01', 0, NULL, NULL, NULL, 'admin', '2026-01-16 08:00:00', 'N3');

-- ============================================
-- DATOS DE PRUEBA: sc_emol_p1 (Trabajadores 276)
-- ============================================
INSERT INTO sc_emol_p1 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('2000123', '9200', 'REMUNERACION BASICA', 3000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01'),
('2000123', '9209', 'BONIFICACION FAMILIAR', 500.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01'),
('2000123', '8005', 'AFP', 390.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01');

-- ============================================
-- DATOS DE PRUEBA: sc_emol_p2 (Trabajadores 728)
-- ============================================
INSERT INTO sc_emol_p2 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('3000234', '9200', 'REMUNERACION BASICA', 2500.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01'),
('3000234', '9209', 'BONIFICACION FAMILIAR', 300.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01'),
('3000234', '8005', 'AFP', 325.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01');

-- ============================================
-- DATOS DE PRUEBA: sc_emol_p3 (Trabajadores CAS)
-- ============================================
INSERT INTO sc_emol_p3 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('4000345', '9200', 'REMUNERACION CAS', 5000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01'),
('4000345', '9209', 'BONIFICACION', 500.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01'),
('4000345', '8039', 'RENTA 4TA CATEGORIA', 650.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-16 08:00:00', 'admin', 'RED01');

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