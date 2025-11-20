const db = require('../db');

class TeamModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        l.nombre as nombre_liga
      FROM Equipos e
      LEFT JOIN Ligas l ON e.liga_id = l.liga_id
      ORDER BY e.nombre
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        e.*,
        l.nombre as nombre_liga,
        l.pais as pais_liga
      FROM Equipos e
      LEFT JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE e.equipo_id = ?
    `, [id]);
    return rows[0];
  }

  static async getByLeague(ligaId) {
    const [rows] = await db.query(`
      SELECT * FROM Equipos 
      WHERE liga_id = ?
      ORDER BY nombre
    `, [ligaId]);
    return rows;
  }

  static async search(filters) {
    let query = `
      SELECT 
        e.*,
        l.nombre as nombre_liga
      FROM Equipos e
      LEFT JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.nombre) {
      query += ` AND e.nombre LIKE ?`;
      params.push(`%${filters.nombre}%`);
    }

    if (filters.ciudad) {
      query += ` AND e.ciudad LIKE ?`;
      params.push(`%${filters.ciudad}%`);
    }

    if (filters.liga_id) {
      query += ` AND e.liga_id = ?`;
      params.push(filters.liga_id);
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getWithPlayers(id) {
    const [team] = await db.query(`
      SELECT 
        e.*,
        l.nombre as nombre_liga
      FROM Equipos e
      LEFT JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE e.equipo_id = ?
    `, [id]);

    if (team.length === 0) return null;

    const [players] = await db.query(`
      SELECT * FROM Jugadores 
      WHERE equipo_id = ?
      ORDER BY numero_camiseta
    `, [id]);

    return {
      ...team[0],
      jugadores: players
    };
  }

  static async create(teamData) {
    const [result] = await db.query(
      `INSERT INTO Equipos (
        liga_id, nombre, escudo_logo_url, ciudad, nombre_estadio
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        teamData.liga_id,
        teamData.nombre,
        teamData.escudo_logo_url || null,
        teamData.ciudad || null,
        teamData.nombre_estadio || null
      ]
    );
    return result.insertId;
  }

  static async update(id, teamData) {
    const [result] = await db.query(
      `UPDATE Equipos SET 
        liga_id = COALESCE(?, liga_id),
        nombre = COALESCE(?, nombre),
        escudo_logo_url = COALESCE(?, escudo_logo_url),
        ciudad = COALESCE(?, ciudad),
        nombre_estadio = COALESCE(?, nombre_estadio)
      WHERE equipo_id = ?`,
      [
        teamData.liga_id,
        teamData.nombre,
        teamData.escudo_logo_url,
        teamData.ciudad,
        teamData.nombre_estadio,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [players] = await db.query(
      `SELECT COUNT(*) as count FROM Jugadores WHERE equipo_id = ?`,
      [id]
    );

    if (players[0].count > 0) {
      throw new Error('No se puede eliminar el equipo porque tiene jugadores asociados');
    }

    const [result] = await db.query(
      `DELETE FROM Equipos WHERE equipo_id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async isNameUnique(nombre, excludeEquipoId = null) {
    let query = `SELECT COUNT(*) as count FROM Equipos WHERE nombre = ?`;
    const params = [nombre];

    if (excludeEquipoId) {
      query += ` AND equipo_id != ?`;
      params.push(excludeEquipoId);
    }

    const [rows] = await db.query(query, params);
    return rows[0].count === 0;
  }

  static async countPlayers(equipoId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM Jugadores WHERE equipo_id = ?`,
      [equipoId]
    );
    return rows[0].total;
  }

  static async getPlayersByPosition(equipoId, posicion) {
    const [rows] = await db.query(`
      SELECT * FROM Jugadores 
      WHERE equipo_id = ? AND posicion = ?
      ORDER BY numero_camiseta
    `, [equipoId, posicion]);
    return rows;
  }
}


module.exports = TeamModel;