"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerChara = void 0;
const values_data_1 = require("../data/values.data");
const chara_controller_1 = require("./../controllers/chara.controller");
const chara_controller_2 = require("./../controllers/chara.controller");
const express = require("express");
exports.routerChara = express.Router();
exports.routerChara.use("/", (req, res, next) => {
    if (req.method === "OPTIONS") {
        res.status(200).send("ok");
    }
    else {
        const tokenDatas = req.headers["userTokenValues"];
        chara_controller_1.getChara(req.headers["userTokenValues"]["world"], req.headers["userTokenValues"]["id"], (chara) => {
            req["chara"] = chara;
            req.headers["characterValuesAsObj"] = chara;
            next();
        });
        // ValuesData.readResources(tokenDatas.id, tokenDatas.world, (resValues) => {
        //   MobilesData.readById(tokenDatas.world, tokenDatas["id"], (mobile) => {
        //     if (resValues) {
        //       req.headers["characterValues"] = resValues;
        //       let valuesAsObj = {};
        //       for (let row of resValues) {
        //         valuesAsObj[row.key_] = row;
        //       }
        //       req.headers["characterValuesAsObj"] = valuesAsObj;
        //     }
        //   });
        //   next();
        // });
    }
});
exports.routerChara.post("/move", (req, res) => {
    if (req.body &&
        req.body["x"] !== null &&
        req.body["y"] !== null &&
        req["user"] &&
        req["user"]["world"] &&
        req["chara"]) {
        chara_controller_1.moveChara(req["user"]["world"], req["chara"], req.body["x"], req.body["y"], (resMover) => {
            res.status(200).send(resMover);
        });
    }
    else {
        res.status(404).send("need datas");
    }
});
exports.routerChara.post("/", (req, res) => {
    if (req.headers["characterValuesAsObj"]) {
        res.status(200).send(req.headers["characterValuesAsObj"]);
    }
    else {
        res.status(204).send(null);
    }
});
exports.routerChara.get("/values", function (req, res) {
    res.status(200).send(req.headers["characterValues"]);
});
exports.routerChara.post("/addvalue", function (req, res) {
    const tokenDatas = req.headers["userTokenValues"];
    values_data_1.ValuesData.addValue(tokenDatas.id, tokenDatas.world, req.body.key_, req.body.adder).then((addValueRes) => {
        res.status(200).send(addValueRes);
    });
});
exports.routerChara.post("/addSkill", chara_controller_1.addSkill);
exports.routerChara.post("/attack", chara_controller_2.httpAttack);
