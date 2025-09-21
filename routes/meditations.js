// routes/meditations.js
const express = require('express');
const router = express.Router();
const Meditation = require('../models/Meditation'); // tu modelo

// --- Crear un registro ---
router.post('/', async (req, res) => {
    try {
        const { user, duracion, fecha } = req.body; // nombres coinciden con frontend

        const nuevaMeditacion = new Meditation({
            user,        // opcional según si manejas JWT
            duracion,
            fecha: fecha || Date.now() // si no envían fecha, poner hoy
        });

        await nuevaMeditacion.save();
        res.status(201).json(nuevaMeditacion); // enviar el objeto guardado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la meditación' });
    }
});

// --- Obtener todos los registros ---
router.get('/', async (req, res) => {
    try {
        const registros = await Meditation.find();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener meditaciones' });
    }
});

module.exports = router;
