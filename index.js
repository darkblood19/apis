const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// Esquema de datos (debe coincidir con tu app Android)
const SensorSchema = new mongoose.Schema({
  timestamp: Number,
  heartRate: Number,
  accelerometer: { x: Number, y: Number, z: Number },
  gyroscope: { x: Number, y: Number, z: Number },
  watchName: String,
  battery: Number
});

const SensorModel = mongoose.model('Lecturas', SensorSchema);

// Endpoint para recibir lotes de datos
app.post('/api/sensors/batch', async (req, res) => {
  try {
    const data = req.body;
    await SensorModel.insertMany(data);
    console.log(`Guardados ${data.length} registros`);
    res.status(200).json({ message: "Sincronizado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar datos" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
