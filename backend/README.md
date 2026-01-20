# Backend SISCON - Despliegue

## Paso 1: Construir la imagen Docker
```bash
cd backend
docker build -t siscon-backend .
```

## Paso 2: Ejecutar el contenedor
```bash
docker run -d -p 3000:3000 --name siscon-backend siscon-backend
```

## Comandos útiles

```bash
# Ver logs
docker logs siscon-backend

# Detener
docker stop siscon-backend

# Eliminar
docker rm -f siscon-backend
```