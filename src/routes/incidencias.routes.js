const express = require('express');
const router = express.Router();
const incidenciasController = require('../controllers/incidencias.controller');

// Rutas para tipos de incidencia
router.get('/', incidenciasController.getIncidencias);
router.get('/:id', incidenciasController.getIncidenciaById);
router.post('/', incidenciasController.createIncidencia);
router.put('/:id', incidenciasController.updateIncidencia);
router.delete('/:id', incidenciasController.deleteIncidencia);

// Rutas para reportes de incidencia
router.get('/reportes/todos', incidenciasController.getReportesIncidencia);
router.get('/reportes/vehiculo/:vehiculoId', incidenciasController.getReportesByVehiculo);
router.post('/reportes', incidenciasController.createReporteIncidencia);
router.delete('/reportes/:vehiculoId/:incidenciaId', incidenciasController.deleteReporteIncidencia);

module.exports = router;
