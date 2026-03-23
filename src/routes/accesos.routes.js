const express = require('express');
const router = express.Router();
const accesosController = require('../controllers/accesos.controller');

router.get('/', accesosController.getAccesos);
router.get('/fecha', accesosController.getAccesosByFecha);
router.get('/:id', accesosController.getAccesoById);
router.get('/vehiculo/:vehiculoId', accesosController.getAccesosByVehiculo);
router.get('/movimiento/:movimiento', accesosController.getAccesosByMovimiento);
router.post('/', accesosController.createAcceso);
router.post('/entrada', accesosController.registrarEntrada);
router.post('/salida', accesosController.registrarSalida);
router.put('/:id', accesosController.updateAcceso);
router.delete('/:id', accesosController.deleteAcceso);

module.exports = router;
