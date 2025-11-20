const TeamService = require('../services/TeamService');

class TeamController {
  async obtenerTodos(req, res) {
    try {
      const teams = await TeamService.getAllTeams();
      res.json({
        success: true,
        data: teams,
        total: teams.length
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
      const team = await TeamService.getTeamById(req.params.id);
      res.json({
        success: true,
        data: team
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
        ciudad: req.query.ciudad,
        liga_id: req.query.liga_id
      };
      const teams = await TeamService.searchTeams(filters);
      res.json({
        success: true,
        data: teams,
        total: teams.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorLiga(req, res) {
    try {
      const teams = await TeamService.getTeamsByLeague(req.params.liga_id);
      res.json({
        success: true,
        data: teams,
        total: teams.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerConJugadores(req, res) {
    try {
      const team = await TeamService.getTeamWithPlayers(req.params.id);
      res.json({
        success: true,
        data: team
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
      const newTeam = await TeamService.createTeam(req.body);
      res.status(201).json({
        success: true,
        message: 'Equipo creado exitosamente',
        data: newTeam
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
      const updatedTeam = await TeamService.updateTeam(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Equipo actualizado exitosamente',
        data: updatedTeam
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
      const result = await TeamService.deleteTeam(req.params.id);
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

  async obtenerJugadoresPorPosicion(req, res) {
    try {
      const jugadores = await TeamService.getTeamPlayersByPosition(
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


module.exports = new TeamController();