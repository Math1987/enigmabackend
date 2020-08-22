import { getWorld } from "./world.controller";

export const getGroundsOnPositions = (world_name, positions, callback) => {
  getWorld(world_name, (world) => {
    let grounds = [];
    for (let pos of positions) {
      if (
        pos.x >= -world.width / 2 &&
        pos.x <= world.width / 2 &&
        pos.y >= -world.height / 2 &&
        pos.y <= world.height / 2
      ) {
        grounds.push({ x: pos.x, y: pos.y, key: "desert" });
      }
    }
    callback(grounds);
  });
};
