"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_data_1 = require("../data/resource.data");
const express = require('express');
exports.routerChara = express.Router();
exports.routerChara.get('/resources', function (req, res) {
    console.log('getting resources');
    console.log(req.headers['userTokenValues']);
    const tokenDatas = req.headers['userTokenValues'];
    resource_data_1.ResourceData.readResources(tokenDatas.id, tokenDatas.world, (resResources) => {
        console.log(resResources);
        res.status(200).send(resResources);
    });
});
