const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const UsuarioModel = require('../models/UsuarioModel'); 

const JWT_SECRET = process.env.JWT_SECRET;

const registrar = async (nombre, email, password) => {

  const usuarioExistente = await UsuarioModel.encontrarPorEmail(email);
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 10); 

  const nuevoUsuario = await UsuarioModel.crear(nombre, email, passwordHash);
  
  return nuevoUsuario;
};

const login = async (email, password) => {
  const usuario = await UsuarioModel.encontrarPorEmail(email); 
  if (!usuario) {
    throw new Error('Credenciales inválidas'); 
  }

  const esPasswordCorrecto = await bcrypt.compare(password, usuario.password_hash);
  if (!esPasswordCorrecto) {
    throw new Error('Credenciales inválidas'); 
  }

  const payload = { 
    usuario: {
      id: usuario.usuario_id, 
      email: usuario.email
    }
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h' 
  });

  delete usuario.password_hash; 

  return { token, usuario };
};

module.exports = { registrar, login };