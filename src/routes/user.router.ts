import { readAccountByToken } from "./../controllers/account.controller";

const express = require("express");
export const routerUser = express.Router();

routerUser.use((req, res, next) => {
  const token = req.headers.authtoken;
  if (token) {
    readAccountByToken(token, (values) => {
      req["account"] = values;
      next();
    });
  } else {
    res.status(401).send("need token");
  }
});
