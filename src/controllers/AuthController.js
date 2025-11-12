const authService = require('../services/AuthService'); 

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Faltan datos (nombre, email o password)' });
    }

    const nuevoUsuario = await authService.registrar(nombre, email, password);
    
    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.error(error);
    if (error.message === 'El email ya está registrado') {
      return res.status(409).json({ error: error.message }); 
    }
    res.status(500).json({ error: 'Error interno al registrar usuario' });
  }
};

const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan email o password' });
    }

    const { token, usuario } = await authService.login(email, password);

    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: usuario
    });

  } catch (error) {
    console.error(error);
    
    if (error.message === 'Credenciales inválidas') {
      return res.status(401).json({ error: error.message }); 
    }
    res.status(500).json({ error: 'Error interno en login' });
  }
};

module.exports = { registrarUsuario, loginUsuario };