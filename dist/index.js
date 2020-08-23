"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_patterns_1 = require("./patterns/main.patterns");
/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */
const express_1 = __importDefault(require("express"));
const data_1 = require("./data/data");
const worlds_1 = require("./services/worlds");
const api_router_1 = require("./routes/api.router");
const metadata_router_1 = require("./routes/metadata.router");
const account_router_1 = require("./routes/account.router");
const user_router_1 = require("./routes/user.router");
const admin_router_1 = require("./routes/admin.router");
const chara_router_1 = require("./routes/chara.router");
const user_socket_1 = require("./socket/user.socket");
const environment_1 = require("./environment/environment");
const app = express_1.default();
const PORT = 4040;
app.set("port", PORT);
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mime = require("mime");
const fs = require("fs");
const http = require("http");
const https = require("https");
console.log(environment_1.environment);
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, environment_1.environment.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, environment_1.environment.ssl.cert)),
}, app);
new user_socket_1.UserSocket().init(server);
const morgan = require("morgan");
app.use(morgan("short"));
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
//app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.status(200).send("");
    }
    else {
        next();
    }
});
app.use("/api", api_router_1.routerApi);
app.use("/api/metadatas", metadata_router_1.routerMetadata);
app.use("/api/admin", admin_router_1.routerAdmin);
app.use("/api/account", account_router_1.routerAccount);
app.use("/api/u", user_router_1.routerUser);
app.use("/api/u/chara", chara_router_1.routerChara);
data_1.Data.init(function (data) {
    main_patterns_1.MainPatterns.init((patterns) => {
        worlds_1.Worlds.init(function (worlds) {
            server.listen(PORT);
        });
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
// let test = ecnrypt(JSON.stringify(values));
// console.log(test);
