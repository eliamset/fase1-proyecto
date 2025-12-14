// routes/exercises.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Exercise = require('../models/Exercise');

// @route   GET api/exercises
// @desc    Obtener todos los ejercicios de un usuario
// @access  Privado
router.get('/', auth, async (req, res) => {
    try {
        const exercises = await Exercise.findAll({
            where: { userId: req.user.id },
            order: [['fecha', 'DESC']]
        });
        res.json(exercises);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   POST api/exercises
// @desc    Crear un nuevo ejercicio
// @access  Privado
router.post('/', auth, async (req, res) => {
    const { tipo, duracion, fecha } = req.body;

    try {
        const newExercise = await Exercise.create({
            userId: req.user.id,
            tipo,
            duracion,
            fecha
        });

        res.status(201).json(newExercise);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// @route   DELETE api/exercises/:id
// @desc    Eliminar un ejercicio
// @access  Privado
router.delete('/:id', auth, async (req, res) => {
    try {
        const exercise = await Exercise.findByPk(req.params.id);

        if (!exercise) {
            return res.status(404).json({ msg: 'Ejercicio no encontrado' });
        }

        if (exercise.userId !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await exercise.destroy();

        res.json({ msg: 'Ejercicio eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
