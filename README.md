## Comandos

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f frontend
docker-compose logs -f backend

# Detener todo
docker-compose down

# Reconstruir y reiniciar
docker-compose up -d --build

# Ver estado de los contenedores
docker-compose ps
```

## Arquitectura

- **Frontend**: Nginx (puerto 80) → Redirige `/api` al backend
- **Backend**: Node.js Express (puerto 3000)
- **Base de datos**: MySQL externo (10.0.1.98)
- **Red**: Ambos servicios en la misma red Docker

## Producción

El frontend y backend ya están listos para producción. Solo necesitas:
1. Configurar las variables de entorno correctas
2. Ejecutar `docker-compose up -d`