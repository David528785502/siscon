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
-- INSERTAR TRABAJADORES EN sc_personal
-- ============================================
INSERT INTO sc_personal (codigo, posicion, nombres, paterno, materno, nombre, are_nom, division, status, id_doc, documento, fch_ing, grup_prof, periodo, act) VALUES
('4086702', 'POS004', 'VIVIANA ROSARIO PACORA BAZALAR', 'PACORA', 'BAZALAR', 'VIVIANA ROSARIO', '01', '0001', 1, '01', '40867020', '2018-03-15', 'GP004', '2025-12', 1),
('3247849', 'POS005', 'GIOVANNA ESTELA GRANDA CARRION', 'GRANDA', 'CARRION', 'GIOVANNA ESTELA', '02', '0002', 1, '01', '32478490', '2019-05-20', 'GP005', '2025-12', 1),
('1672786', 'POS006', 'MERY PILAR VALVERDE ROLDAN', 'VALVERDE', 'ROLDAN', 'MERY PILAR', '03', '0003', 1, '01', '16727860', '2020-01-10', 'GP006', '2025-12', 1),
('1561900', 'POS007', 'IMELDA ROSA SANDOVAL REYES', 'SANDOVAL', 'REYES', 'IMELDA ROSA', '01', '0001', 1, '01', '15619000', '2017-07-12', 'GP007', '2025-12', 1),
('4028171', 'POS008', 'RICARDO ESCALANTE JIBAJA', 'ESCALANTE', 'JIBAJA', 'RICARDO', '02', '0002', 1, '01', '40281710', '2019-09-25', 'GP008', '2025-12', 1),
('4785102', 'POS009', 'LILIANA ROJAS ALVIAR', 'ROJAS', 'ALVIAR', 'LILIANA', '03', '0003', 1, '01', '47851020', '2018-11-18', 'GP009', '2025-12', 1),
('2295498', 'POS010', 'JORGE JESUS MATEO RAMIREZ', 'MATEO', 'RAMIREZ', 'JORGE JESUS', '01', '0001', 1, '01', '22954980', '2016-04-08', 'GP010', '2025-12', 1),
('1224708', 'POS011', 'OLGA ALICIA AQUINO HUAMAN DE CORDOVA', 'AQUINO', 'HUAMAN DE CORDOVA', 'OLGA ALICIA', '02', '0002', 1, '01', '12247080', '2017-02-14', 'GP011', '2025-12', 1);

-- ============================================
-- INSERTAR DETALLES EN sc_personal_detalle
-- ============================================
INSERT INTO sc_personal_detalle (codigo, grup_per, are_nom, clave_org, area, division, division_pv, funcion, cargo, id_doc, documento, fch_ing, direccion, subg_prof, clas_cont, rh, fch_nac, est_civ, afp, cuspp, tip_com, grup_prof, sociedad, vacaciones, importe, periodo, anulado, clave_org_pv, usr_eli, fch_eli, usr_reg, fch_reg, nivel) VALUES
('4086702', '4', '01', 'ORG00004', 'AREA DE ENFERMERIA', '0001', NULL, 'FUN004', 'ENFERMERO(A) CAS', '01', '40867020', '2018-03-15', 'AV. LOS PINOS 234', 1, 'P4', 1, '1988-06-15', 1, 'PRIMA', '408670200001', 1, 'GP004', 'SOC1', NULL, 3200.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N1'),
('3247849', '3', '02', 'ORG00005', 'AREA ADMINISTRATIVA', '0002', NULL, 'FUN005', 'ASISTENTE 728', '01', '32478490', '2019-05-20', 'JR. SAN MARTIN 567', 1, 'P9', 2, '1990-09-22', 1, 'HABITAT', '324784900001', 1, 'GP005', 'SOC1', NULL, 2900.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N2'),
('1672786', '6', '03', 'ORG00006', 'AREA DE LABORATORIO', '0003', NULL, 'FUN006', 'TECNICO 276', '01', '16727860', '2020-01-10', 'AV. UNIVERSITARIA 890', 1, 'P8', 1, '1987-12-10', 0, 'INTEGRA', '167278600001', 1, 'GP006', 'SOC1', '2026-03-20', 2100.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N3'),
('1561900', '6', '01', 'ORG00007', 'AREA DE MEDICINA', '0001', NULL, 'FUN007', 'MEDICO 276', '01', '15619000', '2017-07-12', 'AV. GRAU 123', 1, 'P8', 1, '1980-03-28', 1, 'PROFUTURO', '156190000001', 1, 'GP007', 'SOC1', NULL, 6500.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N1'),
('4028171', '4', '02', 'ORG00008', 'AREA DE FARMACIA', '0002', NULL, 'FUN008', 'QUIMICO FARMACEUTICO CAS', '01', '40281710', '2019-09-25', 'JR. COMERCIO 456', 1, 'P4', 1, '1985-11-05', 1, 'HABITAT', '402817100001', 1, 'GP008', 'SOC1', NULL, 4800.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N2'),
('4785102', '4', '03', 'ORG00009', 'AREA DE NUTRICION', '0003', NULL, 'FUN009', 'NUTRICIONISTA CAS', '01', '47851020', '2018-11-18', 'AV. AREQUIPA 789', 1, 'P4', 2, '1992-07-18', 0, 'PRIMA', '478510200001', 1, 'GP009', 'SOC1', '2026-05-15', 4200.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N3'),
('2295498', '2', '01', 'ORG00010', 'AREA DE CIRUGIA', '0001', NULL, 'FUN010', 'CIRUJANO 728', '01', '22954980', '2016-04-08', 'AV. BRASIL 321', 1, 'P9', 1, '1978-02-25', 1, 'INTEGRA', '229549800001', 1, 'GP010', 'SOC1', NULL, 12000.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N1'),
('1224708', '6', '02', 'ORG00011', 'AREA DE OBSTETRICIA', '0002', NULL, 'FUN011', 'OBSTETRIZ 276', '01', '12247080', '2017-02-14', 'JR. LIMA 654', 1, 'P8', 1, '1983-08-12', 1, 'PROFUTURO', '122470800001', 1, 'GP011', 'SOC1', '2026-04-10', 5200.00, '2025-12', 0, NULL, NULL, NULL, 'admin', '2026-01-19 10:00:00', 'N2');

-- ============================================
-- EMOLUMENTOS - sc_emol_p3 (Trabajadores CAS: 4086702, 4028171, 4785102)
-- ============================================

-- Trabajador: 4086702 - Cuota: 467.00, Monto: 13000.00
-- Liquidez necesaria >= 13000, entonces ingreso_neto >= 32500
INSERT INTO sc_emol_p3 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('4086702', '9200', 'REMUNERACION CAS', 28000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('4086702', '9209', 'BONIFICACION', 5500.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('4086702', '8039', 'RENTA 4TA CATEGORIA', 1000.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- Trabajador: 4028171 - Cuota: 529.00, Monto: 23100.00
-- Liquidez necesaria >= 23100, entonces ingreso_neto >= 57750
INSERT INTO sc_emol_p3 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('4028171', '9200', 'REMUNERACION CAS', 50000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('4028171', '9209', 'BONIFICACION', 9000.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('4028171', '8039', 'RENTA 4TA CATEGORIA', 1250.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- Trabajador: 4785102 - Cuota: 449.00, Monto: 20100.00 (tipo 0 = nueva)
-- Liquidez necesaria >= 20100, entonces ingreso_neto >= 50250
INSERT INTO sc_emol_p3 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('4785102', '9200', 'REMUNERACION CAS', 45000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('4785102', '9209', 'BONIFICACION', 6000.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('4785102', '8039', 'RENTA 4TA CATEGORIA', 750.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- ============================================
-- EMOLUMENTOS - sc_emol_p2 (Trabajadores 728: 3247849, 2295498)
-- ============================================

-- Trabajador: 3247849 - Cuota: 471.00, Monto: 5125.25
-- Liquidez necesaria >= 5125.25, entonces ingreso_neto >= 12813.13
INSERT INTO sc_emol_p2 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('3247849', '9200', 'REMUNERACION BASICA', 11000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('3247849', '9209', 'BONIFICACION FAMILIAR', 2500.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('3247849', '8005', 'AFP', 687.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- Trabajador: 2295498 - Cuota: 1770.00, Monto: 87500.00 (tipo 1 = compra)
-- Liquidez necesaria >= 87500, entonces ingreso_neto >= 218750
INSERT INTO sc_emol_p2 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('2295498', '9200', 'REMUNERACION BASICA', 185000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('2295498', '9209', 'BONIFICACION FAMILIAR', 40000.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('2295498', '8005', 'AFP', 6250.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- ============================================
-- EMOLUMENTOS - sc_emol_p1 (Trabajadores 276: 1672786, 1561900, 1224708)
-- ============================================

-- Trabajador: 1672786 - Cuota: 160.00, Monto: 3000.00
-- Liquidez necesaria >= 3000, entonces ingreso_neto >= 7500
INSERT INTO sc_emol_p1 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('1672786', '9200', 'REMUNERACION BASICA', 6500.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('1672786', '9209', 'BONIFICACION FAMILIAR', 1500.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('1672786', '8005', 'AFP', 500.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- Trabajador: 1561900 - Cuota: 706.00, Monto: 35000.00 (tipo 1 = compra)
-- Liquidez necesaria >= 35000, entonces ingreso_neto >= 87500
INSERT INTO sc_emol_p1 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('1561900', '9200', 'REMUNERACION BASICA', 75000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('1561900', '9209', 'BONIFICACION FAMILIAR', 15000.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('1561900', '8005', 'AFP', 2500.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- Trabajador: 1224708 - Cuota: 559.00, Monto: 27700.00 (tipo 1 = compra)
-- Liquidez necesaria >= 27700, entonces ingreso_neto >= 69250
INSERT INTO sc_emol_p1 (codigo, concepto, descripcion, importe, cantidad, periodo, tipo, orden, anulado, motivo, fecha, usr_regi, red) VALUES
('1224708', '9200', 'REMUNERACION BASICA', 60000.00, 1.00, '2025-12', 'INGRESO', 1, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('1224708', '9209', 'BONIFICACION FAMILIAR', 11000.00, 1.00, '2025-12', 'INGRESO', 2, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01'),
('1224708', '8005', 'AFP', 1750.00, 1.00, '2025-12', 'DESCUENTO', 3, 0, '', '2026-01-19 10:00:00', 'admin', 'RED01');

-- ============================================
-- RESUMEN DE LIQUIDEZ ESPERADA
-- ============================================
-- 4086702: Ingreso neto = 32,500.00, Liquidez = 13,000.00 (APROBADO para 13,000.00)
-- 3247849: Ingreso neto = 12,813.00, Liquidez = 5,125.20 (APROBADO para 5,125.25)
-- 1672786: Ingreso neto = 7,500.00, Liquidez = 3,000.00 (APROBADO para 3,000.00)
-- 1561900: Ingreso neto = 87,500.00, Liquidez = 35,000.00 (APROBADO para 35,000.00)
-- 4028171: Ingreso neto = 57,750.00, Liquidez = 23,100.00 (APROBADO para 23,100.00)
-- 4785102: Ingreso neto = 50,250.00, Liquidez = 20,100.00 (APROBADO para 20,100.00)
-- 2295498: Ingreso neto = 218,750.00, Liquidez = 87,500.00 (APROBADO para 87,500.00)
-- 1224708: Ingreso neto = 69,250.00, Liquidez = 27,700.00 (APROBADO para 27,700.00)

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