import winston from 'winston';
import moment from 'moment-timezone';

const { combine, timestamp, printf, colorize } = winston.format;

// Configuramos el timestamp para que use la zona horaria "America/Guayaquil"
const customTimestamp = timestamp({
  format: () => moment().tz("America/Guayaquil").format("YYYY-MM-DD HH:mm:ss")
});

// Define el formato que tendrá cada mensaje de log
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info', // Nivel mínimo de logs que se almacenarán
  format: combine(
    customTimestamp,
    myFormat
  ),
  transports: [
    // Almacena los logs de error en un archivo específico
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

// En desarrollo, también se muestran los logs en consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      customTimestamp,
      myFormat
    )
  }));
}

export default logger;
