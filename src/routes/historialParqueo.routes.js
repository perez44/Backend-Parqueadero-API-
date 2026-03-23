const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialParqueo.controller');

router.get('/', historialController.getHistorialParqueo);
router.get('/celda/:celdaId', historialController.getHistorialByCelda);
router.get('/vehiculo/:vehiculoId', historialController.getHistorialByVehiculo);
router.post('/', historialController.createHistorialParqueo);
router.delete('/:celdaId/:vehiculoId', historialController.deleteHistorialParqueo);

module.exports = router;
