import {
  createCharaRequest,
  addSkillRequest,
} from "./../controllers/chara.controller";

const express = require("express");
export const router = express.Router();

router.post("/create", createCharaRequest);
router.post("/addSkill", addSkillRequest);

export const routerChara = router;
