import { readWorldData, buildWorldData, initWorldData, readWorldsData } from "./../data/world.data";
import { readCharasByPositions } from "./../data/player.data";
import { getGroundsOnPositions } from "./grounds.controller";
import { passPatterns } from "../patterns/main.patterns";
import { readSqueletonByPositions } from "../data/squeleton.data";

const initWorld = (callback) =>{
  readWorldsData( (worlds: Array<string>) => {
    if (!(worlds && worlds.length > 0)) {
      buildWorldData({ name: "world1", width: 100, height: 100 }, world => {
        callback("done");
      });
    } else {
      callback("done");
    }
  });
});

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
      readSqueletonByPositions(world_name, positions, squeletons => {
        if (squeletons && squeletons.length > 0) {
          for (let squeleton of squeletons) {
            newPos.push(squeleton);
          }
        }
        callback(newPos);
      });
    });
  });
};

const getWorldsRequest = (req, res) => {
  readWorldsData( worlds => {
    if ( worlds ){
      res.status(200).send(worlds);
    }else{
      res.status(404).send(null);
    }
  });
}

const getWorld = (world_name, callback) => {
  readWorldData(world_name, callback);
};
const passWorlds = (callback) =>{
  readWorldsData( worlds => {
    console.log('pass worlds', worlds);
    for ( let world of worlds ){
      passPatterns(world, patternsRes=>{
        callback('done');
      });
    }

  })

}


export { initWorld, getOnPositions, getWorld, passWorlds, getWorldsRequest };
