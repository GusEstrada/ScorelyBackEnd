const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/PlayerController');

router.get('/buscar', PlayerController.buscar);
router.get('/avanzada', PlayerController.busquedaAvanzada);
router.get('/posicion/:posicion', PlayerController.obtenerPorPosicion);
router.get('/nacionalidad/:nacionalidad', PlayerController.obtenerPorNacionalidad);
router.get('/equipo/:equipo_id', PlayerController.obtenerPorEquipo);

router.get('/', PlayerController.obtenerTodos);
router.get('/:id', PlayerController.obtenerPorId);
router.post('/', PlayerController.crear);
router.put('/:id', PlayerController.actualizar);
router.put('/:id/transferir', PlayerController.transferir);
router.delete('/:id', PlayerController.eliminar);

module.exports = router;