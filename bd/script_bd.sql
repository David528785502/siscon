-- ============================================
-- SCRIPT DE BASE DE DATOS - SISTEMA DE PRÉSTAMOS
-- ============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS siscon;
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
-- TABLA: sc_emol_p1 (Trabajadores 276)
-- ============================================
CREATE TABLE IF NOT EXISTS sc_emol_p1 (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo CHAR(8) NOT NULL,
    concepto CHAR(4) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    importe DECIMAL(10,2) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    periodo CHAR(7) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    orden INT(3) NOT NULL,
    anulado INT(1) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    usr_regi VARCHAR(20) NOT NULL,
    red VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sc_emol_p2 (Trabajadores 728)
-- ============================================
CREATE TABLE IF NOT EXISTS sc_emol_p2 (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo CHAR(8) NOT NULL,
    concepto CHAR(4) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    importe DECIMAL(10,2) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    periodo CHAR(7) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    orden INT(3) NOT NULL,
    anulado INT(1) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    usr_regi VARCHAR(20) NOT NULL,
    red VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sc_emol_p3 (Trabajadores CAS)
-- ============================================
CREATE TABLE IF NOT EXISTS sc_emol_p3 (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo CHAR(8) NOT NULL,
    concepto CHAR(4) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    importe DECIMAL(10,2) NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    periodo CHAR(7) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    orden INT(3) NOT NULL,
    anulado INT(1) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    usr_regi VARCHAR(20) NOT NULL,
    red VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: sc_personal
-- ============================================
CREATE TABLE IF NOT EXISTS sc_personal (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo CHAR(8) NOT NULL,
    posicion CHAR(8) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    paterno VARCHAR(50) NULL DEFAULT NULL,
    materno VARCHAR(50) NULL DEFAULT NULL,
    nombre VARCHAR(50) NULL DEFAULT NULL,
    are_nom CHAR(2) NOT NULL,
    division CHAR(4) NOT NULL,
    status INT(1) NOT NULL,
    id_doc CHAR(2) NOT NULL,
    documento CHAR(11) NOT NULL,
    fch_ing DATE NOT NULL,
    grup_prof VARCHAR(8) NULL DEFAULT NULL,
    periodo CHAR(7) NOT NULL,
    act INT(1) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ============================================
-- TABLA: sc_personal_detalle
-- ============================================
CREATE TABLE IF NOT EXISTS sc_personal_detalle (
    id INT(11) NOT NULL AUTO_INCREMENT,
    codigo CHAR(8) NOT NULL, -- 6=276 asistencial, 7=276 administrativo, 2=728 asistencial, 3=728 administrativo, 4=cas asistencial, 5=cas administrativo, 8=practicantes, E=cas covid, F=cas emerg.
    grup_per CHAR(1) NOT NULL,
    are_nom CHAR(2) NOT NULL,
    clave_org CHAR(8) NOT NULL,
    area VARCHAR(60) NOT NULL,
    division CHAR(4) NOT NULL,
    division_pv CHAR(4) NULL DEFAULT NULL,
    funcion CHAR(8) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    id_doc CHAR(2) NOT NULL,
    documento CHAR(11) NOT NULL,
    fch_ing DATE NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    subg_prof INT(1) NOT NULL,
    clas_cont CHAR(2) NOT NULL, -- P8=Nombrado, P9=Contratado, P1=Indeterminado, P2=Fijo, P5=Suplencia, P3=Funcionarios, P4=CAS, P6=P.Profesional, PB=Residente, PA=SERUM
    rh INT(1) NOT NULL,
    fch_nac DATE NOT NULL,
    est_civ INT(1) NOT NULL, -- 0=soltero, 1=Casado, 2=Viudo, 3=Divorciado, 6=Concubino, 7=Conviviente
    afp VARCHAR(10) NOT NULL,
    cuspp CHAR(12) NOT NULL,
    tip_com INT(1) NOT NULL,
    grup_prof VARCHAR(8) NOT NULL,
    sociedad CHAR(4) NOT NULL,
    vacaciones DATE NULL DEFAULT NULL,
    importe DECIMAL(10,2) NULL DEFAULT NULL,
    periodo CHAR(7) NOT NULL,
    anulado INT(1) NOT NULL,
    clave_org_pv CHAR(8) NULL DEFAULT NULL,
    usr_eli VARCHAR(16) NULL DEFAULT NULL,
    fch_eli DATETIME NULL DEFAULT NULL,
    usr_reg VARCHAR(16) NULL DEFAULT NULL,
    fch_reg DATETIME NULL DEFAULT NULL,
    nivel VARCHAR(5) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;