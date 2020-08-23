"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerChara = exports.router = void 0;
const chara_controller_1 = require("./../controllers/chara.controller");
const express = require("express");
exports.router = express.Router();
exports.router.post("/create", chara_controller_1.createCharaRequest);
exports.router.post("/addSkill", chara_controller_1.addSkillRequest);
exports.routerChara = exports.router;
