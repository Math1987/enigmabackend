/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */

import express, {NextFunction, Request, Response} from 'express';
import {SocketHandler} from "./socket.handler";
import {HttpsHandler} from "./https.handler";
import {Data} from "./data/data";
import {AccountService} from "./services/account";
var bodyParser = require("body-parser");
const PORT = 4040 ;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("port", PORT);
const http = require("http").Server(app);

/**
 * set the global Access-Control-Allow-Origin for all request by default
 */
app.use(function (req: Request, res : Response, next : NextFunction) {

    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    next();

});

/**
 * init statics objects containing express app and socket to allow usage from every-where in services
 */
HttpsHandler.init(app);
SocketHandler.init(http);
/**
 * init services who will manages request corresponding to them specificityes
 */
AccountService.init();
/**
 * Init dataBase using mysqljs
 */
Data.init(function (data) {

});
/**
 * Set informations in main route.
 */
app.get('/', function (req: Request, res : Response) {
    res.send('enigma backend service.');
});

const server = http.listen(PORT, function () {
    console.log("listening on : http://localhost:" + PORT);
});


