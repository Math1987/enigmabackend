"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerMetadata = void 0;
const meta_data_1 = require("../data/meta.data");
const valuesPatterns_data_1 = require("../data/valuesPatterns.data");
const express = require("express");
const router = express.Router();
router.get(`/`, function (req, res) {
    res.status(200).send("test");
});
router.get(`/metadatas`, (req, res) => {
    meta_data_1.readMetaDatasDatas((metadatas) => {
        res.status(200).json(metadatas);
    });
});
router.get(`/metavalues`, (req, res) => {
    valuesPatterns_data_1.readAllPatternData((metavalues) => {
        res.status(200).json(metavalues);
    });
});
exports.routerMetadata = router;
