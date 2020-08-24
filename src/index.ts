import { routerWorld } from "./routes/world.router";
import { initMainPatterns } from "./patterns/main.patterns";
import express from "express";
import { initData } from "./data/data";
import { initWorld, passWorlds } from "./controllers/world.controller";
import { routerApi } from "./routes/api.router";
import { routerMetadata } from "./routes/metadata.router";
import { routerRank } from "./routes/rank.router";
import { routerAccount } from "./routes/account.router";
import { routerUser } from "./routes/user.router";
import { routerAdmin } from "./routes/admin.router";
import { routerChara } from "./routes/chara.router";
import { runSocket } from "./socket/user.socket";
import { environment } from "./environment/environment";
/**
 * Index.ts is the presentation page
 * init static handlers for exress and socket
 * divised in services as AccountService.
 * init the database with Data
 */

const app = express();
const PORT = 4040;
app.set("port", PORT);
const path = require("path");
var bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const https = require("https");

console.log(environment);

const server = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, environment.ssl.key)),
    cert: fs.readFileSync(path.join(__dirname, environment.ssl.cert)),
  },
  app
);

runSocket(server);

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

app.get("", (req, res) => {
  res.status(200).send("OK");
});

app.use("/api", routerApi);
app.use("/api/metadatas", routerMetadata);
app.use("/api/rank", routerRank);
app.use("/api/admin", routerAdmin);
app.use("/api/world", routerWorld);
app.use("/api/account", routerAccount);
app.use("/api/u", routerUser);
app.use("/api/u/chara", routerChara);

initData(function (data) {
  initMainPatterns((patterns) => {
    initWorld((worlds) => {
      server.listen(PORT);
    });
  });
});

const cron = require("node-cron");
cron.schedule(
  "0 00 0 * * *",
  () => {
    passWorlds((res) => {});
  },
  {
    sheduled: true,
    timezone: "Europe/Paris",
  }
);
