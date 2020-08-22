import { ModelPattern } from "./model.pattern";
import { getWorld } from "../controllers/world.controller";
import { readCharaById, updateCharaPosition } from "../data/player.data";
import {
  sendToNear,
  updateSocketAccountChara,
} from "../controllers/socket.controller";

export class Player extends ModelPattern {
  constructor() {
    super();
  }
  readKey() {
    return "player";
  }
  move(
    world_name: string,
    id: number,
    x: number,
    y: number,
    callback: Function
  ) {
    readCharaById(world_name, id, (chara) => {
      console.log(chara);
      let moveCost = Math.abs(x) + Math.abs(y);
      let newX = chara["position"]["x"] + x;
      let newY = chara["position"]["y"] + y;
      getWorld(world_name, (world) => {
        if (
          chara["move"] >= moveCost &&
          newX >= -world.width / 2 &&
          newX <= world.width / 2 &&
          newY >= -world.height / 2 &&
          newY <= world.height / 2
        ) {
          updateCharaPosition(world_name, id, newX, newY, (updateRes) => {
            if (updateRes) {
              chara["position"]["x"] = newX;
              chara["position"]["y"] = newY;

              sendToNear(
                world_name,
                { x: chara["position"]["x"], y: chara["position"]["y"] },
                8,
                "move",
                chara,
                (moveRes) => {
                  updateSocketAccountChara(world_name, chara);

                  callback(true);
                }
              );
            } else {
              callback(null);
            }
            console.log(updateRes);
          });
        } else {
          callback(false);
        }
      });
    });
  }
  create(world_name, id, callback) {}
}
