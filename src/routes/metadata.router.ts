import { readMetaDatasDatas } from "../data/meta.data";
import { readAllPatternData } from "../data/valuesPatterns.data";

const express = require("express");
const router = express.Router();

router.get(`/`, function (req, res) {
  res.status(200).send("test");
});

router.get(`/metadatas`, (req, res) => {
  readMetaDatasDatas((metadatas) => {
    res.status(200).json(metadatas);
  });
});
router.get(`/metavalues`, (req, res) => {
  readAllPatternData((metavalues) => {
    res.status(200).json(metavalues);
  });
});

export const routerMetadata = router;