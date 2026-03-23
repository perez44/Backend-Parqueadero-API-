const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const usuariosRoutes = require('./routes/usuarios.routes');
const vehiculosRoutes = require('./routes/vehiculos.routes');
const celdasRoutes = require('./routes/celdas.routes');
const accesosRoutes = require('./routes/accesos.routes');
const incidenciasRoutes = require('./routes/incidencias.routes');
const picoPlacaRoutes = require('./routes/picoPlaca.routes');
const historialParqueoRoutes = require('./routes/historialParqueo.routes');
const perfilesRoutes = require('./routes/perfiles.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API Parqueadero - ParkingLot',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            vehiculos: '/api/vehiculos',
            celdas: '/api/celdas',
            accesos: '/api/accesos',
            incidencias: '/api/incidencias',
            picoPlaca: '/api/pico-placa',
            historialParqueo: '/api/historial-parqueo',
            perfiles: '/api/perfiles'
        }
    });
});

// Rutas de la API
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/celdas', celdasRoutes);
app.use('/api/accesos', accesosRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/pico-placa', picoPlacaRoutes);
app.use('/api/historial-parqueo', historialParqueoRoutes);
app.use('/api/perfiles', perfilesRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚗 API Parqueadero corriendo en http://localhost:${PORT}`);
    console.log(`📚 Documentación disponible en http://localhost:${PORT}`);
});
