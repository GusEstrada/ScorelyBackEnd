const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/TeamController');
const StatsController = require('../controllers/StatsController');

router.get('/buscar', TeamController.buscar);
router.get('/liga/:liga_id', TeamController.obtenerPorLiga);

router.get('/', TeamController.obtenerTodos);
router.get('/:id', TeamController.obtenerPorId);

router.get('/:id/estadisticas/:temporada', StatsController.obtenerEstadisticasEquipoTemporada);
router.get('/:id/estadisticas', StatsController.obtenerEstadisticasEquipo);

router.get('/:id/jugadores', TeamController.obtenerConJugadores);
router.get('/:id/jugadores', TeamController.obtenerConJugadores);
router.get('/:id/jugadores/posicion/:posicion', TeamController.obtenerJugadoresPorPosicion);
router.post('/', TeamController.crear);
router.put('/:id', TeamController.actualizar);
router.delete('/:id', TeamController.eliminar);

module.exports = router;

