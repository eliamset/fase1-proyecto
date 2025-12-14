const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Based on original schema
        references: {
            model: 'users',
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    calorias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'foods',
    timestamps: true
});

module.exports = Food;
