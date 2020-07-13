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
const data_1 = require("./data/data");
const worlds_1 = require("./services/worlds");
const index_router_1 = require("./routes/index.router");
const api_router_1 = require("./routes/api.router");
const user_router_1 = require("./routes/user.router");
const world_router_1 = require("./routes/world.router");
const chara_router_1 = require("./routes/chara.router");
const app = express_1.default();
const PORT = 4040;
app.set("port", PORT);
const path = require('path');
var bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mime = require('mime');
const fs = require('fs');
const http = require("http");
const https = require("https");
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    next();
});
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use('/api', api_router_1.routerApi);
app.use('/api/world', world_router_1.routerWorld);
app.use('/api/u', user_router_1.routerUser);
app.use('/api/u/chara', chara_router_1.routerChara);
app.use('/', index_router_1.indexRouter);
data_1.Data.init(function (data) {
    worlds_1.Worlds.init(function (worlds) {
    });
});
/*http.createServer((req, res) =>{
    console.log('http server');
    console.log({
        host: req.headers.host,
        url : req.url
    });
    res.writeHead('301', {Location: `https://${req.headers.host}${req.url}`});
    res.end();
}).listen(4000);*/
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '/ssl/localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '/ssl/localhost.crt')),
}, app);
server.listen(PORT);
