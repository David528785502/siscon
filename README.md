# SISCON - Sistema de Gestión de Préstamos EsSalud

Sistema de gestión de préstamos para EsSalud - Seguro Social de Salud del Perú.

## Estructura del Proyecto

```
siscon/
├── backend/          # API REST con Node.js + Express
├── frontend/         # Aplicación Angular
└── bd/              # Scripts de base de datos MySQL
```

## Tecnologías

### Backend
- Node.js 24.x
- Express.js
- MySQL 8.x
- JWT para autenticación
- bcrypt para encriptación

### Frontend
- Angular 20.x
- Tailwind CSS 3.x
- TypeScript
- RxJS

### Base de Datos
- MySQL 8.x

## Instalación

### Backend
```bash
cd backend
npm install
```

Configurar archivo `.env`:
```
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=siscon
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=24h
```

Ejecutar:
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Base de Datos
1. Crear la base de datos ejecutando `bd/script_bd.sql` en MySQL Workbench
2. Insertar datos de prueba con `bd/datos_prueba.sql`

## Uso

1. Iniciar el backend (puerto 3000)
2. Iniciar el frontend (puerto 4200)
3. Acceder a http://localhost:4200
4. Credenciales de prueba: admin / admin123

## Módulos

- **Información**: Consulta de personal, solicitudes, bazar
- **Procesos**: Desembolsos, validación de descuentos, planillas
- **Reportes**: Consolidados de solicitudes
- **Verificaciones**: Descuentos de pensionistas y activos
- **Utilidades**: Gestión de usuarios y módulos

## Licencia

Uso interno EsSalud
