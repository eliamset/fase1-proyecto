const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // o true si manejas autenticación
    },
    duracion: {        // ⚡ usar "duracion" en vez de "minutos"
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now, // siempre habrá fecha
    }
}, { timestamps: true });

module.exports = mongoose.model('Meditation', MeditationSchema);
