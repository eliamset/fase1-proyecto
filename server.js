const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar variables de entorno primero
dotenv.config();

const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en el body

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/routines', require('./routes/routines')); // ⚠️ revisa que exista routes/routines.js
app.use('/api/foods', require('./routes/food'));
app.use('/api/meditations', require('./routes/meditations'));
app.use('/api/subscription', require('./routes/subscription'));

app.get('/', (req, res) => {
    res.send('API de Salud y Bienestar funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
