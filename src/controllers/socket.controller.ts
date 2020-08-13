import { io } from "./../socket/user.socket";

export const getSocketsNear = (world_name, x, y, rayon, callBack) => {
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

export const sendToNear = (
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
      if (targetSocket["chara"]) {
        let targetPos = {
          x: targetSocket["chara"]["position"].x,
          y: targetSocket["chara"]["position"].y,
        };

        if (
          targetPos.x >= position.x - rayon &&
          targetPos.x <= position.x + rayon &&
          targetPos.y >= position.y - rayon &&
          targetPos.y <= position.y + rayon
        ) {
          targets[socketID] = targetSocket;
          targets[socketID].emit(emitAttribute, emitValues);
        }
      }
    }

    callBack(targets);
  });
};
