"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const { WEBHOOK_VERIFY_TOKEN, PORT } = process.env;
// ======================================================
//   Verify Webhook
// ======================================================
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    }
    else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});
// ======================================================
//   Recepcion de Mensajes
// ======================================================
app.post("/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messageUser = JSON.stringify(req.body, null, 2);
    if (messageUser.includes("contacts")) {
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
}));
app.get("/", (_, res) => {
    res.send(`<h1>Server is running on port ${PORT}</h1>`);
});
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
