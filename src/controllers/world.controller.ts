import { readWorldData } from "./../data/world.data";
import { readCharasByPositions } from "./../data/player.data";
import { getGroundsOnPositions } from "./grounds.controller";

const getOnPositions = (
  world_name,
  positions: { x: number; y: number }[],
  callback
) => {
  let newPos = [];
  getGroundsOnPositions(world_name, positions, (grounds) => {
    for (let ground of grounds) {
      newPos.push(ground);
    }
    readCharasByPositions(world_name, positions, (charas) => {
      if (charas && charas.length > 0) {
        for (let chara of charas) {
          newPos.push(chara);
        }
      }
      callback(newPos);
    });
  });
};
const getWorld = (world_name, callback) => {
  readWorldData(world_name, callback);
};
export { getOnPositions, getWorld };