import { localStorage } from "./services/localstorage";

/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */

import express, { NextFunction, Request, Response } from "express";
import { Data } from "./data/data";
import { Worlds } from "./services/worlds";
import { indexRouter } from "./routes/index.router";
import { routerApi } from "./routes/api.router";
import { routerUser } from "./routes/user.router";
import { routerWorld } from "./routes/world.router";
import { routerChara } from "./routes/chara.router";

import { UserSocket } from "./socket/user.socket";

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

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "/ssl/localhost.key")),
    cert: fs.readFileSync(path.join(__dirname, "/ssl/localhost.crt")),
  },
  app
);
new UserSocket().init(server);

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
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", routerApi);
app.use("/api/world", routerWorld);
app.use("/api/u", routerUser);
app.use("/api/u/chara", routerChara);
app.use("/", indexRouter);

Data.init(function (data) {
  Worlds.init(function (worlds) {
    server.listen(PORT);
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
