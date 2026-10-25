const { Sequelize } = require('sequelize');

let sequelize;

const useSSL = process.env.DB_SSL === 'true';

// Por defecto valida el certificado del servidor.
// Solo si se necesita saltarlo temporalmente: DB_SSL_REJECT_UNAUTHORIZED=false
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const dialectOptions = useSSL
  ? {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized,
      },
    }
  : {};

if (process.env.DATABASE_URL) {
  // URL completa de conexión
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions,
  });
} else {
  // Variables individuales (local y Azure)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions,
    }
  );
}

module.exports = sequelize;