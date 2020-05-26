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

        WorldData.readWorldsDbs(function (dbs:Array<string>) {
            if ( dbs ){
                function initWorld(i){
                    if ( i < dbs.length ){
                        WorldData.buildWorld( dbs[i], {width:100,height:100},function (world) {
                            initWorld(i+1);
                        });
                    }else{
                        callBack('done');
                    }
                }
                initWorld(0);
            }else{
                WorldData.buildWorld('enigma_1', {width:100,height:100},function (world) {
                    callBack('done');
                });
            }

        });
    }

    static createCharacter(character: Player, callBack: CallableFunction){

    }

}
