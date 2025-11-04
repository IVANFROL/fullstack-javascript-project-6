import dotenv from 'dotenv';

dotenv.config();

const config = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
    },
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './database/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    },
    migrations: {
      directory: './database/migrations',
    },
  },
};

export default config;
