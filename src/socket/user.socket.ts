import { ValuesData } from './../data/values.data';
import { MobilesData } from './../data/mobile.data';
import { Security } from './../services/security';
import {HttpBase} from "http";
import {Socket} from "socket.io";

export class UserSocket{

  io : WebSocket = null ;

  constructor(){}

  init(http){

    this.io = require("socket.io")(http);


    
    this.io.on("connection", (socket: Socket)=> {

        if ( socket.handshake.query['token'] != null ){
        Security.checkToken( socket.handshake.query['token'], (user)=>{
        

          if ( user && user['world'] ){

            socket['enigma'] = {} ;

            ValuesData.readAsObject( user['world'], user['id'],( values) => {

              if ( values && values['moves'] && values['moves'] > 0 ){
                socket['enigma'] = values ;
                socket['enigma']['id']= user['id'];

                MobilesData.readById(    user['world'], user['id'], mobile => {

                            if (mobile) {
                                socket['enigma']['key'] = mobile.key_ ;
                                socket['enigma']['life'] = mobile.life ;
                                socket['enigma']['x'] = mobile.position.x ;
                                socket['enigma']['y'] = mobile.position.y ;

                            }
                        }
                    );

              }
            }




            socket.join(user['world']);

            socket.on('message', (message)=>{
     
            })
      
            

            socket.on('move', (x,y)=>{

              console.log('move asked');

              if ( socket['enigma']){
    
                let position = socket['enigma'];
                MobilesData.updatePosition(user['world'], user['id'], position.x + x, position.y + y, (resMove)=>{

                  if ( resMove ){
                    let newPosition = {x : position.x + x, y : position.y + y} ;
                    socket['enigma']['x'] = newPosition.x;
                    socket['enigma']['y'] = newPosition.y;

                    this.io.in(user['world']).clients( (err, clients ) => {

                      for ( let socketID of clients ){
                        let targetSocket = this.io['sockets']['connected'][socketID] ;
                          if ( targetSocket['enigma']){
                        
                          let targetPos = {x: targetSocket['enigma'].x, y: targetSocket['enigma'].y} ;
       
                          if ( targetPos.x >= newPosition.x - 5 && targetPos.x <= newPosition.x + 5 
                            && targetPos.y >= newPosition.y -5 && targetPos.y <= newPosition.y + 5 ){

                              let sender = {
                                id : socket['enigma']['id'],
                                key : socket['enigma']['key'],
                                life : socket['enigma']['life'],
                                x : socket['enigma']['x'],
                                y : socket['enigma']['y'],
                                z : 1
                              }            
                              targetSocket.emit('move', sender, x, y)
                            }
                          }
                        }                      
                      }
         
                    });

                  }
                });
              }


            
      
            });
    
          }


          socket.on('disconnect', ()=>{
    
          });

        });
      }
    });
  }

}

