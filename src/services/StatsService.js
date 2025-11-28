const StatsModel = require('../models/StatsModel');
const PlayerModel = require('../models/PlayerModel');

class StatsService {
  async getPlayerStats(jugadorId) {
    try {
      const player = await PlayerModel.getById(jugadorId);
      if (!player) {
        throw new Error('Jugador no encontrado');
      }
      return await StatsModel.getByPlayer(jugadorId);
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  async getPlayerStatsBySeason(jugadorId, temporada) {
    try {
      const player = await StatsModel.getById(jugadorId);
      if (!player) {
        throw new Error('Jugador no encontrado');
      }
      const stats = await StatsModel.getByPlayerAndSeason(jugadorId, temporada);
      if (!stats) {
        throw new Error(`No se encontraron estadísticas para la temporada ${temporada}`);
      }
      return stats;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  async getTeamStats(equipoId) {
    try {
      return await StatsModel.getByTeam(equipoId);
    } catch (error) {
      throw new Error(`Error al obtener estadísticas del equipo: ${error.message}`);
    }
  }

  async getTeamStatsBySeason(equipoId, temporada) {
    try {
      return await StatsModel.getByTeamAndSeason(equipoId, temporada);
    } catch (error) {
      throw new Error(`Error al obtener estadísticas del equipo: ${error.message}`);
    }
  }

  async getLeagueStats(ligaId, temporada) {
    try {
      return await StatsModel.getByLeagueAndSeason(ligaId, temporada);
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de la liga: ${error.message}`);
    }
  }

  async getTopScorers(ligaId, temporada, limit = 10) {
    try {
      return await StatsModel.getTopScorers(ligaId, temporada, limit);
    } catch (error) {
      throw new Error(`Error al obtener ranking de goleadores: ${error.message}`);
    }
  }

  async getTopAssisters(ligaId, temporada, limit = 10) {
    try {
      return await StatsModel.getTopAssisters(ligaId, temporada, limit);
    } catch (error) {
      throw new Error(`Error al obtener ranking de asistencias: ${error.message}`);
    }
  }

  async createStats(estadisticaData) {
    try {
      if (!estadisticaData.jugador_id || !estadisticaData.liga_id || !estadisticaData.temporada) {
        throw new Error('jugador_id, liga_id y temporada son obligatorios');
      }

      const player = await PlayerModel.getById(estadisticaData.jugador_id);
      if (!player) {
        throw new Error('El jugador especificado no existe');
      }

      const existing = await EstadisticaModel.exists(
        estadisticaData.jugador_id,
        estadisticaData.liga_id,
        estadisticaData.temporada
      );

      if (existing) {
        throw new Error('Ya existen estadísticas para este jugador en esta liga y temporada');
      }

      const estadisticaId = await EstadisticaModel.create(estadisticaData);
      return await EstadisticaModel.getById(estadisticaId);
    } catch (error) {
      throw new Error(`Error al crear estadísticas: ${error.message}`);
    }
  }

  async updateStats(id, estadisticaData) {
    try {
      const existing = await EstadisticaModel.getById(id);
      if (!existing) {
        throw new Error('Estadística no encontrada');
      }

      const updated = await EstadisticaModel.update(id, estadisticaData);
      if (!updated) {
        throw new Error('No se pudo actualizar la estadística');
      }

      return await EstadisticaModel.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar estadísticas: ${error.message}`);
    }
  }
}

module.exports = new StatsService();