import { ModelPattern } from "./model.pattern";
import { getWorld } from "../controllers/world.controller";
import { readCharaById } from "../data/player.data";

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
        console.log(world);

        if (
          chara["move"] >= moveCost &&
          newX >= -world.width / 2 &&
          newX <= world.width / 2
        ) {
          callback(true);
        } else {
          callback(false);
        }
      });
    });
  }
  create(world_name, id, callback) {}
}
