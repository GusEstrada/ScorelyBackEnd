const express = require('express');
const router = express.Router();
const LeagueController = require('../controllers/LeagueController');
const StatsController = require('../controllers/StatsController');

router.get('/buscar', LeagueController.buscar);

router.get('/', LeagueController.obtenerTodas);
router.get('/:id', LeagueController.obtenerPorId);
router.get('/:id/equipos', LeagueController.obtenerConEquipos);

router.get('/:id/ranking/goleadores/:temporada', StatsController.obtenerRankingGoleadores);
router.get('/:id/ranking/asistencias/:temporada', StatsController.obtenerRankingAsistencias);
router.get('/:id/estadisticas/:temporada', StatsController.obtenerEstadisticasLiga);

router.get('/:id/jugadores/posicion/:posicion', LeagueController.obtenerJugadoresPorPosicion); 
router.get('/:id/jugadores', LeagueController.obtenerJugadores); 
router.post('/', LeagueController.crear);
router.put('/:id', LeagueController.actualizar);
router.delete('/:id', LeagueController.eliminar);

module.exports = router;