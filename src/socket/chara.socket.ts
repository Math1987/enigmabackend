import { attack } from "./../controllers/attack.controller";
import { getOnPositions } from "../controllers/world.controller";
import { getPattern } from "../patterns/main.patterns";

const initCharaSocket = (socket, account) => {
  const id = account["id"];
  const world_name = account["world"];
  const key = account["chara"]["key_"];
  const pattern = getPattern(key);

  if (pattern) {
    socket.on("getOnPositions", (positions: [], callback) => {
      getOnPositions(account["world"], positions, callback);
    });

    socket.on("move", (x, y, callback) => {
      pattern.move(world_name, id, x, y, false, callback);
    });

    socket.on("attack", (targetId, callback) => {
      pattern.attack(world_name, id, targetId, callback);
    });
  }
};

export { initCharaSocket };
