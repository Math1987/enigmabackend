"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const values_data_1 = require("../data/values.data");
const express = require('express');
exports.routerChara = express.Router();
exports.routerChara.get('/values', function (req, res) {
    console.log('getting values');
    console.log(req.headers['userTokenValues']);
    const tokenDatas = req.headers['userTokenValues'];
    values_data_1.ValuesData.readResources(tokenDatas.id, tokenDatas.world, (resValues) => {
        console.log(resValues);
        res.status(200).send(resValues);
    });
});
