const TeamModel = require('../models/TeamModel');

class TeamService {
  async getAllTeams() {
    try {
      return await TeamModel.getAll();
    } catch (error) {
      throw new Error(`Error al obtener equipos: ${error.message}`);
    }
  }

  async getTeamById(id) {
    try {
      const team = await TeamModel.getById(id);
      if (!team) {
        throw new Error('Equipo no encontrado');
      }
      return team;
    } catch (error) {
      throw new Error(`Error al obtener equipo: ${error.message}`);
    }
  }

  async getTeamsByLeague(ligaId) {
    try {
      return await TeamModel.getByLeague(ligaId);
    } catch (error) {
      throw new Error(`Error al obtener equipos de la liga: ${error.message}`);
    }
  }

  async searchTeams(filters) {
    try {
      return await TeamModel.search(filters);
    } catch (error) {
      throw new Error(`Error al buscar equipos: ${error.message}`);
    }
  }

  async getTeamWithPlayers(id) {
    try {
      const team = await TeamModel.getWithPlayers(id);
      if (!team) {
        throw new Error('Equipo no encontrado');
      }
      return team;
    } catch (error) {
      throw new Error(`Error al obtener equipo con jugadores: ${error.message}`);
    }
  }

  async createTeam(teamData) {
    try {
      if (!teamData.nombre) {
        throw new Error('El nombre del equipo es obligatorio');
      }

      if (!teamData.liga_id) {
        throw new Error('El equipo debe estar asignado a una liga');
      }

      const isUnique = await TeamModel.isNameUnique(teamData.nombre);
      if (!isUnique) {
        throw new Error('Ya existe un equipo con ese nombre');
      }

      const teamId = await TeamModel.create(teamData);
      return await TeamModel.getById(teamId);
    } catch (error) {
      throw new Error(`Error al crear equipo: ${error.message}`);
    }
  }

  async updateTeam(id, teamData) {
    try {
      const existingTeam = await TeamModel.getById(id);
      if (!existingTeam) {
        throw new Error('Equipo no encontrado');
      }

      if (teamData.nombre && teamData.nombre !== existingTeam.nombre) {
        const isUnique = await TeamModel.isNameUnique(teamData.nombre, id);
        if (!isUnique) {
          throw new Error('Ya existe un equipo con ese nombre');
        }
      }

      const updated = await TeamModel.update(id, teamData);
      if (!updated) {
        throw new Error('No se pudo actualizar el equipo');
      }

      return await TeamModel.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar equipo: ${error.message}`);
    }
  }

  async deleteTeam(id) {
    try {
      const team = await TeamModel.getById(id);
      if (!team) {
        throw new Error('Equipo no encontrado');
      }

      const playerCount = await TeamModel.countPlayers(id);
      if (playerCount > 0) {
        throw new Error(`No se puede eliminar el equipo porque tiene ${playerCount} jugador(es) asociado(s)`);
      }

      const deleted = await TeamModel.delete(id);
      if (!deleted) {
        throw new Error('No se pudo eliminar el equipo');
      }

      return { message: 'Equipo eliminado exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar equipo: ${error.message}`);
    }
  }

  async getTeamPlayersByPosition(equipoId, posicion) {
    try {
      const team = await TeamModel.getById(equipoId);
      if (!team) {
        throw new Error('Equipo no encontrado');
      }

      const posicionesValidas = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
      if (!posicionesValidas.includes(posicion)) {
        throw new Error('Posición no válida');
      }

      return await TeamModel.getPlayersByPosition(equipoId, posicion);
    } catch (error) {
      throw new Error(`Error al obtener jugadores por posición: ${error.message}`);
    }
  }
}


module.exports = new TeamService();