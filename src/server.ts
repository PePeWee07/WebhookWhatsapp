/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import express from "express";
import dotenv from 'dotenv';
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
app.post("/webhook", async (req, res) => {
    const messageUser = JSON.stringify(req.body, null, 2);
    
    if(messageUser.includes("contacts")) {
        //TODO: Enviar mensaje a Backend

        console.log("Incoming webhook message:", messageUser);

        // const waId = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;
    }

    // const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    // const waId = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;
    // const messageId = message.id;
    // const timestamp = message.timestamp;
    // const type = message.type;
    // const content = message.text?.body || "";

  res.sendStatus(200);
});

app.get("/", (_, res) => {
  res.send(`<h1>Server is running on port ${PORT} + HotReload</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
