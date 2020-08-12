import { MobilesData } from "./../data/mobile.data";
import { ValuesData } from "../data/values.data";
import { getChara, moveChara } from "./../controllers/chara.controller";

const express = require("express");
export const routerChara = express.Router();

routerChara.use("/", (req: Request, res: Response, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).send("ok");
  } else {
    const tokenDatas = req.headers["userTokenValues"];

    getChara(
      req.headers["userTokenValues"]["world"],
      req.headers["userTokenValues"]["id"],
      (chara) => {
        req["chara"] = chara;
        req.headers["characterValuesAsObj"] = chara;
        next();
      }
    );

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

routerChara.post("/move", (req: Request, res: Response) => {
  if (
    req.body &&
    req.body["x"] !== null &&
    req.body["y"] !== null &&
    req["user"] &&
    req["user"]["world"] &&
    req["chara"]
  ) {
    moveChara(
      req["user"]["world"],
      req["chara"],
      req.body["x"],
      req.body["y"],
      (resMover) => {
        res.status(200).send(resMover);
      }
    );
  } else {
    res.status(404).send("need datas");
  }
});

routerChara.post("/", (req: Request, res: Response) => {
  if (req.headers["characterValuesAsObj"]) {
    res.status(200).send(req.headers["characterValuesAsObj"]);
  } else {
    res.status(204).send(null);
  }
});

routerChara.get("/values", function (req: Request, res: Response) {
  res.status(200).send(req.headers["characterValues"]);
});

routerChara.post("/addvalue", function (req: Request, res: Response) {
  const tokenDatas = req.headers["userTokenValues"];
  ValuesData.addValue(
    tokenDatas.id,
    tokenDatas.world,
    req.body.key_,
    req.body.adder
  ).then((addValueRes) => {
    res.status(200).send(addValueRes);
  });
});

routerChara.post("/addSkill", function (req: Request, res: Response) {
  const tokenDatas = req.headers["userTokenValues"];
  const values = req.headers["characterValuesAsObj"];
  if (tokenDatas && values && req.body.adder && req.body.key_) {
    if (
      values[req.body.key_] &&
      values["addskills"] &&
      values["addskills"].value &&
      values["addskills"].value >= req.body.adder
    ) {
      let skillVal = values["addskills"].value - req.body.adder;
      let valNewVal = values[req.body.key_].value + req.body.adder;

      ValuesData.updateValues(tokenDatas.id, tokenDatas.world, [
        { key_: "addskills", value: skillVal },
        { key_: req.body.key_, value: valNewVal },
      ]).then((addValueRes) => {
        let obj = { addskills: skillVal };
        obj[req.body.key_] = valNewVal;

        res.status(200).send(obj);
      });
    }
  } else {
    res.status(204).send("not found");
  }
});
