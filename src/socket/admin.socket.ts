import { getOnPositions } from "../controllers/world.controller";
import { getPattern } from "../patterns/main.patterns";

const initAdminSocket = (socket) => {

    console.log('run admin socket connection');
    let worldName = "world1" ;
    socket.join(worldName);

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

    socket.on("move", (x, y, callback) => {
       //socket.emit('move', x, y, test=>{});
    });

};

export { initAdminSocket };