const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Food = require('../models/Food');

// @route   GET api/foods
// @desc    Obtener todos los alimentos de un usuario
// @access  Privado
router.get('/', auth, async (req, res) => {
    try {
        const foods = await Food.find({ user: req.user.id }).sort({ fecha: -1 });
        res.json(foods);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// @route   POST api/foods
// @desc    Añadir un nuevo alimento
// @access  Privado
router.post('/', auth, async (req, res) => {
    const { nombre, calorias, fecha } = req.body;

    try {
        const newFood = new Food({
            user: req.user.id,
            nombre,
            calorias,
            fecha
        });

        const food = await newFood.save();
        res.status(201).json(food);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE api/foods/:id
// @desc    Eliminar un alimento
// @access  Privado
router.delete('/:id', auth, async (req, res) => {
    try {
        let food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ msg: 'Alimento no encontrado' });
        }

        if (food.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        await Food.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Alimento eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
