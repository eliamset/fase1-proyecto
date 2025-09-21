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
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);