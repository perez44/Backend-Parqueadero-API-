# API Parqueadero

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)

API REST para el sistema de gestión de parqueadero (ParkingLot). Este proyecto permite administrar usuarios, vehículos, celdas de estacionamiento, control de accesos, incidencias, restricciones de pico y placa, y más.

## Integrantes

| Nombre | Rol |
|--------|-----|
| **Yesier Perez** | Desarrollador |
| **Jhon Mario Castañeda** | Desarrollador |
| **Alejandro Giraldo** | Desarrollador |

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **mysql2** - Driver de MySQL para Node.js

## Requisitos

- Node.js 18+
- MySQL 8.0+
- Base de datos ParkingLot configurada

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar el archivo `.env` con tus credenciales de base de datos:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=ParkingLot
PORT=3000
```

3. Iniciar el servidor:
```bash
npm start
```

Para desarrollo con hot-reload:
```bash
npm run dev
```

## Links de Localhost (Base URL)

**URL Base:** `http://localhost:3000`

### Enlaces completos para conectar a tu web:

| Recurso | URL Completa |
|---------|--------------|
| API Base | `http://localhost:3000/` |
| Usuarios | `http://localhost:3000/api/usuarios` |
| Vehículos | `http://localhost:3000/api/vehiculos` |
| Celdas | `http://localhost:3000/api/celdas` |
| Accesos | `http://localhost:3000/api/accesos` |
| Incidencias | `http://localhost:3000/api/incidencias` |
| Pico y Placa | `http://localhost:3000/api/pico-placa` |
| Historial Parqueo | `http://localhost:3000/api/historial-parqueo` |
| Perfiles | `http://localhost:3000/api/perfiles` |

### Ejemplo de uso en JavaScript (Frontend):

```javascript
const API_BASE_URL = 'http://localhost:3000/api';

// Ejemplo: Obtener todos los usuarios
fetch(`${API_BASE_URL}/usuarios`)
  .then(response => response.json())
  .then(data => console.log(data));

// Ejemplo: Login de usuario
fetch(`${API_BASE_URL}/usuarios/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo: 'usuario@email.com', contrasena: '1234' })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Endpoints

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear usuario |
| POST | `/api/usuarios/login` | Login de usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

### Vehículos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/vehiculos` | Obtener todos los vehículos |
| GET | `/api/vehiculos/:id` | Obtener vehículo por ID |
| GET | `/api/vehiculos/placa/:placa` | Obtener vehículo por placa |
| GET | `/api/vehiculos/usuario/:usuarioId` | Obtener vehículos de un usuario |
| POST | `/api/vehiculos` | Crear vehículo |
| PUT | `/api/vehiculos/:id` | Actualizar vehículo |
| DELETE | `/api/vehiculos/:id` | Eliminar vehículo |

### Celdas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/celdas` | Obtener todas las celdas |
| GET | `/api/celdas/estadisticas` | Obtener estadísticas de celdas |
| GET | `/api/celdas/:id` | Obtener celda por ID |
| GET | `/api/celdas/tipo/:tipo` | Obtener celdas por tipo (Carro/Moto) |
| GET | `/api/celdas/estado/:estado` | Obtener celdas por estado (Libre/Ocupado) |
| POST | `/api/celdas` | Crear celda |
| PUT | `/api/celdas/:id` | Actualizar celda |
| PATCH | `/api/celdas/:id/estado` | Cambiar estado de celda |
| DELETE | `/api/celdas/:id` | Eliminar celda |

### Accesos/Salidas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/accesos` | Obtener todos los accesos |
| GET | `/api/accesos/:id` | Obtener acceso por ID |
| GET | `/api/accesos/vehiculo/:vehiculoId` | Obtener accesos de un vehículo |
| GET | `/api/accesos/movimiento/:movimiento` | Obtener por tipo (Entrada/Salida) |
| GET | `/api/accesos/fecha?fechaInicio=X&fechaFin=Y` | Filtrar por rango de fechas |
| POST | `/api/accesos` | Crear acceso |
| POST | `/api/accesos/entrada` | Registrar entrada |
| POST | `/api/accesos/salida` | Registrar salida |
| PUT | `/api/accesos/:id` | Actualizar acceso |
| DELETE | `/api/accesos/:id` | Eliminar acceso |

### Incidencias
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/incidencias` | Obtener tipos de incidencia |
| GET | `/api/incidencias/:id` | Obtener incidencia por ID |
| POST | `/api/incidencias` | Crear tipo de incidencia |
| PUT | `/api/incidencias/:id` | Actualizar incidencia |
| DELETE | `/api/incidencias/:id` | Eliminar incidencia |
| GET | `/api/incidencias/reportes/todos` | Obtener todos los reportes |
| GET | `/api/incidencias/reportes/vehiculo/:vehiculoId` | Reportes por vehículo |
| POST | `/api/incidencias/reportes` | Crear reporte |
| DELETE | `/api/incidencias/reportes/:vehiculoId/:incidenciaId` | Eliminar reporte |

### Pico y Placa
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pico-placa` | Obtener todas las reglas |
| GET | `/api/pico-placa/verificar?placa=ABC123&tipo_vehiculo=Carro` | Verificar pico y placa |
| GET | `/api/pico-placa/:id` | Obtener regla por ID |
| GET | `/api/pico-placa/dia/:dia` | Obtener reglas por día |
| GET | `/api/pico-placa/tipo/:tipo` | Obtener reglas por tipo de vehículo |
| POST | `/api/pico-placa` | Crear regla |
| PUT | `/api/pico-placa/:id` | Actualizar regla |
| DELETE | `/api/pico-placa/:id` | Eliminar regla |

### Historial de Parqueo
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/historial-parqueo` | Obtener todo el historial |
| GET | `/api/historial-parqueo/celda/:celdaId` | Historial por celda |
| GET | `/api/historial-parqueo/vehiculo/:vehiculoId` | Historial por vehículo |
| POST | `/api/historial-parqueo` | Crear registro (ocupa celda) |
| DELETE | `/api/historial-parqueo/:celdaId/:vehiculoId` | Eliminar registro (libera celda) |

### Perfiles de Usuario
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/perfiles` | Obtener todos los perfiles |
| GET | `/api/perfiles/:id` | Obtener perfil por ID |
| POST | `/api/perfiles` | Crear perfil |
| PUT | `/api/perfiles/:id` | Actualizar perfil |
| DELETE | `/api/perfiles/:id` | Eliminar perfil |

## Ejemplos de uso

### Crear un vehículo
```bash
curl -X POST http://localhost:3000/api/vehiculos \
  -H "Content-Type: application/json" \
  -d '{"placa": "XYZ789", "color": "azul", "modelo": "2022", "marca": "Honda", "tipo": "Carro", "USUARIO_id_usuario": 1}'
```

### Verificar pico y placa
```bash
curl "http://localhost:3000/api/pico-placa/verificar?placa=ABC123&tipo_vehiculo=Carro"
```

### Registrar entrada de vehículo
```bash
curl -X POST http://localhost:3000/api/accesos/entrada \
  -H "Content-Type: application/json" \
  -d '{"puerta": "Puerta 1", "VEHICULO_id": 1}'
```

## Estructura del Proyecto

```
apiparqueadero/
├── src/
│   ├── index.js              # Punto de entrada de la aplicación
│   ├── config/
│   │   └── database.js       # Configuración de la base de datos
│   ├── controllers/          # Lógica de negocio
│   │   ├── accesos.controller.js
│   │   ├── celdas.controller.js
│   │   ├── historialParqueo.controller.js
│   │   ├── incidencias.controller.js
│   │   ├── perfiles.controller.js
│   │   ├── picoPlaca.controller.js
│   │   ├── usuarios.controller.js
│   │   └── vehiculos.controller.js
│   └── routes/               # Definición de rutas
│       ├── accesos.routes.js
│       ├── celdas.routes.js
│       ├── historialParqueo.routes.js
│       ├── incidencias.routes.js
│       ├── perfiles.routes.js
│       ├── picoPlaca.routes.js
│       ├── usuarios.routes.js
│       └── vehiculos.routes.js
├── .env                      # Variables de entorno (no incluido en repo)
├── package.json
└── README.md
```

## Licencia

Este proyecto fue desarrollado con fines académicos.

---

Desarrollado con Node.js y Express.js
