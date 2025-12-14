const { sequelize } = require('./config/db');

async function checkDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa a MySQL.');

        // Obtener las tablas
        const [results, metadata] = await sequelize.query("SHOW TABLES");
        console.log('📊 Tablas en la base de datos:');
        console.table(results);

    } catch (error) {
        console.error('❌ Error al conectar:', error.message);
        console.log('Asegúrate de que XAMPP/MySQL esté corriendo y la base de datos exista.');
    } finally {
        await sequelize.close();
    }
}

checkDatabase();
