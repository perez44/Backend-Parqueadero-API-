const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculos.controller');

router.get('/', vehiculosController.getVehiculos);
router.get('/:id', vehiculosController.getVehiculoById);
router.get('/placa/:placa', vehiculosController.getVehiculoByPlaca);
router.get('/usuario/:usuarioId', vehiculosController.getVehiculosByUsuario);
router.post('/', vehiculosController.createVehiculo);
router.put('/:id', vehiculosController.updateVehiculo);
router.delete('/:id', vehiculosController.deleteVehiculo);

module.exports = router;
