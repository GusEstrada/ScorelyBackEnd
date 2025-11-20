const PlayerService = require('../services/PlayerService');

class PlayerController {

  async obtenerTodos(req, res) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.json({
        success: true,
        data: players,
        total: players.length
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
      const player = await PlayerService.getPlayerById(req.params.id);
      res.json({
        success: true,
        data: player
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
        posicion: req.query.posicion,
        equipo_id: req.query.equipo_id,
        nacionalidad: req.query.nacionalidad
      };
      const players = await PlayerService.searchPlayers(filters);
      res.json({
        success: true,
        data: players,
        total: players.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorEquipo(req, res) {
    try {
      const players = await PlayerService.getPlayersByTeam(req.params.equipo_id);
      res.json({
        success: true,
        data: players,
        total: players.length
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorPosicion(req, res) {
    try {
      const players = await PlayerService.getPlayersByPosition(req.params.posicion);
      res.json({
        success: true,
        data: players,
        total: players.length
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async obtenerPorNacionalidad(req, res) {
    try {
      const players = await PlayerService.getPlayersByNationality(req.params.nacionalidad);
      res.json({
        success: true,
        data: players,
        total: players.length
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
      const newPlayer = await PlayerService.createPlayer(req.body);
      res.status(201).json({
        success: true,
        message: 'Jugador creado exitosamente',
        data: newPlayer
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
      const updatedPlayer = await PlayerService.updatePlayer(req.params.id, req.body);
      res.json({
        success: true,
        message: 'Jugador actualizado exitosamente',
        data: updatedPlayer
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async transferir(req, res) {
    try {
      const { nuevo_equipo_id } = req.body;
      if (!nuevo_equipo_id) {
        return res.status(400).json({
          success: false,
          message: 'El ID del nuevo equipo es requerido'
        });
      }
      const transferredPlayer = await PlayerService.transferPlayer(req.params.id, nuevo_equipo_id);
      res.json({
        success: true,
        message: 'Jugador transferido exitosamente',
        data: transferredPlayer
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
      const result = await PlayerService.deletePlayer(req.params.id);
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

  async busquedaAvanzada(req, res) {
    try {
      const filters = {
        liga_id: req.query.liga_id,
        equipo_id: req.query.equipo_id,
        posicion: req.query.posicion,
        nacionalidad: req.query.nacionalidad,
        nombre: req.query.nombre
      };
      const jugadores = await PlayerService.advancedSearch(filters);
      res.json({
        success: true,
        data: jugadores,
        total: jugadores.length,
        filtros_aplicados: filters
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}


module.exports = new PlayerController();