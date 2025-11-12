require('dotenv').config(); 
const express = require('express');
const cors = require('cors'); 

const authRoutes = require('./routes/AuthRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '¡Bienvenido a la API de Scorely! v1.0' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});