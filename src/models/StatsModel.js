const db = require('../db');

class StatsModel {
    static async getByPlayer(jugadorId) {
        const [rows] = await db.query(`
            SELECT 
                e.*,
                l.nombre as nombre_liga,
                j.nombre,
                j.apellido,
                eq.nombre as nombre_equipo
            FROM EstadisticasJugador e
            INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
            INNER JOIN Equipos eq ON j.equipo_id = eq.equipo_id
            INNER JOIN Ligas l ON e.liga_id = l.liga_id
            WHERE e.jugador_id = ?
            ORDER BY e.temporada DESC
    `, [jugadorId]);
    return rows;
}

    static async getByPlayerAndSeason(jugadorId, temporada) {
    const [rows] = await db.query(`
        SELECT 
        e.*,
        l.nombre as nombre_liga,
        j.nombre,
        j.apellido,
        j.posicion,
        eq.nombre as nombre_equipo,
        eq.escudo_logo_url
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Equipos eq ON j.equipo_id = eq.equipo_id
      INNER JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE e.jugador_id = ? AND e.temporada = ?
    `, [jugadorId, temporada]);
    return rows[0];
  }

  static async getByTeam(equipoId) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        j.nombre,
        j.apellido,
        j.posicion,
        j.numero_camiseta,
        j.foto_url,
        l.nombre as nombre_liga
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE j.equipo_id = ?
      ORDER BY e.goles DESC, e.asistencias DESC
    `, [equipoId]);
    return rows;
  }

  static async getByTeamAndSeason(equipoId, temporada) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        j.nombre,
        j.apellido,
        j.posicion,
        j.numero_camiseta,
        j.foto_url,
        l.nombre as nombre_liga
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE j.equipo_id = ? AND e.temporada = ?
      ORDER BY e.goles DESC, e.asistencias DESC
    `, [equipoId, temporada]);
    return rows;
  }

  static async getByLeagueAndSeason(ligaId, temporada) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        j.nombre,
        j.apellido,
        j.posicion,
        j.foto_url,
        eq.nombre as nombre_equipo,
        eq.escudo_logo_url
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Equipos eq ON j.equipo_id = eq.equipo_id
      WHERE e.liga_id = ? AND e.temporada = ?
      ORDER BY e.goles DESC, e.asistencias DESC
    `, [ligaId, temporada]);
    return rows;
  }

  static async getTopScorers(ligaId, temporada, limit = 10) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        j.nombre,
        j.apellido,
        j.posicion,
        j.foto_url,
        eq.nombre as nombre_equipo,
        eq.escudo_logo_url,
        ROUND(e.goles / NULLIF(e.partidos_jugados, 0), 2) as promedio_goles
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Equipos eq ON j.equipo_id = eq.equipo_id
      WHERE e.liga_id = ? AND e.temporada = ?
      ORDER BY e.goles DESC, promedio_goles DESC
      LIMIT ?
    `, [ligaId, temporada, limit]);
    return rows;
  }

  static async getTopAssisters(ligaId, temporada, limit = 10) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        j.nombre,
        j.apellido,
        j.posicion,
        j.foto_url,
        eq.nombre as nombre_equipo,
        eq.escudo_logo_url,
        ROUND(e.asistencias / NULLIF(e.partidos_jugados, 0), 2) as promedio_asistencias
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Equipos eq ON j.equipo_id = eq.equipo_id
      WHERE e.liga_id = ? AND e.temporada = ?
      ORDER BY e.asistencias DESC, promedio_asistencias DESC
      LIMIT ?
    `, [ligaId, temporada, limit]);
    return rows;
  }

  static async create(estadisticaData) {
    const [result] = await db.query(
      `INSERT INTO EstadisticasJugador (
        jugador_id, liga_id, temporada, partidos_jugados,
        goles, asistencias, tarjetas_amarillas, 
        tarjetas_rojas, minutos_jugados
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        estadisticaData.jugador_id,
        estadisticaData.liga_id,
        estadisticaData.temporada,
        estadisticaData.partidos_jugados || 0,
        estadisticaData.goles || 0,
        estadisticaData.asistencias || 0,
        estadisticaData.tarjetas_amarillas || 0,
        estadisticaData.tarjetas_rojas || 0,
        estadisticaData.minutos_jugados || 0
      ]
    );
    return result.insertId;
  }
  static async update(id, estadisticaData) {
    const [result] = await db.query(
      `UPDATE EstadisticasJugador SET 
        partidos_jugados = COALESCE(?, partidos_jugados),
        goles = COALESCE(?, goles),
        asistencias = COALESCE(?, asistencias),
        tarjetas_amarillas = COALESCE(?, tarjetas_amarillas),
        tarjetas_rojas = COALESCE(?, tarjetas_rojas),
        minutos_jugados = COALESCE(?, minutos_jugados)
      WHERE estadistica_id = ?`,
      [
        estadisticaData.partidos_jugados,
        estadisticaData.goles,
        estadisticaData.asistencias,
        estadisticaData.tarjetas_amarillas,
        estadisticaData.tarjetas_rojas,
        estadisticaData.minutos_jugados,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        j.nombre,
        j.apellido,
        eq.nombre as nombre_equipo,
        l.nombre as nombre_liga
      FROM EstadisticasJugador e
      INNER JOIN Jugadores j ON e.jugador_id = j.jugador_id
      INNER JOIN Equipos eq ON j.equipo_id = eq.equipo_id
      INNER JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE e.estadistica_id = ?
    `, [id]);
    return rows[0];
  }

  static async exists(jugadorId, ligaId, temporada) {
    const [rows] = await db.query(
      `SELECT estadistica_id FROM EstadisticasJugador 
      WHERE jugador_id = ? AND liga_id = ? AND temporada = ?`,
      [jugadorId, ligaId, temporada]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

module.exports = StatsModel;