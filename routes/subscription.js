const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   PUT api/subscription/subscribe
// @desc    Subscribe user to premium
// @access  Private
router.put('/subscribe', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        // En una aplicación real, aquí procesarías el pago.
        // Por ahora, simplemente actualizamos el estado de la suscripción.
        user.subscription = 'premium';
        await user.save();

        res.json({
            msg: '¡Suscripción a Premium exitosa!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                subscription: user.subscription
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error del servidor' }); // ✅ ahora devuelve JSON
    }
});

module.exports = router;
