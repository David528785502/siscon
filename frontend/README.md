# Frontend SISCON - Despliegue

## Paso 1: Construir la imagen Docker
```bash
cd frontend
docker build -t siscon-frontend .
```

## Paso 2: Ejecutar el contenedor
```bash
docker run -d -p 80:80 --name siscon-frontend siscon-frontend
```

## Configuración

- **Desarrollo**: API en `http://localhost:3000/api`
- **Producción**: API en `/api` (mismo servidor)

## Comandos útiles

```bash
# Ver logs
docker logs siscon-frontend

# Detener
docker stop siscon-frontend

# Eliminar
docker rm -f siscon-frontend
```