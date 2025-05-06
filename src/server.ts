import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import { Whatsapp } from "./interface/WhatsAppInterface";
import createMessagesTable from "./data/script";
import saveMessage from "./data/dbOperations";
import axios from 'axios';
import logger from "./config/logger";
import { appendLogEntry } from './config/phoneLogger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: 'https://ia-sp-backoffice.ucatolica.cue.ec',
  methods: ['GET'],
  optionsSuccessStatus: 200
};

dotenv.config();

const app = express();
app.set('trust proxy', 1);

app.use(express.json());

const webhookStartTime = new Date();
logger.info('Iniciando la aplicación...');

const { WEBHOOK_VERIFY_TOKEN, PORT, URL_BACKEND, API_KEY_HEADER, API_KEY } = process.env;

// ======================================================
//   Verify Table DB
// ======================================================
createMessagesTable();


// ======================================================
//   Seguridad basica
// ======================================================
  app.use(helmet());
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes,
    message: 'Muchas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos',
    max: 100, // cada IP podrá hacer hasta 100 peticiones en ese período
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);


// ======================================================
//   Verify Webhook
// ======================================================
app.get("/webhook", (req , res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
  
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
      // respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
      logger.info('Webhook verificado exitosamente');
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  });
  

// ======================================================
//   Recepcion de Mensajes
// ======================================================
app.post("/webhook", async (req: Request<{}, {}, Whatsapp>, res: Response): Promise<void> => {
  
  res.sendStatus(200);

  try {
    const body: Whatsapp = req.body;
    
    if (body.entry[0].changes[0].value.contacts) { 
      const wa_id = body.entry[0].changes[0].value.contacts[0].wa_id;
      const name = body.entry[0].changes[0].value.contacts[0].profile.name;
      const messageId = body.entry[0].changes[0].value.messages?.[0]?.id || "";
      const timestamp = body.entry[0].changes[0].value.messages?.[0].timestamp || "";
      const date = new Date(Number(timestamp) * 1000);
      const content = body.entry[0].changes[0].value.messages?.[0].text?.body || "";
      const type = body.entry[0].changes[0].value.messages?.[0].type || "";

      console.log("New-Msg: ", content); //! debug

      //! Guardar logs y mensaje en la base de datos
      try {
        await appendLogEntry(body, wa_id);
      } catch (error) {
        logger.error('Error al guardar el log:', error);
      }

      saveMessage(wa_id, name, messageId, date, content, type)
        .then(() => {})
        .catch((error) => { error });

      //! Descartar mensajes que sean anteriores al inicio del webhook
      if (date < webhookStartTime) {
        console.log("Mensaje descartado por ser anterior al inicio del webhook.");
        return;
      }

      //! Enviar mensaje a Backend
      try {
        if (!URL_BACKEND) {
          logger.error('enviroment URL_BACKEND is not defined');
          throw new Error("enviroment URL_BACKEND is not defined");
        }
        await axios.post(URL_BACKEND, body, {
          headers: { 
            'Content-Type': 'application/json',
            [API_KEY_HEADER as string]: API_KEY
          }
        });
      } catch (error) {
        logger.error('Error al enviar los datos al Back-end:', error);
      }
    }
  } catch (error) {
    logger.error('Error en el procesamiento del webhook:', error);
  }
});


app.get("/webhook/health", cors(corsOptions), (_, res) => {
  var date = new Date();
  res.status(200).json({
    status: 'ok',
    message: 'API is running.',
    timestamp: date.toLocaleString(),
  });
});

app.listen(PORT, () => {
  logger.info(`Server running`);
});
