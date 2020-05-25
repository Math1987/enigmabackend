"use strict";
/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_handler_1 = require("./socket.handler");
const https_handler_1 = require("./https.handler");
const data_1 = require("./data/data");
const account_1 = require("./services/account");
var bodyParser = require("body-parser");
const PORT = 4040;
const app = express_1.default();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("port", PORT);
const http = require("http").Server(app);
/**
 * set the global Access-Control-Allow-Origin for all request by default
 */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
/**
 * init statics objects containing express app and socket to allow usage from every-where in services
 */
https_handler_1.HttpsHandler.init(app);
socket_handler_1.SocketHandler.init(http);
/**
 * init services who will manages request corresponding to them specificityes
 */
account_1.AccountService.init();
/**
 * Init dataBase using mysqljs
 */
data_1.Data.init(function (data) {
});
/**
 * Set informations in main route.
 */
app.get('/', function (req, res) {
    res.send('enigma backend service.');
});
const server = http.listen(PORT, function () {
    console.log("listening on : http://localhost:" + PORT);
});
