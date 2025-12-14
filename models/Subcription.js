const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    Numerodetarjeta: { // Keeping original casing
        type: DataTypes.STRING,
        allowNull: false
    },
    FechadeVencimiento: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cvc: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'subscriptions',
    timestamps: true
});

module.exports = Subscription;