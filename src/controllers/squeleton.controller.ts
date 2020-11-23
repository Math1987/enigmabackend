import { insertSqueletonData, readAllSqueletonsData } from "../data/squeleton.data";
import { getWorld } from "./world.controller";

const passSqueletons = (worldDatas : Object, callback) => {

    const numberOfSqueletons = 2 ;
    console.log('pass squeleton', worldDatas);
    
    readAllSqueletonsData( worldDatas['name'], squeletons => {

        console.log('squeletons found', squeletons) ;
        let actualSqueletons = squeletons.length | 0 ;
    
        const createSqueleton = () => {

            insertSqueletonData(worldDatas['name'], {
                x : 1,
                y : 1,
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
