// src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../config/logger';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

pool.on('connect', () => {});

pool.on('error', (err: any) => {
  logger.error('Error en la conexión de la base de datos:', err);
});

export default pool;
