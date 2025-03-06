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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const script_1 = __importDefault(require("./data/script"));
const dbOperations_1 = __importDefault(require("./data/dbOperations"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("./config/logger"));
const phoneLogger_1 = require("./config/phoneLogger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
logger_1.default.info('Iniciando la aplicación...');
const { WEBHOOK_VERIFY_TOKEN, PORT, URL_BACKEND, API_KEY_HEADER, API_KEY } = process.env;
// ======================================================
//   Verify Table DB
// ======================================================
(0, script_1.default)();
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
        logger_1.default.info('Webhook verificado exitosamente');
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
    var _a, _b, _c, _d, _e, _f;
    const body = req.body;
    if (body.entry[0].changes[0].value.contacts) {
        const wa_id = body.entry[0].changes[0].value.contacts[0].wa_id;
        const name = body.entry[0].changes[0].value.contacts[0].profile.name;
        const messageId = ((_b = (_a = body.entry[0].changes[0].value.messages) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id) || "";
        const timestamp = ((_c = body.entry[0].changes[0].value.messages) === null || _c === void 0 ? void 0 : _c[0].timestamp) || "";
        const date = new Date(Number(timestamp) * 1000);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        const content = ((_e = (_d = body.entry[0].changes[0].value.messages) === null || _d === void 0 ? void 0 : _d[0].text) === null || _e === void 0 ? void 0 : _e.body) || "";
        const type = ((_f = body.entry[0].changes[0].value.messages) === null || _f === void 0 ? void 0 : _f[0].type) || "";
        console.log('data: ', body); //!debug
        //! Guardar logs del mensaje
        try {
            yield (0, phoneLogger_1.appendLogEntry)(body, wa_id);
            console.log('Log guardado correctamente'); //!debug
        }
        catch (error) {
            logger_1.default.error('Error al guardar el log:', error);
        }
        //! Guardar mensaje en la base de datos
        (0, dbOperations_1.default)(wa_id, name, messageId, formattedDate, content, type)
            .then((_savedMessage) => { })
            .catch((error) => { logger_1.default.error('Error al guardar el mensaje:', error); });
        //! Enviar mensaje a Backend
        try {
            if (!URL_BACKEND) {
                logger_1.default.error('URL_BACKEND is not defined');
                throw new Error("URL_BACKEND is not defined");
            }
            yield axios_1.default.post(URL_BACKEND, body, {
                headers: {
                    'Content-Type': 'application/json',
                    [API_KEY_HEADER]: API_KEY
                }
            });
        }
        catch (error) {
            logger_1.default.error('Error al enviar los datos:', error);
        }
    }
    res.sendStatus(200);
}));
app.get("/", (_, res) => {
    res.send(`<h1>Server is running on port ${PORT}</h1>`);
});
app.listen(PORT, () => {
    logger_1.default.info(`Server is listening on port: ${PORT}`);
});
