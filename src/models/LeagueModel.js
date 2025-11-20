const db = require('../db');

class LeagueModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT * FROM Ligas
      ORDER BY nombre
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT * FROM Ligas
      WHERE liga_id = ?
    `, [id]);
    return rows[0];
  }

  static async search(filters) {
    let query = `SELECT * FROM Ligas WHERE 1=1`;
    const params = [];

    if (filters.nombre) {
      query += ` AND nombre LIKE ?`;
      params.push(`%${filters.nombre}%`);
    }

    if (filters.pais) {
      query += ` AND pais LIKE ?`;
      params.push(`%${filters.pais}%`);
    }

    query += ` ORDER BY nombre`;

    const [rows] = await db.query(query, params);
    return rows;
  }


  static async getWithTeams(id) {
    const [liga] = await db.query(`
      SELECT * FROM Ligas WHERE liga_id = ?
    `, [id]);

    if (liga.length === 0) return null;

    const [equipos] = await db.query(`
      SELECT * FROM Equipos 
      WHERE liga_id = ?
      ORDER BY nombre
    `, [id]);

    return {
      ...liga[0],
      equipos: equipos
    };
  }

  static async create(ligaData) {
    const [result] = await db.query(
      `INSERT INTO Ligas (nombre, pais, logo_url) 
       VALUES (?, ?, ?)`,
      [
        ligaData.nombre,
        ligaData.pais || null,
        ligaData.logo_url || null
      ]
    );
    return result.insertId;
  }

  static async update(id, ligaData) {
    const [result] = await db.query(
      `UPDATE Ligas SET 
        nombre = COALESCE(?, nombre),
        pais = COALESCE(?, pais),
        logo_url = COALESCE(?, logo_url)
      WHERE liga_id = ?`,
      [
        ligaData.nombre,
        ligaData.pais,
        ligaData.logo_url,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM Ligas WHERE liga_id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async isNameUnique(nombre, excludeLigaId = null) {
    let query = `SELECT COUNT(*) as count FROM Ligas WHERE nombre = ?`;
    const params = [nombre];

    if (excludeLigaId) {
      query += ` AND liga_id != ?`;
      params.push(excludeLigaId);
    }

    const [rows] = await db.query(query, params);
    return rows[0].count === 0;
  }

  static async countTeams(ligaId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as total FROM Equipos WHERE liga_id = ?`,
      [ligaId]
    );
    return rows[0].total;
  }
  

  static async getPlayers(ligaId) {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        e.nombre as nombre_equipo,
        e.escudo_logo_url as escudo_equipo
      FROM Jugadores j
      INNER JOIN Equipos e ON j.equipo_id = e.equipo_id
      WHERE e.liga_id = ?
      ORDER BY j.apellido, j.nombre
    `, [ligaId]);
    return rows;
  }

  static async getPlayersByPosition(ligaId, posicion) {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        e.nombre as nombre_equipo,
        e.escudo_logo_url as escudo_equipo
      FROM Jugadores j
      INNER JOIN Equipos e ON j.equipo_id = e.equipo_id
      WHERE e.liga_id = ? AND j.posicion = ?
      ORDER BY j.apellido, j.nombre
    `, [ligaId, posicion]);
    return rows;
  }
}




module.exports = LeagueModel;