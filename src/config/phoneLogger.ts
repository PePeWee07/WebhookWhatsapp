import fs from 'fs/promises';
import path from 'path';
import moment from 'moment-timezone';

export async function appendLogEntry(body: any, phoneNumber: string) {
  const logFilePath = path.join('logs', 'messages', `${phoneNumber}.json`);

  // Crear la entrada de log con timestamp en America/Guayaquil
  const logEntry = {
    timestamp: moment().tz('America/Guayaquil').format("YYYY-MM-DD HH:mm:ss"),
    body: body
  };

  // Convertir la entrada a una cadena JSON
  const jsonEntry = JSON.stringify(logEntry, null, 2);

  try {
    await fs.appendFile(logFilePath, jsonEntry + ',\n', 'utf8');
  } catch (error) {
    console.error("Error al apendar la entrada:", error);
  }
}
