import { getPattern } from "./../patterns/main.patterns";
import { updateAccountWorldData } from "./../data/account.data";
import {
  insertCharaData,
  addCharaValuesData,
  readCharaValues,
  readCharaById,
} from "./../data/player.data";
import { readPlayerPatternData } from "../data/patternPlayer";
import { readHistoricData } from "../data/historic.data";
import { readHistoric2 } from "./historic.controller";
import { endianness } from "os";

const createChara = (world_name: string, datas: {}, callback) => {
  console.log('create chara', datas);
  if (datas["sexe"] && datas["race"]) {
    datas["key_"] = `${datas["race"]}${datas["sexe"]}`;
  }
  readPlayerPatternData(datas["key_"], (patternPlayer) => {
    if (patternPlayer) {
      let finalObj = {};
      Object.assign(finalObj, patternPlayer, datas);
      insertCharaData(world_name, finalObj, (chara) => {
        if (chara) {
          let pattern = getPattern(finalObj["key_"]);
          if (pattern) {
            pattern.move(
              world_name,
              finalObj["id"],
              0,
              0,
              true,
              (moveRes) => {}
            );
          }
        }
        callback(chara);
      });
    } else {
      callback(null);
    }
  });
};
const getCharasOnPositions = (
  world_name: string,
  positions: { x: number; y: number }[],
  callback
) => {
  callback(null);
};
const readChara = (world_name: string, id: string, callback: Function) => {
  readCharaById(world_name, id, (charaRes) => {
    // readHistoricData(world_name, id, (historic) => {
    //   if (charaRes) {
    //     charaRes["historic"] = historic;
    //   }
    //   callback(charaRes);
    // });
    readHistoric2(world_name, id, res => {

      const charaPattern = getPattern(charaRes['key_']);

      const end = () => {
        callback(charaRes);
      }

      if ( res ){

        let i = 0 ;
        let messages = [] ;
        const addMessage = () =>{
          if ( i < res.length ){

            charaPattern.writeHistoric(world_name, res[i], 'fr', resMessage => {
              messages.push(resMessage);
              i ++ ;
              addMessage();
            })
          }else{
            charaRes['historic'] = messages ;
            end();
          }

        }
        addMessage();

      }else{

        end();
        
      }
      

    });
  });
};


const readCharas = (world_name: string, ids: string[], callback: Function) => {
  let i = 0;
  let arr = [];
  let func = () => {
    readChara(world_name, ids[i], (res) => {
      arr.push(res);
      if (i < ids.length - 1) {
        i++;
        func();
      } else {
        callback(arr);
      }
    });
  };
  func();
};

export { createChara, getCharasOnPositions, readChara, readCharas, addSkill };

const addSkill = (req: Request, res: Response) => {
  const user = req["user"];
  const values = req["chara"];

  if (user && values && req.body["adder"] && req.body["key_"]) {
    if (
      values[req.body["key_"]] &&
      values["addskills"] &&
      values["addskills"] &&
      values["addskills"] >= req.body["adder"]
    ) {
      let skillVal = values["addskills"] - req.body["adder"];
      let valNewVal = values[req.body["key_"]] + req.body["adder"];

      ValuesData.updateValues(user.id, user.world, [
        { key_: "addskills", value: skillVal },
        { key_: req.body["key_"], value: valNewVal },
      ]).then((addValueRes) => {
        let obj = { addskills: skillVal };
        obj[req.body["key_"]] = valNewVal;

        res.status(200).send(obj);
      });
    }
  } else {
    res.status(204).send("not found");
  }
};
export const createCharaRequest = (req: Request, res: Response) => {
  console.log('createCharaRequest', req.body);
  if (
    req["account"] &&
    req["account"]["id"] &&
    !req["account"]["chara"] &&
    req.body &&
    req.body.name &&
    req.body.race &&
    req.body.religion
  ) {
    let objFinal = {};
    Object.assign(objFinal, req.body, req["account"]);
    createChara("world1", objFinal, (chara) => {
      if (chara) {
        updateAccountWorldData(req["account"]["id"], "world1", (accountRes) => {
          readCharaById("world1", objFinal["id"], (newChara) => {
            res.status(200).send({ chara: newChara });
          });
        });
      } else {
        res.status(401).json("erreur de création du personnage");
      }
    });
  } else {
    res.status(401).send("need correct datas");
  }
};
export const addSkillRequest = (req: Request, res: Response) => {
  if (
    req["account"] &&
    req["account"]["world"] &&
    req["account"]["id"] &&
    req["account"]["chara"] &&
    req.body &&
    req.body["key"] &&
    req.body["adder"]
  ) {
    if (req["account"]["chara"]["xp"] >= req.body["adder"]) {
      let obj = {};
      obj[req.body["key"]] = req.body["adder"];
      obj["xp"] = -req.body["adder"];

      addCharaValuesData(
        req["account"]["world"],
        req["account"]["id"],
        obj,
        (resUpdate) => {
          if (resUpdate) {
            readCharaValues(
              req["account"]["world"],
              req["account"]["id"],
              [req.body["key"], "xp"],
              (values) => {
                if (values) {
                  res.status(200).send(values);
                } else {
                  res.status(200).send(null);
                }
              }
            );
          } else {
            res.status(501).send("error adding value");
          }
        }
      );
    } else {
      res.status(401).send("not enought xp");
    }
  } else {
    res.status(401).send("need key and value");
  }
};
