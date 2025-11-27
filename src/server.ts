import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Whatsapp } from "./interface/WhatsAppInterface";
import axios from "axios";
import logger from "./config/logger";
import { appendLogEntry } from "./config/phoneLogger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: "https://ia-sp-backoffice.ucatolica.cue.ec",
  methods: ["GET"],
  optionsSuccessStatus: 200,
};

dotenv.config();

const app = express();
app.set("trust proxy", 1);

app.use(express.json());

const webhookStartTime = new Date();
logger.info("Iniciando la aplicación...");

const {
  WEBHOOK_VERIFY_TOKEN,
  PORT,
  URL_BACKEND_MESSAGE,
  URL_BACKEND_MESSAGE_STATUS,
  API_KEY_HEADER,
  API_KEY,
} = process.env;

// ======================================================
//   Seguridad basica
// ======================================================
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes,
  message:
    "Muchas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos",
  max: 100, // cada IP podrá hacer hasta 100 peticiones en ese período
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ======================================================
//   Verify Webhook
// ======================================================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    logger.info("Webhook verificado exitosamente");
  } else {
    res.sendStatus(403);
  }
});

// ======================================================
//   Recepcion de Mensajes
// ======================================================
app.post("/webhook", async (req: Request<{}, {}, Whatsapp>, res: Response): Promise<void> => {
  res.sendStatus(200);
    try {
      if (!req) {
        logger.error("El cuerpo de la solicitud no tiene la estructura esperada.");
        return;
      }

      const body: Whatsapp = req.body;
      const resqValue = body.entry[0].changes[0].value;
      
      if (resqValue.statuses){
        const waId = resqValue.statuses![0].recipient_id;

        //! Guardar Log (Message Status Updates)
        try {
          await appendLogEntry(body, waId);
        } catch (error) {
          logger.error("Error al guardar el log:", error);
        }

        //! Enviar mensaje a Backend
        try {
          if (!URL_BACKEND_MESSAGE_STATUS) {
            logger.error("enviroment URL_BACKEND_MESSAGE_STATUS is not defined");
            throw new Error("enviroment URL_BACKEND_MESSAGE_STATUS is not defined");
          }
          await axios.post(URL_BACKEND_MESSAGE_STATUS, body, {
            headers: {
              "Content-Type": "application/json",
              [API_KEY_HEADER as string]: API_KEY,
            },
          });
        } catch (error) {
          logger.error("Error al enviar estado del mensaje al Back-end:", error);
        }
      }

      if (resqValue.contacts) {
        const waId = resqValue.contacts![0].wa_id;
        const timestamp = resqValue.messages?.[0].timestamp || "unknown";
        const date = new Date(Number(timestamp) * 1000);
        const content = resqValue.messages?.[0].text?.body || "unknown";

        console.log("New-Msg: ", content); //! debug

        //! Guardar Log (Other Messages)
        try {
          await appendLogEntry(body, waId);
        } catch (error) {
          logger.error("Error al guardar el log:", error);
        }

        //! Descartar msj anteriores al inicio del webhook
        if (date < webhookStartTime) {
          logger.info("Mensaje descartado por ser anterior al inicio del webhook: " + body);
          return;
        }

        //! Enviar mensaje a Backend
        try {
          if (!URL_BACKEND_MESSAGE) {
            logger.error("enviroment URL_BACKEND_MESSAGE is not defined");
            throw new Error("enviroment URL_BACKEND_MESSAGE is not defined");
          }
          await axios.post(URL_BACKEND_MESSAGE, body, {
            headers: {
              "Content-Type": "application/json",
              [API_KEY_HEADER as string]: API_KEY,
            },
          });
        } catch (error) {
          logger.error("Error al enviar mensaje al Back-end:", error);
        }
      }
    } catch (error) {
      logger.error("Error en el procesamiento del webhook:", error);
    }
  }
);

app.get("/webhook/health", cors(corsOptions), (_, res) => {
  var date = new Date();
  res.status(200).json({
    status: "ok",
    message: "API is running.",
    timestamp: date.toLocaleString(),
  });
});

app.listen(PORT, () => {
  logger.info(`Server running`);
});
