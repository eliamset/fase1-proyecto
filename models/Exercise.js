const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User'); // Import to define association if needed here, or handle in server/index

const Exercise = sequelize.define('Exercise', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duracion: {
        type: DataTypes.INTEGER, // en minutos
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE, // Sequelize DATE maps to datetime
        allowNull: false
    }
}, {
    tableName: 'exercises',
    timestamps: true
});

module.exports = Exercise;
