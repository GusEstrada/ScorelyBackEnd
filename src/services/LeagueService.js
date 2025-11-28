const LeagueModel = require('../models/LeagueModel');

class LeagueService {
  async getAllLigas() {
    try {
      return await LeagueModel.getAll();
    } catch (error) {
      throw new Error(`Error al obtener ligas: ${error.message}`);
    }
  }

  async getLigaById(id) {
    try {
      const liga = await LeagueModel.getById(id);
      if (!liga) {
        throw new Error('Liga no encontrada');
      }
      return liga;
    } catch (error) {
      throw new Error(`Error al obtener liga: ${error.message}`);
    }
  }

  async searchLigas(filters) {
    try {
      return await LeagueModel.search(filters);
    } catch (error) {
      throw new Error(`Error al buscar ligas: ${error.message}`);
    }
  }

  async getLigaWithTeams(id) {
    try {
      const liga = await LeagueModel.getWithTeams(id);
      if (!liga) {
        throw new Error('Liga no encontrada');
      }
      return liga;
    } catch (error) {
      throw new Error(`Error al obtener liga con equipos: ${error.message}`);
    }
  }

  async createLiga(ligaData) {
    try {
      if (!ligaData.nombre) {
        throw new Error('El nombre de la liga es obligatorio');
      }

      const isUnique = await LeagueModel.isNameUnique(ligaData.nombre);
      if (!isUnique) {
        throw new Error('Ya existe una liga con ese nombre');
      }

      const ligaId = await LeagueModel.create(ligaData);
      return await LeagueModel.getById(ligaId);
    } catch (error) {
      throw new Error(`Error al crear liga: ${error.message}`);
    }
  }

  async updateLiga(id, ligaData) {
    try {
      const existingLiga = await LeagueModel.getById(id);
      if (!existingLiga) {
        throw new Error('Liga no encontrada');
      }

      if (ligaData.nombre && ligaData.nombre !== existingLiga.nombre) {
        const isUnique = await LeagueModel.isNameUnique(ligaData.nombre, id);
        if (!isUnique) {
          throw new Error('Ya existe una liga con ese nombre');
        }
      }

      const updated = await LeagueModel.update(id, ligaData);
      if (!updated) {
        throw new Error('No se pudo actualizar la liga');
      }

      return await LeagueModel.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar liga: ${error.message}`);
    }
  }

  async deleteLiga(id) {
    try {
      const liga = await LeagueModel.getById(id);
      if (!liga) {
        throw new Error('Liga no encontrada');
      }

      const teamCount = await LeagueModel.countTeams(id);
      if (teamCount > 0) {
        throw new Error(`No se puede eliminar la liga porque tiene ${teamCount} equipo(s) asociado(s)`);
      }

      const deleted = await LeagueModel.delete(id);
      if (!deleted) {
        throw new Error('No se pudo eliminar la liga');
      }

      return { message: 'Liga eliminada exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar liga: ${error.message}`);
    }
  }

  async getLigaPlayers(ligaId) {
    try {
      const liga = await LeagueModel.getById(ligaId);
      if (!liga) {
        throw new Error('Liga no encontrada');
      }
      return await LeagueModel.getPlayers(ligaId);
    } catch (error) {
      throw new Error(`Error al obtener jugadores de la liga: ${error.message}`);
    }
  }

  async getLigaPlayersByPosition(ligaId, posicion) {
    try {
      const liga = await LeagueModel.getById(ligaId);
      if (!liga) {
        throw new Error('Liga no encontrada');
      }

      const posicionesValidas = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
      if (!posicionesValidas.includes(posicion)) {
        throw new Error('Posición no válida');
      }

      return await LeagueModel.getPlayersByPosition(ligaId, posicion);
    } catch (error) {
      throw new Error(`Error al obtener jugadores por posición: ${error.message}`);
    }
  }
}


module.exports = new LeagueService();