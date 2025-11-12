const db = require('../db'); 
const UsuarioModel = {

  crear: async (nombre, email, passwordHash) => {
    try {
      
      const [result] = await db.query(
        'INSERT INTO Usuarios (nombre_usuario, email, password_hash) VALUES (?, ?, ?)',
        [nombre, email, passwordHash]
      );
      
      
      return { usuario_id: result.insertId, nombre_usuario: nombre, email };
    } catch (error) {
      console.error('Error en modelo al crear usuario:', error);
      throw error;
    }
  },

  
  encontrarPorEmail: async (email) => {
    try {
      
      const [rows] = await db.query(
        'SELECT * FROM Usuarios WHERE email = ? LIMIT 1',
        [email]
      );
      
      
      return rows[0];
    } catch (error) {
      console.error('Error en modelo al buscar por email:', error);
      throw error;
    }
  }
};

module.exports = UsuarioModel;