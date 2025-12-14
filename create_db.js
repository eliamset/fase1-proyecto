const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    try {
        // Conectar sin seleccionar base de datos
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
        });

        const dbName = process.env.DB_NAME || 'salud_bienestar';

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`✅ Base de datos '${dbName}' creada o ya existente.`);

        await connection.end();
    } catch (error) {
        console.error('❌ Error al crear la base de datos:', error.message);
    }
}

createDatabase();
