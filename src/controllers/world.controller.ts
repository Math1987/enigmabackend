import { readWorldData, buildWorldData, initWorldData, readWorldsData, updateWorldConstantData } from "./../data/world.data";
import { readCharasByPositions } from "./../data/player.data";
import { getGroundsOnPositions } from "./grounds.controller";
import { passPatterns, updateValueInPattern } from "../patterns/main.patterns";
import { readSqueletonByPositions } from "../data/squeleton.data";
import { insertClanData } from "../data/clan.data";

const initWorld = (callback) =>{
  readWorldsData( (worlds: Array<string>) => {
    if (!(worlds && worlds.length > 0)) {
      createWorld('world1', 100, 100, world => {
        callback("done");
      });
    } else {
      callback("done");
    }
  });
});
const createWorld = (worldName:string, width:number, height:number, callback) => {

  buildWorldData( { name: worldName, width: width, height: height }, world => {

    insertClanData( worldName, "clan1", "blue", null, res => {
      insertClanData( worldName, "clan2", "red", null, res => {
        callback('done');
      });
    });
    
  });

}

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
const passWorldRequest = (req, res) => {
  if ( req.query['world'] ){
    passWorld(req.query['world'], passRes => {
      if ( passRes ){
        res.status(200).send(passRes);
      }else{
        res.status(401).send('err');
      }
    })
  }else{
    res.status(401).send('need a name');
  }
}

const getWorld = (world_name, callback) => {
  readWorldData(world_name, callback);
};
const passWorld = (worldName, callback) => {
  readWorldData( worldName, world => {

    if ( world ){

      passPatterns(world, patternsRes=>{
        callback('done');
      });  

    }else{
      callback(null);
    }


  })
}
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


const updateWorldValueRequest = (req, res) => {

  if ( req.body && req.body['worldName'] && req.body['target'] && req.body['key'] && req.body['value'] ){

    updateValueInPattern(req.body['worldName'], req.body['target'], req.body['key'], req.body['value'], resPattern => {

      res.status(200).send(resPattern);

    });

  }else{
    res.status(401).send({ err : 'need datas'});
  }


}
const updateWorldConstantRequest = (req, res ) => {

  console.log('update world constant request', req.body);
  if ( req.body && req.body['worldName']  && req.body['key']  && req.body['value']){

    readWorldData(req.body['worldName'], world => {

      if ( world ){

        updateWorldConstantData( world['name'], req.body['key'], req.body['value'], upRes => {

          res.status(200).send(upRes);

        });

      }else{

        res.status(401).send('err');
        
      }

    });

  }else{

    res.status(401).send('err');

  }

}

export {
   initWorld,
   getOnPositions, 
   getWorld, 
   passWorlds, 
   getWorldsRequest,
   passWorldRequest,
   updateWorldValueRequest,
   updateWorldConstantRequest
 };
