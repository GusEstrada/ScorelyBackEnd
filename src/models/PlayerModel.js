const db = require('../db');

class PlayerModel {
  static async getAll() {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        e.nombre as nombre_equipo,
        e.escudo_logo_url as escudo_equipo
      FROM Jugadores j
      LEFT JOIN Equipos e ON j.equipo_id = e.equipo_id
      ORDER BY j.apellido, j.nombre
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        e.nombre as nombre_equipo,
        e.escudo_logo_url as escudo_equipo,
        e.ciudad as ciudad_equipo
      FROM Jugadores j
      LEFT JOIN Equipos e ON j.equipo_id = e.equipo_id
      WHERE j.jugador_id = ?
    `, [id]);
    return rows[0];
  }

  static async getByTeam(equipoId) {
    const [rows] = await db.query(`
      SELECT * FROM Jugadores 
      WHERE equipo_id = ?
      ORDER BY numero_camiseta
    `, [equipoId]);
    return rows;
  }

  static async search(filters) {
    let query = `
      SELECT 
        j.*,
        e.nombre as nombre_equipo
      FROM Jugadores j
      LEFT JOIN Equipos e ON j.equipo_id = e.equipo_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.nombre) {
      query += ` AND (j.nombre LIKE ? OR j.apellido LIKE ?)`;
      params.push(`%${filters.nombre}%`, `%${filters.nombre}%`);
    }

    if (filters.posicion) {
      query += ` AND j.posicion = ?`;
      params.push(filters.posicion);
    }

    if (filters.equipo_id) {
      query += ` AND j.equipo_id = ?`;
      params.push(filters.equipo_id);
    }

    if (filters.nacionalidad) {
      query += ` AND j.nacionalidad = ?`;
      params.push(filters.nacionalidad);
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getByPosition(posicion) {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        e.nombre as nombre_equipo
      FROM Jugadores j
      LEFT JOIN Equipos e ON j.equipo_id = e.equipo_id
      WHERE j.posicion = ?
      ORDER BY j.apellido, j.nombre
    `, [posicion]);
    return rows;
  }

  static async getByNationality(nacionalidad) {
    const [rows] = await db.query(`
      SELECT 
        j.*,
        e.nombre as nombre_equipo
      FROM Jugadores j
      LEFT JOIN Equipos e ON j.equipo_id = e.equipo_id
      WHERE j.nacionalidad = ?
      ORDER BY j.apellido, j.nombre
    `, [nacionalidad]);
    return rows;
  }

  static async create(playerData) {
    const [result] = await db.query(
      `INSERT INTO Jugadores (
        equipo_id, nombre, apellido, posicion, 
        numero_camiseta, nacionalidad, foto_url, fecha_nacimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        playerData.equipo_id,
        playerData.nombre,
        playerData.apellido,
        playerData.posicion || null,
        playerData.numero_camiseta || null,
        playerData.nacionalidad || null,
        playerData.foto_url || null,
        playerData.fecha_nacimiento || null
      ]
    );
    return result.insertId;
  }

  static async update(id, playerData) {
    const [result] = await db.query(
      `UPDATE Jugadores SET 
        equipo_id = COALESCE(?, equipo_id),
        nombre = COALESCE(?, nombre),
        apellido = COALESCE(?, apellido),
        posicion = COALESCE(?, posicion),
        numero_camiseta = COALESCE(?, numero_camiseta),
        nacionalidad = COALESCE(?, nacionalidad),
        foto_url = COALESCE(?, foto_url),
        fecha_nacimiento = COALESCE(?, fecha_nacimiento)
      WHERE jugador_id = ?`,
      [
        playerData.equipo_id,
        playerData.nombre,
        playerData.apellido,
        playerData.posicion,
        playerData.numero_camiseta,
        playerData.nacionalidad,
        playerData.foto_url,
        playerData.fecha_nacimiento,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  static async transfer(id, nuevoEquipoId) {
    const [result] = await db.query(
      `UPDATE Jugadores SET equipo_id = ? WHERE jugador_id = ?`,
      [nuevoEquipoId, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      `DELETE FROM Jugadores WHERE jugador_id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  static async isJerseyNumberAvailable(equipoId, numeroCamiseta, excludeJugadorId = null) {
    let query = `
      SELECT COUNT(*) as count 
      FROM Jugadores 
      WHERE equipo_id = ? AND numero_camiseta = ?
    `;
    const params = [equipoId, numeroCamiseta];

    if (excludeJugadorId) {
      query += ` AND jugador_id != ?`;
      params.push(excludeJugadorId);
    }

    const [rows] = await db.query(query, params);
    return rows[0].count === 0;
  }

  static async advancedSearch(filters) {
    let query = `
      SELECT 
        j.*,
        e.nombre as nombre_equipo,
        e.escudo_logo_url as escudo_equipo,
        e.liga_id,
        l.nombre as nombre_liga
      FROM Jugadores j
      INNER JOIN Equipos e ON j.equipo_id = e.equipo_id
      INNER JOIN Ligas l ON e.liga_id = l.liga_id
      WHERE 1=1
    `;
    const params = [];

    if (filters.liga_id) {
      query += ` AND e.liga_id = ?`;
      params.push(filters.liga_id);
    }

    if (filters.equipo_id) {
      query += ` AND j.equipo_id = ?`;
      params.push(filters.equipo_id);
    }

    if (filters.posicion) {
      query += ` AND j.posicion = ?`;
      params.push(filters.posicion);
    }

    if (filters.nacionalidad) {
      query += ` AND j.nacionalidad = ?`;
      params.push(filters.nacionalidad);
    }

    if (filters.nombre) {
      query += ` AND (j.nombre LIKE ? OR j.apellido LIKE ?)`;
      params.push(`%${filters.nombre}%`, `%${filters.nombre}%`);
    }

    query += ` ORDER BY j.apellido, j.nombre`;

    const [rows] = await db.query(query, params);
    return rows;
  }
}


module.exports = PlayerModel;