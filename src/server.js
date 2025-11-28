require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 

const authRoutes = require('./routes/AuthRoutes'); 
const playerRoutes = require('./routes/PlayerRoutes');
const teamRoutes = require('./routes/TeamRoutes');
const leagueRoutes = require('./routes/LeagueRoutes');
<<<<<<< HEAD
const statsRoutes = require('./routes/StatsRoutes');
=======
>>>>>>> d05e2d4291c955af323de6deb44d2d0f1a860af8

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/api/jugadores', playerRoutes);
app.use('/api/equipos', teamRoutes);
app.use('/api/ligas', leagueRoutes);
<<<<<<< HEAD
app.use('/api/estadisticas', statsRoutes);
=======
>>>>>>> d05e2d4291c955af323de6deb44d2d0f1a860af8

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API de Scorely! v1.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;