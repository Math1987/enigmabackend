import { insertSqueletonData, readAllSqueletonsData } from "../data/squeleton.data";
import { getWorld } from "./world.controller";

const passSqueletons = (worldDatas : Object, callback) => {

    const density = 0.025 ;
    const numberOfSqueletons = Math.floor(density*(worldDatas['width']*worldDatas['height'])) ;
    console.log('number of squeleton', worldDatas, numberOfSqueletons);
    
    readAllSqueletonsData( worldDatas['name'], squeletons => {

        console.log('squeletons found', squeletons) ;
        let actualSqueletons = squeletons.length | 0 ;
    
        const createSqueleton = () => {

            let random = Math.floor(Math.random()*worldDatas['width']*worldDatas['height']);
            let randomPos = {
                x : Math.floor(random%worldDatas['width']),
                y : Math.floor(random/worldDatas['height'])
            }


            insertSqueletonData(worldDatas['name'], {
                x : randomPos.x,
                y : randomPos.y,
                life : 50,
                life_max : 50,
                skill_defense : 10,
                skill_attack : 10
            }, createRes => {
                actualSqueletons++;
                if ( actualSqueletons < numberOfSqueletons ){
                    createSqueleton();
                }else{
                    callback(true);
                }
            });
        }
        createSqueleton();

    });

}

export { passSqueletons };
