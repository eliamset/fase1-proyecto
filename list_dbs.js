const mysql = require('mysql2/promise');
require('dotenv').config();

async function listDatabases() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
        });

        const [rows] = await connection.query('SHOW DATABASES;');
        console.log('📂 Bases de datos encontradas:');
        rows.forEach(row => console.log(` - ${row.Database}`));

        await connection.end();
    } catch (error) {
        console.error('❌ Error al listar bases de datos:', error.message);
    }
}

listDatabases();
