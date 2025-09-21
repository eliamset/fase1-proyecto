// models/Exercise.js
const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tipo: {
        type: String,
        required: true,
    },
    duracion: {
        type: Number, // en minutos
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', ExerciseSchema);
