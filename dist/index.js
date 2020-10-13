"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const world_router_1 = require("./routes/world.router");
const main_patterns_1 = require("./patterns/main.patterns");
const express_1 = __importDefault(require("express"));
const data_1 = require("./data/data");
const world_controller_1 = require("./controllers/world.controller");
const api_router_1 = require("./routes/api.router");
const metadata_router_1 = require("./routes/metadata.router");
const rank_router_1 = require("./routes/rank.router");
const account_router_1 = require("./routes/account.router");
const user_router_1 = require("./routes/user.router");
const admin_router_1 = require("./routes/admin.router");
const chara_router_1 = require("./routes/chara.router");
const user_socket_1 = require("./socket/user.socket");
const environment_1 = require("./environment/environment");
/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */
const app = express_1.default();
let PORT = 4040;
app.set("port", PORT);
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const http = require("http");
const https = require("https");
console.log(environment_1.environment);
const serverHttp = http.createServer((req, res) => {
    res.writeHead(301, {
        Location: `https://${req.headers.host}${req.url}`,
    });
    res.end();
});
const serverHttps = https.createServer({
    key: fs.readFileSync(path.join(__dirname, environment_1.environment.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, environment_1.environment.ssl.cert)),
}, app);
user_socket_1.runSocket(serverHttps);
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
app.use("/api/rank", rank_router_1.routerRank);
app.use("/api/admin", admin_router_1.routerAdmin);
app.use("/api/world", world_router_1.routerWorld);
app.use("/api/account", account_router_1.routerAccount);
app.use("/api/u", user_router_1.routerUser);
app.use("/api/u/chara", chara_router_1.routerChara);
app.use(express_1.default.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
    res.sendFile(process.cwd() + "/public/index.html");
});
data_1.initData(function (data) {
    main_patterns_1.initMainPatterns((patterns) => {
        world_controller_1.initWorld((worlds) => {
            serverHttp.listen(environment_1.environment.portHttp);
            serverHttps.listen(environment_1.environment.portHttps);
            console.log("runing http on " + environment_1.environment.portHttp);
            console.log("runing https on " + environment_1.environment.portHttps);
        });
    });
});
const cron = require("node-cron");
cron.schedule("0 00 0 * * *", () => {
    world_controller_1.passWorlds((res) => { });
}, {
    sheduled: true,
    timezone: "Europe/Paris",
});


console.log('running version 0.0.7');