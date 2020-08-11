"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerChara = void 0;
const values_data_1 = require("../data/values.data");
const express = require('express');
exports.routerChara = express.Router();
exports.routerChara.use('/', (req, res, next) => {
    if (req.method === "OPTIONS") {
        res.status(200).send('ok');
    }
    else {
        const tokenDatas = req.headers['userTokenValues'];
        values_data_1.ValuesData.readResources(tokenDatas.id, tokenDatas.world, (resValues) => {
            if (resValues) {
                req.headers['characterValues'] = resValues;
                let valuesAsObj = {};
                for (let row of resValues) {
                    valuesAsObj[row.key_] = row;
                }
                req.headers['characterValuesAsObj'] = valuesAsObj;
            }
            next();
        });
    }
});
exports.routerChara.post('/', (req, res) => {
    if (req.headers['characterValuesAsObj']) {
        res.status(200).send(req.headers['characterValuesAsObj']);
    }
    else {
        res.status(204).send(null);
    }
});
exports.routerChara.get('/values', function (req, res) {
    res.status(200).send(req.headers['characterValues']);
});
exports.routerChara.post('/addvalue', function (req, res) {
    const tokenDatas = req.headers['userTokenValues'];
    values_data_1.ValuesData.addValue(tokenDatas.id, tokenDatas.world, req.body.key_, req.body.adder).then(addValueRes => {
        res.status(200).send(addValueRes);
    });
});
exports.routerChara.post('/addSkill', function (req, res) {
    const tokenDatas = req.headers['userTokenValues'];
    const values = req.headers['characterValuesAsObj'];
    if (tokenDatas && values && req.body.adder && req.body.key_) {
        if (values[req.body.key_] && values['addskills'] && values['addskills'].value && values['addskills'].value >= req.body.adder) {
            let skillVal = values['addskills'].value - req.body.adder;
            let valNewVal = values[req.body.key_].value + req.body.adder;
            values_data_1.ValuesData.updateValues(tokenDatas.id, tokenDatas.world, [
                { key_: 'addskills', value: skillVal },
                { key_: req.body.key_, value: valNewVal }
            ]).then(addValueRes => {
                let obj = { addskills: skillVal };
                obj[req.body.key_] = valNewVal;
                res.status(200).send(obj);
            });
        }
    }
    else {
        res.status(204).send('not found');
    }
});
