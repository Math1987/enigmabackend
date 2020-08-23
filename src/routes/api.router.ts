const express = require("express");
export const routerApi = express.Router();

routerApi.get(`/`, function (req, res) {
  res.status(200).send("welcom to EnigmaJDR api.");
});
