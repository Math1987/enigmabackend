import { MainPatterns } from "./patterns/main.patterns";

/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */

import express, { NextFunction, Request, Response } from "express";
import { Data } from "./data/data";
import { Worlds } from "./services/worlds";
import { routerApi } from "./routes/api.router";
import { routerMetadata } from "./routes/metadata.router";
import { routerAccount } from "./routes/account.router";
import { routerUser } from "./routes/user.router";
import { routerAdmin } from "./routes/admin.router";
import { routerChara } from "./routes/chara.router";
import { UserSocket } from "./socket/user.socket";
import { environment } from "./environment/environment";

const app = express();
const PORT = 4040;
app.set("port", PORT);
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mime = require("mime");
const fs = require("fs");
const http = require("http");
const https = require("https");

console.log(environment);

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, environment.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, environment.ssl.cert)),
  },
  app
);
new UserSocket().init(server);

const morgan = require("morgan");
app.use(morgan("short"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
  } else {
    next();
  }
});

app.use("/api", routerApi);
app.use("/api/metadatas", routerMetadata);
app.use("/api/admin", routerAdmin);
app.use("/api/account", routerAccount);
app.use("/api/u", routerUser);

app.use("/api/u/chara", routerChara);

Data.init(function (data) {
  MainPatterns.init((patterns) => {
    Worlds.init(function (worlds) {
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
