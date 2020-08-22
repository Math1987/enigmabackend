import { AccountData, updateAccountWorld } from './../data/account.data';
import { getMobile } from './mobile.controler';
import { ValuesPatternsData } from './../data/valuesPatterns.data';
import { getSocketsNear, sendToNear } from './socket.controller';
import { PlayerData, addValue, readCharaValue, addValues, readCharaValues } from './../data/player.data';
import { MobilesData } from "./../data/mobile.data";
import { ValuesData } from "./../data/values.data";
import { io } from "./../socket/user.socket";
import { Calculation } from '../data/calcul.data';
import {attack} from "./attack.controller";
 
export const getChara = (world_name, id, callBack) => {
  let chara = {};

  PlayerData.readCharaAsObj(world_name, id, (player)=>{
    if ( player ){
    ValuesData.readAsObject(world_name, id, (values) => {
      if (values) {
          MobilesData.readById(world_name, id, (mobile) => {

            Object.assign(chara, player, values, mobile);
            callBack(chara);
          });
        } else {
          callBack(null);
        }
      });
    }else{
      callBack(null);
    }
  });

};
export const createChara = (world_name:string, datas : {}, callback )=>{

  if ( datas['sexe'] && datas['race'] ){
    datas['key_'] = `${datas['race']}${datas['sexe']}`;
  }

  PlayerData.createCharacter(world_name, datas, ( chara ) => {
      callback(chara);
  });

}
export const getCharasOnPositions = (world_name:string, positions : {x:number,y:number}[], callback )=>{

  

  callback(null) ;

}


export const createCharaRequest = (req: Request, res: Response) => {
  if (
    req['account'] && 
    req['account']['id'] &&
    !req['account']['chara'] &&
    req.body &&
    req.body.name &&
    req.body.race &&
    req.body.religion
  ) {

    let objFinal = {} ;
    Object.assign(objFinal, req.body, req['account'] );

    createChara("world1", objFinal, (chara) => {

      if (chara) {

        updateAccountWorld( req["account"]['id'], "world1", accountRes => {
          console.log('chara created succesfully');
          res.status(200).send(chara);
        });

      } else {
        res.status(401).json("erreur de création du personnage");
      }
    });
  } else {
    res.status(401).send("need correct datas");
  }
}

export const addSkillRequest = (req: Request, res: Response ) => {

  if ( 
    req['account'] && 
    req['account']['world'] && 
    req['account']['id'] && 
    req['account']['chara'] && 
    req.body && 
    req.body['key'] && 
    req.body['adder'] 
  ){

    if ( req['account']['chara']['xp'] >= req.body['adder'] ){

      let obj = {} ;
      obj[req.body['key']] = req.body['adder'] ;
      obj['xp'] = -req.body['adder'];

      addValues( req['account']['world'], req['account']['id'], obj, resUpdate => {

        if ( resUpdate ){
  
          readCharaValues(req['account']['world'], req['account']['id'], [ req.body['key'], 'xp'], values => {
            if ( values){
              res.status(200).send(values);
            }else{
              res.status(200).send(null);
            }
  
          });
  
  
        }else{
          res.status(501).send('error adding value');
        }
  
      });

    }else{
      res.status(401).send('not enought xp');
    }



  }else{
    res.status(401).send('need key and value');
  }

}



export const moveChara = (world_name: string, chara : {}, x:number, y:number,callBack){

  if ( world_name && chara ){
    
    let position = chara['position'];
    MobilesData.updatePosition(world_name, chara['id'], position.x + x, position.y + y, (resMove)=>{

      if ( resMove ){
        let newPosition = {x : position.x + x, y : position.y + y} ;
        chara['position']['x'] = newPosition.x;
        chara['position']['y'] = newPosition.y;

        io.in(world_name).clients( (err, clients ) => {

          for ( let socketID of clients ){
            let targetSocket = io['sockets']['connected'][socketID] ;
              if ( targetSocket['chara']){
            
              let targetPos = {x: targetSocket['chara']['position'].x, y: targetSocket['chara']['position'].y} ;

              if ( targetPos.x >= newPosition.x - 5 && targetPos.x <= newPosition.x + 5 
                && targetPos.y >= newPosition.y -5 && targetPos.y <= newPosition.y + 5 ){

                  let sender = {
                    id : chara['id'],
                    key : chara['key_'],
                    life : chara['life'],
                    life_max : chara['life_max'],
                    x : chara['position']['x'],
                    y : chara['position']['y'],
                    z : 1
                  }            
                  targetSocket.emit('move', sender, x, y)
                  callBack(newPosition);

                }
              }
            }                      

        });

      }else{
        callBack(null);
      }
    });
  }
}

export const addSkill = (req: Request, res: Response) => {

  const user = req["user"];
  const values = req["chara"];

  if (user && values && req.body['adder'] && req.body['key_']) {

    if (
      values[req.body['key_']] &&
      values["addskills"] &&
      values["addskills"] &&
      values["addskills"] >= req.body['adder']
    ) {

      let skillVal = values["addskills"] - req.body['adder'];
      let valNewVal = values[req.body['key_']] + req.body['adder'];

      ValuesData.updateValues(user.id, user.world, [
        { key_: "addskills", value: skillVal },
        { key_: req.body['key_'], value: valNewVal },
      ]).then((addValueRes) => {

        let obj = { addskills: skillVal };
        obj[req.body['key_']] = valNewVal;

        res.status(200).send(obj);
      });
    }
  } else {
    res.status(204).send("not found");
  }
}

export const popsChara = (world_name, chara, callBack)=>{

  ValuesPatternsData.read('player', (playerPattern) =>{

  
  });
}


export const httpAttack = (req: Request, res: Response) => {
  const user = req["user"];
  const chara = req["chara"];
  const userFinal = {};
  Object.assign(userFinal, user, chara);

  if (req.body && req.body["target"]) {

    getMobile(user["world"], req.body["target"]["id"], (target) => {


      attack(user['world'], userFinal, target, (resAttack) =>{

          if ( resAttack ){
            res.status(200).send(resAttack);
          }

      });
    });



  } else {
    res.status(204).send("not found");
  }
};