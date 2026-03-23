const express = require('express');
const router = express.Router();
const picoPlacaController = require('../controllers/picoPlaca.controller');

router.get('/', picoPlacaController.getPicoPlaca);
router.get('/verificar', picoPlacaController.verificarPicoPlaca);
router.get('/:id', picoPlacaController.getPicoPlacaById);
router.get('/dia/:dia', picoPlacaController.getPicoPlacaByDia);
router.get('/tipo/:tipo', picoPlacaController.getPicoPlacaByTipo);
router.post('/', picoPlacaController.createPicoPlaca);
router.put('/:id', picoPlacaController.updatePicoPlaca);
router.delete('/:id', picoPlacaController.deletePicoPlaca);

module.exports = router;
