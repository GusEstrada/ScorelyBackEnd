const LeagueService = require('../services/LeagueService');

class LeagueController {
  async obtenerTodas(req, res) {
    try {
      const ligas = await LeagueService.getAllLigas();
      res.json({
        success: true,
        data: ligas,
        total: ligas.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorId(req, res) {
    try {
      const liga = await LeagueService.getLigaById(req.params.id);
      res.json({
        success: true,
        data: liga
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async buscar(req, res) {
    try {
      const filters = {
        nombre: req.query.nombre,
        pais: req.query.pais
      };
      const ligas = await LeagueService.searchLigas(filters);
      res.json({
        success: true,
        data: ligas,
        total: ligas.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerConEquipos(req, res) {
    try {
      const liga = await LeagueService.getLigaWithTeams(req.params.id);
      res.json({
        success: true,
        data: liga
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async crear(req, res) {
    try {
      const newLiga = await LeagueService.createLiga(req.body);
      res.status(201).json({
        success: true,
        message: 'Liga creada exitosamente',
        data: newLiga
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async actualizar(req, res) {
    try {
      const updatedLiga = await LeagueService.updateLiga(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Liga actualizada exitosamente',
        data: updatedLiga
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async eliminar(req, res) {
    try {
      const result = await LeagueService.deleteLiga(req.params.id);
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerJugadores(req, res) {
    try {
      const jugadores = await LeagueService.getLigaPlayers(req.params.id);
      res.json({
        success: true,
        data: jugadores,
        total: jugadores.length
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerJugadoresPorPosicion(req, res) {
    try {
      const jugadores = await LeagueService.getLigaPlayersByPosition(
        req.params.id,
        req.params.posicion
      );
      res.json({
        success: true,
        data: jugadores,
        total: jugadores.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}


module.exports = new LeagueController();