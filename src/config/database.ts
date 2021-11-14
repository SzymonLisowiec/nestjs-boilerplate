export default {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: +process.env.DB_PORT || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migration',
    extension: 'ts',
  },
};
