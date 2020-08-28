import { io } from "./../socket/user.socket";
import { readCharaValue, readCharaById } from "../data/player.data";
import { readChara } from "./chara.controller";

const getSocketsNear = (world_name, x, y, rayon, callBack) => {
  io.in(world_name).clients((err, clients) => {
    let targets = {};

    for (let socketID of clients) {
      let targetSocket = io["sockets"]["connected"][socketID];
      if (targetSocket["chara"]) {
        let targetPos = {
          x: targetSocket["chara"]["position"].x,
          y: targetSocket["chara"]["position"].y,
        };

        if (
          targetPos.x >= x - rayon &&
          targetPos.x <= x + rayon &&
          targetPos.y >= y - rayon &&
          targetPos.y <= y + rayon
        ) {
          targets[socketID] = targetSocket;
        }
      }
    }

    callBack(targets);
  });
};
const sendToNear = (
  world_name,
  position,
  rayon,
  emitAttribute,
  emitValues,
  callBack
) => {
  io.in(world_name).clients((err, clients) => {
    let targets = {};

    for (let socketID of clients) {
      let targetSocket = io["sockets"]["connected"][socketID];
      if (targetSocket["account"]) {
        let targetPos = {
          x: targetSocket["account"]["chara"]["position"].x,
          y: targetSocket["account"]["chara"]["position"].y,
        };

        if (
          targetPos.x >= position.x - rayon &&
          targetPos.x <= position.x + rayon &&
          targetPos.y >= position.y - rayon &&
          targetPos.y <= position.y + rayon
        ) {
          console.log("sendnear", emitAttribute, emitValues);
          targets[socketID] = targetSocket;
          targets[socketID].emit(emitAttribute, emitValues);
        }
      }
    }

    callBack(targets);
  });
};
const sendToSocketId = (world_name, id, emitAttribute, emiteObj, callback) => {
  io.in(world_name).clients((err, clients) => {
    let targets = {};

    for (let socketID of clients) {
      let targetSocket = io["sockets"]["connected"][socketID];
      if (
        targetSocket["account"] &&
        targetSocket["account"]["chara"] &&
        targetSocket["account"]["chara"]["id"] === id
      ) {
        targets[socketID] = targetSocket;
        targets[socketID].emit(emitAttribute, emiteObj);
        callback(targets);
        break;
      }
    }
  });
};
const updateSocketAccountChara = (world_name, chara) => {
  io.in(world_name).clients((err, clients) => {
    let targets = {};

    for (let socketID of clients) {
      let targetSocket = io["sockets"]["connected"][socketID];
      if (
        targetSocket["account"] &&
        targetSocket["account"]["chara"] &&
        targetSocket["account"]["chara"]["id"] === chara["id"]
      ) {
        readChara(world_name, chara["id"], (newChara) => {
          if (newChara) {
            targetSocket["account"]["chara"] = newChara;
          }
        });

        break;
      }
    }
  });
};

export { getSocketsNear, sendToNear, sendToSocketId, updateSocketAccountChara };
