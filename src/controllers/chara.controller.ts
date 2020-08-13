import { getChara } from './chara.controller';
import { PlayerData } from './../data/player.data';
import { MobilesData } from "./../data/mobile.data";
import { ValuesData } from "./../data/values.data";
import { io } from "./../socket/user.socket";

export const getChara = (world_name, id, callBack) => {
  let chara = {};

  PlayerData.readCharaAsObj(world_name, id, (player)=>{


    if ( player ){
  
    ValuesData.readAsObject(world_name, id, (values) => {
      if (values) {
    
          MobilesData.readById(world_name, id, (mobile) => {

            Object.assign(chara, player, values, mobile);
            
            console.log(chara);
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

export const createChara = (world_name:string, datas : {}, callBack )=>{

  PlayerData.createCharacter("world1", datas, function (chara) {
    if (chara) {
      MobilesData.createMobile(
        "world1",
        chara.id,
        "elf",
        0,
        0,
        100,
        (resMobile) => {

          chara = datas ;
          chara["world"] = world_name;
          console.log(chara);
          getChara(world_name, chara['id'], ( charaRes )=>{
            if ( charaRes ){
              console.log(charaRes);
              moveChara(world_name, charaRes, 0,0, (moveRes) => {
              });
            }

          });

          callBack(chara);
        }
      );
    } else {
      callBack(null);
    }
  });

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
                console.log(targetSocket['chara']);
            
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
          }

        });

      }else{
        callBack(null);
      }
    });
  }
}

export const addSkill = ((req: Request, res: Response) => {

  const user = req["user"];
  const values = req["chara"];

  if (user && values && req.body['adder'] && req.body['key_']) {
    console.log('value add');
    if (
      values[req.body['key_']] &&
      values["addskills"] &&
      values["addskills"] &&
      values["addskills"] >= req.body['adder']
    ) {
      console.log('value add2');
      let skillVal = values["addskills"] - req.body['adder'];
      let valNewVal = values[req.body['key_']] + req.body['adder'];

      ValuesData.updateValues(user.id, user.world, [
        { key_: "addskills", value: skillVal },
        { key_: req.body['key_'], value: valNewVal },
      ]).then((addValueRes) => {
        console.log(addValueRes);
        let obj = { addskills: skillVal };
        obj[req.body['key_']] = valNewVal;

        res.status(200).send(obj);
      });
    }
  } else {
    res.status(204).send("not found");
  }
}


// routerChara.post("/addSkill", function (req: Request, res: Response) {
//   const tokenDatas = req.headers["userTokenValues"];
//   const values = req.headers["characterValuesAsObj"];
//   if (tokenDatas && values && req.body.adder && req.body.key_) {
//     if (
//       values[req.body.key_] &&
//       values["addskills"] &&
//       values["addskills"].value &&
//       values["addskills"].value >= req.body.adder
//     ) {
//       let skillVal = values["addskills"].value - req.body.adder;
//       let valNewVal = values[req.body.key_].value + req.body.adder;

//       ValuesData.updateValues(tokenDatas.id, tokenDatas.world, [
//         { key_: "addskills", value: skillVal },
//         { key_: req.body.key_, value: valNewVal },
//       ]).then((addValueRes) => {
//         let obj = { addskills: skillVal };
//         obj[req.body.key_] = valNewVal;

//         res.status(200).send(obj);
//       });
//     }
//   } else {
//     res.status(204).send("not found");
//   }
// });