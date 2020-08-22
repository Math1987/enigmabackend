import { confirmEmail } from "./../controllers/email.controller";
import { AccountData } from "../data/account.data";
import { HttpsHandler } from "../https.handler";
import { MetaData } from "../data/meta.data";
import { Security } from "../services/security";
import { routerUser } from "./user.router";
import { ValuesPatternsData } from "../data/valuesPatterns.data";
import { sendWelcomEmail } from "../controllers/email.controller";

const express = require("express");
export const routerApi = express.Router();

routerApi.get(`/`, function (req, res) {
  res.status(200).send("test");
});

routerApi.get(`/metadatas`, function (req, res) {
  MetaData.readMetaDatas(function (metadatas) {
    res.status(200).json(metadatas);
  });
});
routerApi.get(`/metavalues`, function (req, res) {
  ValuesPatternsData.readAll(function (metavalues) {
    res.status(200).json(metavalues);
  });
});

routerApi.get("/user", function (req: Request, res: Response) {
  const token = req.headers.authorization;
  if (token) {
    Security.checkToken(token, function (userRes) {
      if (userRes) {
        res.status(200).json(userRes);
      } else {
        res.status(401).json("token invalid");
      }
    });
  } else {
    res.status(401).json("no token");
  }
});

routerApi.get("/refreshToken", function (req: Request, res: Response) {
  const token = req.headers.authorization;
  if (token) {
    Security.checkToken(token, function (userRes) {
      if (userRes) {
        Reflect.deleteProperty(userRes, "exp");
        Reflect.deleteProperty(userRes, "iat");
        const newToken = Security.createToken(userRes);

        res.status(200).json(newToken);
      } else {
        res.status(401).json("wrong token");
      }
    });
  } else {
    res.status(403).json("no token to refresh!");
  }
});

routerApi.post("/newToken", function (req: Request, res: Response) {
  const token = req.headers.authorization;
  if (token) {
    Security.checkToken(token, function (userRes) {
      if (userRes) {
        if (req.body.world) {
          userRes["world"] = req.body.world;
        }
        Reflect.deleteProperty(userRes, "exp");
        Reflect.deleteProperty(userRes, "iat");
        const newToken = Security.createToken(userRes);

        res.status(200).json(newToken);
      } else {
        res.status(401).json("wrong token");
      }
    });
  } else {
    res.status(403).json("no token to refresh!");
  }
});
