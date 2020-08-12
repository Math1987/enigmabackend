"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerUser = void 0;
const chara_controller_1 = require("./../controllers/chara.controller");
const mobile_data_1 = require("./../data/mobile.data");
const localstorage_1 = require("./../services/localstorage");
const security_1 = require("../services/security");
const express = require("express");
exports.routerUser = express.Router();
exports.routerUser.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.status(200).send("");
    }
    else {
        const token = req.headers.authorization;
        if (token) {
            security_1.Security.checkToken(token, function (userRes) {
                if (userRes) {
                    req.headers["userTokenValues"] = userRes;
                    req["user"] = userRes;
                    next();
                }
                else {
                    res.status(401).json("token invalid");
                }
            });
        }
        else {
            res.status(401).send("need token");
        }
    }
});
exports.routerUser.get("/datas", function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                res.status(200).json(userRes);
            }
            else {
                res.status(401).json("token invalid");
            }
        });
    }
    else {
        res.status(401).json("no token");
    }
});
exports.routerUser.post("/createChara", function (req, res) {
    if (req.body &&
        req.body.name &&
        req.body.race &&
        req.body.religion &&
        req.body.id) {
        console.log("createChara");
        chara_controller_1.createChara("world1", req.body, (chara) => {
            if (chara) {
                console.log(chara);
                res.status(200).send(chara);
            }
            else {
                console.log("err");
                res.status(401).json("erreur de création du personnage");
            }
        });
        // PlayerData.createCharacter("world1", req.body, function (chara) {
        //   if (chara) {
        //     MobilesData.createMobile(
        //       "world1",
        //       chara.id,
        //       "elf",
        //       0,
        //       0,
        //       100,
        //       (resMobile) => {
        //         chara = req.body;
        //         chara["world"] = "world1";
        //         res.status(200).send(chara);
        //       }
        //     );
        //   } else {
        //     res.status(401).json("erreur de création du personnage");
        //   }
        // });
    }
    else {
        res.status(401).send("need correct datas");
    }
});
exports.routerUser.post("/getViews", (req, res) => {
    let datas = req.headers["userTokenValues"];
    if (req.body && req.body.cases && datas && datas["world"]) {
        let worldDatas = JSON.parse(localstorage_1.localStorage.getItem(datas["world"]));
        if (worldDatas) {
            let cash = [];
            mobile_data_1.MobilesData.readByPositions(datas["world"], req.body.cases, (resMobile) => {
                for (let pos of req.body.cases) {
                    if (pos.x >= -worldDatas.width / 2 &&
                        pos.x <= worldDatas.width / 2 &&
                        pos.y >= -worldDatas.height / 2 &&
                        pos.y <= worldDatas.height / 2) {
                        cash.push({ key: "floor", x: pos.x, y: pos.y, z: 0 });
                    }
                }
                if (resMobile && resMobile.length > 0) {
                    for (let mob of resMobile) {
                        let mobToDraw = {
                            id: mob.id,
                            key: mob.key_,
                            x: mob.position.x,
                            y: mob.position.y,
                            z: 2,
                        };
                        cash.push(mobToDraw);
                    }
                }
                res.status(200).send(cash);
            });
        }
        else {
            res.status(401).send("no world data found");
        }
    }
    else {
        res.status(401).send("need datas");
    }
});
/*routerUser.post('/chara', function (req: Request, res : Response) {
    const tokenDatas = req.headers['userTokenValues'] ;
    PlayerData.readCharacter(tokenDatas.world, req.body.id, function (chara) {
        if ( chara ){
            res.status(200).json(chara) ;
        }else{
            res.status(204).json('chara non trouvé');
        }
    });
});*/
