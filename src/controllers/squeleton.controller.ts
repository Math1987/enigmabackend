import { insertSqueletonData, insertSqueletonsData, readAllSqueletonsData } from "../data/squeleton.data";
import { getNeutralZoneSize, NEUTRAL_ZONE_SIZE } from "./grounds.controller";
import { getWorld } from "./world.controller";

const passSqueletons = (worldDatas : Object, callback) => {

    const width = parseInt(worldDatas['width']);
    const height = parseInt(worldDatas['height']);
    const density = 0.01 ;
    const numberOfSqueletons = Math.floor(density*(width*height-Math.pow(getNeutralZoneSize(),2))) ;
    console.log('number of squeleton', width, height, numberOfSqueletons);
    
    readAllSqueletonsData( worldDatas['name'], squeletons => {

        console.log('squeletons found', squeletons.length) ;
        let actualSqueletons = squeletons.length | 0 ;

        let squeletonsCreate = [] ;
        while ( actualSqueletons + squeletonsCreate.length  < numberOfSqueletons ){

            let random = Math.floor(Math.random()*width*height);
            let px =  -width/2 + Math.floor(random%width) ;
            let py = -height/2 + Math.floor(random/height) ;
            if ( px >= - NEUTRAL_ZONE_SIZE/2 ){
                px += NEUTRAL_ZONE_SIZE ;
            }
            if ( py >= - NEUTRAL_ZONE_SIZE/2 ){
                py += NEUTRAL_ZONE_SIZE ;
            }
            console.log('squeleton', px, py);
            squeletonsCreate.push({
                x : px,
                y : py,
                life : 50,
                life_max : 50,
                skill_defense : 10,
                skill_attack : 10
            });

        }
        console.log('squeletons to create', squeletonsCreate.length);
        if ( squeletonsCreate.length > 0 ){
            insertSqueletonsData(worldDatas['name'], squeletonsCreate, callback);
        }else{
            callback(true);
        }

    
        // const createSqueleton = () => {



        //     let randomPos = {
        //         x : px,
        //         y : py
        //     }


        //     insertSqueletonData(worldDatas['name'], {
        //         x : randomPos.x,
        //         y : randomPos.y,
        //         life : 50,
        //         life_max : 50,
        //         skill_defense : 10,
        //         skill_attack : 10
        //     }, createRes => {
        //         actualSqueletons++;
        //         if ( actualSqueletons < numberOfSqueletons ){
        //             createSqueleton();
        //         }else{
        //             callback(true);
        //         }
        //     });
        // }
        // createSqueleton();

    });

}

export { passSqueletons };
