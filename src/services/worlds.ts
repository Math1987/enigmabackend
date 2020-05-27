import {Data} from "../data/data";
import {Player} from "../models/player";
import {WorldData} from "../data/world.data";

/**
 * Manage all worlds functions
 * 1 world = 1 database
 */
export class Worlds{

    /**
     * check all worlds from databases.
     * If no world found, create a new world,
     * else, use "buildWorld" function to run
     * migration system database => if a table needed
     * doesnt exist, it will create it.
     * @param callBack
     */
    static init(callBack){

        WorldData.readWorlds(function (worlds:Array<string>) {
            if ( !(worlds && worlds.length > 0) ){
                WorldData.buildWorld({name:'world1',width:100,height:100},function (world) {
                    callBack('done');
                });
            }
        });
    }

    static createCharacter(character: Player, callBack: CallableFunction){

    }

}
