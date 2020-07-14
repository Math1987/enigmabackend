"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const values_data_1 = require("../data/values.data");
const express = require('express');
exports.routerChara = express.Router();
exports.routerChara.get('/values', function (req, res) {
    const tokenDatas = req.headers['userTokenValues'];
    values_data_1.ValuesData.readResources(tokenDatas.id, tokenDatas.world, (resValues) => {
        res.status(200).send(resValues);
    });
});
exports.routerChara.post('/addvalue', function (req, res) {
    console.log(req.body);
    const tokenDatas = req.headers['userTokenValues'];
    values_data_1.ValuesData.addValue(tokenDatas.id, tokenDatas.world, req.body.key_, req.body.adder).then(res => {
        console.log(res);
    });
    res.status(200).send(null);
});
