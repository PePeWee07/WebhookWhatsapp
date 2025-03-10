import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import { Whatsapp } from "./interface/WhatsAppInterface";
import createMessagesTable from "./data/script";
import saveMessage from "./data/dbOperations";
import axios from 'axios';
import logger from "./config/logger";
import { appendLogEntry } from './config/phoneLogger';

dotenv.config();

const app = express();
app.use(express.json());

const webhookStartTime = new Date();
logger.info('Iniciando la aplicación...');

const { WEBHOOK_VERIFY_TOKEN, PORT, URL_BACKEND, API_KEY_HEADER, API_KEY } = process.env;

// ======================================================
//   Verify Table DB
// ======================================================
createMessagesTable();

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
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
      const content = body.entry[0].changes[0].value.messages?.[0].text?.body || "";
      const type = body.entry[0].changes[0].value.messages?.[0].type || "";

      console.log("content: ", content); //! debug

      //! Guardar logs y mensaje en la base de datos
      try {
        await appendLogEntry(body, wa_id);
      } catch (error) {
        logger.error('Error al guardar el log:', error);
      }

      saveMessage(wa_id, name, messageId, formattedDate, content, type)
        .then(() => {})
        .catch((error) => { logger.error('Error al guardar el mensaje:', error) });

      //! Descartar mensajes que sean anteriores al inicio del webhook
      if (date < webhookStartTime) {
        console.log("Mensaje descartado por ser anterior al inicio del webhook.");
        return;
      }

      //! Enviar mensaje a Backend
      try {
        if (!URL_BACKEND) {
          logger.error('URL_BACKEND is not defined');
          throw new Error("URL_BACKEND is not defined");
        }
        await axios.post(URL_BACKEND, body, {
          headers: { 
            'Content-Type': 'application/json',
            [API_KEY_HEADER as string]: API_KEY
          }
        });
      } catch (error) {
        logger.error('Error al enviar los datos:', error);
      }
    }
  } catch (error) {
    logger.error('Error en el procesamiento del webhook:', error);
  }
});

app.get("/", (_, res) => {
  res.send(`<h1>Server is running on port ${PORT}</h1>`);
});

app.listen(PORT, () => {
  logger.info(`Server is listening on port: ${PORT}`);
});
