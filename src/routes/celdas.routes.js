const express = require('express');
const router = express.Router();
const celdasController = require('../controllers/celdas.controller');

router.get('/', celdasController.getCeldas);
router.get('/estadisticas', celdasController.getEstadisticasCeldas);
router.get('/:id', celdasController.getCeldaById);
router.get('/tipo/:tipo', celdasController.getCeldasByTipo);
router.get('/estado/:estado', celdasController.getCeldasByEstado);
router.post('/', celdasController.createCelda);
router.put('/:id', celdasController.updateCelda);
router.patch('/:id/estado', celdasController.cambiarEstadoCelda);
router.delete('/:id', celdasController.deleteCelda);

module.exports = router;
