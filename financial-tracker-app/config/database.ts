import { Sequelize } from 'sequelize';

const databaseConfig = {
  database: process.env.DB_NAME || 'financial_tracker',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql', // or 'postgres', 'sqlite', etc.
};

const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
  host: databaseConfig.host,
  dialect: databaseConfig.dialect,
  logging: false, // Disable logging; default: console.log
});

export default sequelize;