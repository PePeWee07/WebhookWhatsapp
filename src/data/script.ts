import pool from './db';
import logger from '../config/logger';

const createMessagesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      wa_id TEXT NOT NULL,
      name TEXT NOT NULL,
      message_id TEXT NOT NULL,
      formatted_date TIMESTAMP NOT NULL,
      content TEXT,
      type TEXT
    );
  `;

  try {
    await pool.query(query);
    logger.info('Tabla "messages" verificada/creada exitosamente');
  } catch (error) {
    logger.error('Error al crear la tabla "messages":', error);
  }
};

export default createMessagesTable;
