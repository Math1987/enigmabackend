import { MainPatterns } from './../patterns/main.patterns';
import { updateAccountWorldData } from './../data/account.data';


import { insertCharaData, addValues, readCharaValues } from './../data/player.data';
import { io } from "./../socket/user.socket";
import { readPlayerPatternData } from '../data/patternPlayer';



const createChara = (world_name:string, datas : {}, callback )=>{



  if ( datas['sexe'] && datas['race'] ){
    datas['key_'] = `${datas['race']}${datas['sexe']}`;
  }
  readPlayerPatternData(datas['key_'], patternPlayer => {
    if ( patternPlayer ){
      let finalObj = {} ;
      Object.assign(finalObj, patternPlayer, datas);
      insertCharaData(world_name, finalObj, ( chara ) => {
        if ( chara ){
          let pattern = MainPatterns.getPattern(finalObj['key_']);
          console.log('look for pattern', finalObj['key_']);
          if ( pattern ){
            console.log('pattern found for', finalObj['key_'], pattern);
            pattern.move(world_name, finalObj['id'], 0, 0, moveRes =>{
              console.log('move done');
            });
          }
        }
        console.log(chara);
          callback(chara);
      });
    }else{
      callback(null);
    }

  });


}
const getCharasOnPositions = (world_name:string, positions : {x:number,y:number}[], callback )=>{
  callback(null) ;
}
const moveChara = (world_name: string, chara : {}, x:number, y:number,callBack){

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
const addSkill = (req: Request, res: Response) => {

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
export { createChara, getCharasOnPositions, moveChara, addSkill};


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

        updateAccountWorldData( req["account"]['id'], "world1", accountRes => {
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
