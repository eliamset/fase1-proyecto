// models/Food.js
const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // o true si usas JWT
    },
    nombre: {
        type: String,
        required: true,
    },
    calorias: {
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model('Food', FoodSchema);

