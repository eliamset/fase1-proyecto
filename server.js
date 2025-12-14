const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar variables de entorno primero
dotenv.config();

const { connectDB, sequelize } = require('./config/db');

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en el body

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/foods', require('./routes/food'));
app.use('/api/meditations', require('./routes/meditations'));
app.use('/api/subscription', require('./routes/subscription'));

app.get('/', (req, res) => {
    res.send('API de Salud y Bienestar funcionando con MySQL');
});

const PORT = process.env.PORT || 5000;

// Sincronizar modelos y luego iniciar servidor
sequelize.sync().then(() => {
    console.log('Tablas sincronizadas');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}).catch(err => {
    console.error('Error al sincronizar tablas:', err);
});
