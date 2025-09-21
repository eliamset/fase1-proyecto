// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // ⚡ Estas opciones ya no son necesarias con MongoDB driver 4+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB conectado correctamente');
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1); // Detener la app si no se puede conectar
  }
};

module.exports = connectDB;

