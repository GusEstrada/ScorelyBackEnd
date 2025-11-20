const express = require('express');
const router = express.Router();
const LeagueController = require('../controllers/LeagueController');

router.get('/buscar', LeagueController.buscar);

// Rutas CRUD
router.get('/', LeagueController.obtenerTodas);
router.get('/:id', LeagueController.obtenerPorId);
router.get('/:id/equipos', LeagueController.obtenerConEquipos);
router.get('/:id/jugadores/posicion/:posicion', LeagueController.obtenerJugadoresPorPosicion); 
router.get('/:id/jugadores', LeagueController.obtenerJugadores); 
router.post('/', LeagueController.crear);
router.put('/:id', LeagueController.actualizar);
router.delete('/:id', LeagueController.eliminar);

module.exports = router;