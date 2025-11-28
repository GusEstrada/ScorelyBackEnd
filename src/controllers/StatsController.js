const StatsService = require('../services/StatsService');

class StatsController {
  async obtenerEstadisticasJugador(req, res) {
    try {
      const stats = await StatsService.getPlayerStats(req.params.id);
      res.json({
        success: true,
        data: stats,
        total: stats.length
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEstadisticasJugadorTemporada(req, res) {
    try {
      const stats = await StatsService.getPlayerStatsBySeason(
        req.params.id,
        req.params.temporada
      );
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEstadisticasEquipo(req, res) {
    try {
      const stats = await StatsService.getTeamStats(req.params.id);
      res.json({
        success: true,
        data: stats,
        total: stats.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEstadisticasEquipoTemporada(req, res) {
    try {
      const stats = await StatsService.getTeamStatsBySeason(
        req.params.id,
        req.params.temporada
      );
      res.json({
        success: true,
        data: stats,
        total: stats.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerEstadisticasLiga(req, res) {
    try {
      const stats = await StatsService.getLeagueStats(
        req.params.id,
        req.params.temporada
      );
      res.json({
        success: true,
        data: stats,
        total: stats.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerRankingGoleadores(req, res) {
    try {
      const limit = req.query.limite || 10;
      const ranking = await StatsService.getTopScorers(
        req.params.id,
        req.params.temporada,
        parseInt(limit)
      );
      res.json({
        success: true,
        data: ranking,
        total: ranking.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerRankingAsistencias(req, res) {
    try {
      const limit = req.query.limite || 10;
      const ranking = await StatsService.getTopAssisters(
        req.params.id,
        req.params.temporada,
        parseInt(limit)
      );
      res.json({
        success: true,
        data: ranking,
        total: ranking.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async crear(req, res) {
    try {
      const newStats = await StatsService.createStats(req.body);
      res.status(201).json({
        success: true,
        message: 'Estadísticas creadas exitosamente',
        data: newStats
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
      const updatedStats = await StatsService.updateStats(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Estadísticas actualizadas exitosamente',
        data: updatedStats
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new StatsController();