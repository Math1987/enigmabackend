import {Data} from "./data";
import {World} from "../models/world";
import {Player} from "../models/player";
import {AccountData} from "./account.data";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class WorldData{


    static TABLE_PLAYERS = `players`;
    static TABLE_POSITIONS = `positions`;

    /**
     * Init worlds dataas create the main world table if not exist,
     * and check all the existing worlds written in this main table,
     * build them. It's mean than the tables of each world will
     * be created if they not exists.
     * @param callBack: whatever...just say when work is finish.
     */
    static init(callBack:CallableFunction){
        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${Data.TABLE_WORLDS}
        (
        name VARCHAR(36) primary key,
        width INT,
        height INT,
        rounds INT
        )
        `, function (res) {
            WorldData.readWorlds(function (worlds : Array<World>) {
                function buildWorld(i){
                    if ( i < worlds.length ){
                        WorldData.buildWorld(worlds[i], function (worldRes) {
                            buildWorld(i+1);
                        });
                    }else{
                        callBack('done');
                    }
                }
                buildWorld(0);
            });
        });
    }

    /**
     * Read all actived worlds written in the main global world table.
     * eatch row contain infos as name, width, height, rounds etc...
     * @param callBack: send back and arrays of worlds
     */
    static readWorlds(callBack: CallableFunction): Array<World>{
        Data.successOrFail(`
        SELECT * FROM ${Data.TABLE_WORLDS}
        `, function (res) {
            if ( res ){
                callBack(JSON.parse(JSON.stringify(res)));
            }else{
                callBack([]);
            }
        });
    }

    /**
     * buildWorld: this function is called with a World model interface
     * to check world already exist (create all the necessary tables if not exists)
     * or create a new world, adding the name, width, height etc...
     * in the main global worlds table, then create all
     * the tables as the nameOfWorld + "_" + nameOfTable
     * @param datas
     * @param callBack
     */
    static buildWorld( datas: World, callBack: CallableFunction){

        Data.successOrFail(`
        INSERT INTO ${Data.TABLE_WORLDS}
        (name, width, height)
        VALUES ("${datas.name}", ${datas.width}, ${datas.height})
        `, function (worldInsert) {
            WorldData.buildPlayerTable(datas, function (playerRes) {
                callBack(playerRes);
            });
        });

    }
    static buildPlayerTable( datas:World, callBack: CallableFunction){
        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${WorldData.TABLE_PLAYERS}
        ( 
        id VARCHAR(36) primary key,
        name VARCHAR(36),
        race VARCHAR(36),
        religion VARCHAR(36),
        life FLOAT,
        xp INT
        )
        `, function (res) {
            callBack(res);
        });
    }


    static readChara(world_name:string, player:Player, callBack: CallableFunction){
        Data.successOrFail(`
        SELECT * FROM ${world_name}_${WorldData.TABLE_PLAYERS}
        WHERE id = ${player.id}
        `, function (charaRes) {
            callBack(charaRes);
        });
    }

    static createCharacter( world_name:string, character:{id:string,name:string,race:string,religion:string}, callBack: CallableFunction){
        Data.successOrFail(`
        INSERT INTO ${world_name}_${WorldData.TABLE_PLAYERS}
        (id, name, race, religion)
        VALUES ( "${character.id}", "${character.name}","${character.race}","${character.religion}")
        `, function (playerRes) {
            if ( playerRes ){
                Data.successOrFail(`
                UPDATE ${Data.TABLE_ACCOUNTS}
                set world = "${world_name}"
                WHERE id = "${character.id}"
                `, function(updateWorld){
                    callBack(playerRes);
                }
            }else{
                callBack(null);
            }

        });
    }
    static readCharacter( world_name:string, id:string, callBack: CallableFunction){
        Data.successOrFail(`
        SELECT * FROM ${world_name}_${WorldData.TABLE_PLAYERS}
        WHERE id = "${id}"
        `, function (playerRes) {
            if ( playerRes && playerRes.length > 0 ){
                callBack(JSON.parse(JSON.stringify(playerRes[0])));
            }else{
                callBack(null);
            }
        });
    }

}
