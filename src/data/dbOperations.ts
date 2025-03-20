import pool from './db';

export const saveMessage = async (
  wa_id: string,
  name: string,
  messageId: string,
  formattedDate: Date,
  content: string,
  type: string
) => {
  const query = `
    INSERT INTO messages (wa_id, name, message_id, formatted_date, content, type)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, wa_id, name, message_id, formatted_date, content, type;
  `;
  const values = [wa_id, name, messageId, formattedDate, content, type];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error al guardar el mensaje:", error);
    throw error;
  }
};

export default saveMessage;
