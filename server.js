const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());  // Permite leer datos JSON en las solicitudes

// Conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);
app.user('/saludo', saludo);

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
