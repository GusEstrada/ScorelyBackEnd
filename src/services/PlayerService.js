const PlayerModel = require('../models/PlayerModel');
const TeamModel = require('../models/TeamModel');

class PlayerService {
  async getAllPlayers() {
    try {
      return await PlayerModel.getAll();
    } catch (error) {
      throw new Error(`Error al obtener jugadores: ${error.message}`);
    }
  }

  async getPlayerById(id) {
    try {
      const player = await PlayerModel.getById(id);
      if (!player) {
        throw new Error('Jugador no encontrado');
      }
      return player;
    } catch (error) {
      throw new Error(`Error al obtener jugador: ${error.message}`);
    }
  }

  async getPlayersByTeam(equipoId) {
    try {
      const team = await TeamModel.getById(equipoId);
      if (!team) {
        throw new Error('Equipo no encontrado');
      }
      return await PlayerModel.getByTeam(equipoId);
    } catch (error) {
      throw new Error(`Error al obtener jugadores del equipo: ${error.message}`);
    }
  }

  async searchPlayers(filters) {
    try {
      return await PlayerModel.search(filters);
    } catch (error) {
      throw new Error(`Error al buscar jugadores: ${error.message}`);
    }
  }

  async getPlayersByPosition(posicion) {
    try {
      const posicionesValidas = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
      if (!posicionesValidas.includes(posicion)) {
        throw new Error('Posición no válida');
      }
      return await PlayerModel.getByPosition(posicion);
    } catch (error) {
      throw new Error(`Error al obtener jugadores por posición: ${error.message}`);
    }
  }

  async getPlayersByNationality(nacionalidad) {
    try {
      return await PlayerModel.getByNationality(nacionalidad);
    } catch (error) {
      throw new Error(`Error al obtener jugadores por nacionalidad: ${error.message}`);
    }
  }

  async createPlayer(playerData) {
    try {
      if (!playerData.nombre || !playerData.apellido) {
        throw new Error('Nombre y apellido son obligatorios');
      }

      if (!playerData.equipo_id) {
        throw new Error('El jugador debe estar asignado a un equipo');
      }

      const team = await TeamModel.getById(playerData.equipo_id);
      if (!team) {
        throw new Error('El equipo especificado no existe');
      }

      if (playerData.numero_camiseta) {
        const isAvailable = await PlayerModel.isJerseyNumberAvailable(
          playerData.equipo_id,
          playerData.numero_camiseta
        );
        if (!isAvailable) {
          throw new Error('El número de camiseta ya está en uso en este equipo');
        }
      }

      if (playerData.posicion) {
        const posicionesValidas = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
        if (!posicionesValidas.includes(playerData.posicion)) {
          throw new Error('Posición no válida');
        }
      }

      const playerId = await PlayerModel.create(playerData);
      return await PlayerModel.getById(playerId);
    } catch (error) {
      throw new Error(`Error al crear jugador: ${error.message}`);
    }
  }

  async updatePlayer(id, playerData) {
    try {
      const existingPlayer = await PlayerModel.getById(id);
      if (!existingPlayer) {
        throw new Error('Jugador no encontrado');
      }

      if (playerData.equipo_id && playerData.equipo_id !== existingPlayer.equipo_id) {
        const team = await TeamModel.getById(playerData.equipo_id);
        if (!team) {
          throw new Error('El equipo especificado no existe');
        }
      }

      if (playerData.numero_camiseta) {
        const equipoId = playerData.equipo_id || existingPlayer.equipo_id;
        const isAvailable = await PlayerModel.isJerseyNumberAvailable(
          equipoId,
          playerData.numero_camiseta,
          id
        );
        if (!isAvailable) {
          throw new Error('El número de camiseta ya está en uso en este equipo');
        }
      }

      if (playerData.posicion) {
        const posicionesValidas = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
        if (!posicionesValidas.includes(playerData.posicion)) {
          throw new Error('Posición no válida');
        }
      }

      const updated = await PlayerModel.update(id, playerData);
      if (!updated) {
        throw new Error('No se pudo actualizar el jugador');
      }

      return await PlayerModel.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar jugador: ${error.message}`);
    }
  }

  async transferPlayer(id, nuevoEquipoId) {
    try {
      const player = await PlayerModel.getById(id);
      if (!player) {
        throw new Error('Jugador no encontrado');
      }

      const team = await TeamModel.getById(nuevoEquipoId);
      if (!team) {
        throw new Error('El equipo de destino no existe');
      }

      if (player.equipo_id === nuevoEquipoId) {
        throw new Error('El jugador ya pertenece a ese equipo');
      }

      const transferred = await PlayerModel.transfer(id, nuevoEquipoId);
      if (!transferred) {
        throw new Error('No se pudo realizar la transferencia');
      }

      return await PlayerModel.getById(id);
    } catch (error) {
      throw new Error(`Error al transferir jugador: ${error.message}`);
    }
  }

  async deletePlayer(id) {
    try {
      const player = await PlayerModel.getById(id);
      if (!player) {
        throw new Error('Jugador no encontrado');
      }

      const deleted = await PlayerModel.delete(id);
      if (!deleted) {
        throw new Error('No se pudo eliminar el jugador');
      }

      return { message: 'Jugador eliminado exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar jugador: ${error.message}`);
    }
  }
  
  async advancedSearch(filters) {
    try {
      return await PlayerModel.advancedSearch(filters);
    } catch (error) {
      throw new Error(`Error en búsqueda avanzada: ${error.message}`);
    }
  }
}


module.exports = new PlayerService();