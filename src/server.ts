import express, { Request, Response } from "express";
import dotenv from 'dotenv';
import { Whatsapp } from "./interface/WhatsAppInterface";
dotenv.config();

const app = express();
app.use(express.json());

const { WEBHOOK_VERIFY_TOKEN, PORT } = process.env;

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
      console.log("Webhook verified successfully!");
    } else {
      // respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  });
  

// ======================================================
//   Recepcion de Mensajes
// ======================================================
app.post("/webhook", async (req: Request<{}, {}, Whatsapp>, res: Response) => {

    const body: Whatsapp = req.body;
    
    if(body.entry[0].changes[0].value.contacts){ 
        //TODO: Enviar mensaje a Backend

        console.log("Incoming webhook message:", body.entry[0].changes[0]);

        //wa_id
        const wa_id = body.entry[0].changes[0].value.contacts[0].wa_id;
        //name
        const name = body.entry[0].changes[0].value.contacts[0].profile.name;
        //message_id
        const messageId = body.entry[0].changes[0].value.messages?.[0]?.id || "";
        //timestamp
        const timestamp = body.entry[0].changes[0].value.messages?.[0].timestamp || "";
        const date = new Date(Number(timestamp) * 1000);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        //content
        const content = body.entry[0].changes[0].value.messages?.[0].text?.body || "";
        //type
        const type = body.entry[0].changes[0].value.messages?.[0].type || "";

        console.log("datos:", wa_id, name, messageId, formattedDate, content, type);
    }

  res.sendStatus(200);
});

app.get("/", (_, res) => {
  res.send(`<h1>Server is running on port ${PORT}</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
