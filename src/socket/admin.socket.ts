import { getOnPositions } from "../controllers/world.controller";
import { getPattern } from "../patterns/main.patterns";

const initAdminSocket = (socket) => {
  const id = account["id"];

  let worldName = null ;

    socket.on("switchWorld", (world, callback) => {
        console.log('switch world', world);
        worldName = world ;
        callback(true);
    });


    socket.on("getOnPositions", (positions: [], callback) => {
        if ( worldName){
            getOnPositions(worldName, positions, callback);
        }else{
            callback('need world name');
        }

    });

};

export { initAdminSocket };