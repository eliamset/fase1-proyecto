// routes/meditations.js
const express = require('express');
const router = express.Router();
const Meditation = require('../models/Meditation');

// --- Crear un registro ---
router.post('/', async (req, res) => {
    try {
        const { user, duracion, fecha } = req.body;

        // Nota: 'user' aqui se usa como ID directo o string si no hay auth
        const nuevaMeditacion = await Meditation.create({
            userId: user || null,
            duracion,
            fecha: fecha || new Date()
        });

        res.status(201).json(nuevaMeditacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la meditación' });
    }
});

// --- Obtener todos los registros ---
router.get('/', async (req, res) => {
    try {
        const registros = await Meditation.findAll();
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener meditaciones' });
    }
});

module.exports = router;
