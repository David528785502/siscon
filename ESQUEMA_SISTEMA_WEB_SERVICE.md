# Esquema y Análisis del Sistema Actual (SISCON)

## Contexto y Objetivo
Actualmente el flujo de datos es: **SAP -> Extracción a Excel -> Subida a BD MySQL**. 
Esta base de datos MySQL (alojada en un servidor 10.0.1.98 y accesible vía SSH) es consumida por el backend actual de SISCON.
El objetivo futuro es crear un Web Service que se conecte directamente a SAP, eliminando el paso manual del Excel. Este documento esquematiza la lógica de negocio actual del backend Node.js, para que sirva como base en la construcción del nuevo Web Service SAP.

## 1. Módulo de Personal (Búsqueda y Listado)
**Ruta Actual:** `/api/personal`
**Tabla origen:** `sc_personal_lista`
- **Funcionalidad:** Permite buscar trabajadores por nombre o DNI.
- **Paginación:** Maneja un sistema de páginas y límites (`LIMIT` y `OFFSET`).
- **Periodo por defecto:** Si no se envía un periodo, el sistema calcula automáticamente el **mes anterior** al actual (formato `MM-YYYY`).
- **Datos retornados:** `codigo`, `documento` (DNI), `nombre_completo`, `status`, `fch_ing` (fecha de ingreso), `grup_per` (grupo de personal).

## 2. Módulo de Emolumentos (Ingresos y Descuentos)
**Ruta Actual:** `/api/emolumentos/:codigo`
- **Lógica de tablas por Grupo de Personal (`grup_per`):**
  - **6 (276 Asistencial)** o **7 (276 Administrativo):** `sc_emol_p1`
  - **2 (728 Asistencial)** o **3 (728 Administrativo):** `sc_emol_p2`
  - **4 (CAS Asist.), 5 (CAS Admin.), E (CAS Covid), F (CAS Emerg.):** `sc_emol_p3`
  - **8 (Practicantes):** `sc_emol_p5`
- **Filtros Aplicados:** 
  - `codigo` del trabajador.
  - `periodo` (por defecto el **último mes**).
  - `anulado = 0` y `tipo = 'HABERES'`.
- **Clasificación de Conceptos:**
  - **Ingresos:** Conceptos que inician con el dígito `9`.
  - **Descuentos:** Conceptos que inician con el dígito `8`.
- **Cálculo:** `Total Ingresos - Total Descuentos = Total Neto`.

## 3. Módulo de Liquidez y Capacidad de Endeudamiento
**Ruta Actual:** `/api/liquidez/:codigo`
Este es uno de los módulos más críticos ya que procesa algorítmicamente la viabilidad financiera del trabajador para el **último mes**.

**Clasificación Hardcodeada de Conceptos:**
- **Ingresos Permanentes (al 100%):** 9200, 9201, 9202, 9220, etc.
- **Otros Ingresos (al 50%):** 9260, 9261, 9236, 9237, 9239.
- **Descuentos de Ley:** 8015, 8007, 8008, 8009, etc.
- **Descuentos Judiciales:** 8019, 8020, 8021, 8090, 8091.
- **Descuentos Institucionales:** 8034, 8035, 8039, etc.
- **Descuentos Sindicales:** 8301, 8302, 8303, etc.
- **Descuentos a Terceros:** 8102, 8106, 8107, etc.

**Algoritmo de Capacidad de Endeudamiento:**
1. **Ingreso Base:** `Ingresos Permanentes + (Otros Ingresos * 0.5)`
2. **Ingreso Neto (Ingreso):** `Ingreso Base - Descuentos Ley - Desc. Judiciales - Desc. Institucionales - Desc. Sindicales`
3. **Capacidad 40%:** `Ingreso Neto * 0.40`
4. **Capacidad Endeudamiento 50%:** `(Ingreso Base - Descuentos Ley) * 0.50`
5. **Cálculo Condicional (Capacidad Real):**
   - Si `(Capacidad 40% + Desc. Judiciales + Desc. Sindicales) > Capacidad Endeudamiento 50%`:
     - `Capacidad Real = Capacidad Endeudamiento 50% - Desc. Judiciales - Desc. Sindicales`
   - Sino:
     - `Capacidad Real = Capacidad 40%`
6. **Liquidez Final:** `Capacidad Real - Descuentos a Terceros` (Si es menor a 0, se redondea a 0).

## Requerimientos para el Futuro Web Service SAP
Para que el nuevo Web Service se conecte directo a SAP, debe proveer o mapear los siguientes endpoints (RFCs / OData):
1. **Endpoint de Búsqueda de Personal:** Un servicio SAP que devuelva la información básica del empleado y a qué grupo de nómina pertenece (`grup_per`).
2. **Endpoint de Recibos / Nómina (Último Mes):** Un servicio SAP que exponga los conceptos (rubros/cód. de nómina SAP) de los ingresos y descuentos del mes anterior para un empleado en particular.
3. **Mapeo de Conceptos SAP:** Será fundamental mapear los códigos actuales del sistema (ej. 9200, 8015) a los **Wage Types (Clases de Tratamiento/Rubros)** utilizados en SAP HCM, para poder aplicar los cálculos de liquidez de manera exacta sin romper el modelo actual.
