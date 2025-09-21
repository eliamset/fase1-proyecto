const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // o true si manejas autenticación
    },
    Numerodetarjeta: {        // ⚡ usar "duracion" en vez de "minutos"
        type: String,
        required: true,
    },
    FechadeVencimiento: {
        type: String,
        required: true, // siempre habrá fecha

    },
    cvc: {
        type: String,
        required: true,// siempre habrá fecha
    }

        
}, { timestamps: true });
module.exports = mongoose.model('Subscription', SubscriptionSchema);