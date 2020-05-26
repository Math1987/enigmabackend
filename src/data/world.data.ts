import {Data} from "./data";

/**
 * This object manage all the world data.
 * Each world got him own database named as "enigma_" + nameOfMap
 */
export class WorldData{

    /**
     * To get all the active worlds of enigma,
     * read all the database and select only those
     * containing "enigma" (without enigma_accounts)
     * @param callBack: send a string array of worlds
     */
    static readWorldsDbs(callBack: CallableFunction){
        Data.successOrFail(Data.MAIN_CO,'show databases', function (res) {
            if ( res ){
                let enigmaDbs = [] ;
                for ( let row of res ){
                    if ( row['Database'] && row['Database'].includes('enigma') && row['Database'] !== Data.ACCOUNT_NAME){
                        enigmaDbs.push(row['Database']);
                    }
                }
                if ( enigmaDbs.length > 0 ){
                    callBack(JSON.parse(JSON.stringify(enigmaDbs)));
                }else{
                    callBack(null);
                }
            }else{
                callBack(null);
            }
        });
    }

    /**
     * buildWorld is called each time server launched.
     * If a table in a world db doesn't exist, create it.
     * @param worldName: the database world name
     * @param datas: the datas of world as width, height, squeletons etc...
     * @param callBack: send back null if fail
     */
    static buildWorld(worldName:string, datas : {width:number, height:number}, callBack ){
        Data.successOrFail( Data.MAIN_CO, `create database if not exists ${worldName}`, function (res) {

            let mysql = require('mysql');
            Data.WORLDS_CO[`${worldName}`] = mysql.createConnection({
                host: Data.HOST,
                user: Data.USER,
                password: Data.PASSWORD,
                database: `${worldName}`
            });
            WorldData.createWorld_WorldTable(`${worldName}`,datas,function (playsersRes) {
                WorldData.createWorld_playerTable(`${worldName}`,function (playsersRes) {
                    callBack(res);
                });
            });

        })
    }

    /**
     *
     * @param db_name
     * @param datas: used to initialize a row in world table if not exist
     * @param callBack: send null if fail ;
     */
    static createWorld_WorldTable( db_name:string, datas, callBack:CallableFunction){
        Data.successOrFail(Data.WORLDS_CO[db_name], `
            CREATE TABLE IF NOT EXISTS ${Data.WORLD_TABLE_NAME}(
            name VARCHAR(36),
            width INT,
            height INT,
            round INT,
            squeletons FLOAT,
            trees FLOAT
        )
        `, function (res) {

            Data.successOrFail(Data.WORLDS_CO[db_name],`SELECT * FROM ${Data.WORLD_TABLE_NAME}`, function (dataRes) {
                if ( !(dataRes && dataRes.length > 0) ){
                    Data.successOrFail(Data.WORLDS_CO[db_name],`
                    INSERT INTO ${Data.WORLD_TABLE_NAME}
                    (name, width, height, round, squeletons, trees)
                    VALUES ("${db_name}",${datas.width},${datas.height},1,0.01,0.01)
                    `, function (end){
                        callBack('done');
                    });
                }else{
                    callBack('done');
                }
            });

        });
    }

    /**
     * This table contain all user information in world.
     * As name, id (to get more information of account, you must call
     * the global account db),
     * and character infos as race, religion etc...
     * @param db_name
     * @param callBack: whatever...we don't care. Just tell when work is finish
     */
    static createWorld_playerTable( db_name:string, callBack:CallableFunction){
        Data.successOrFail(Data.WORLDS_CO[db_name], `
            CREATE TABLE IF NOT EXISTS ${Data.PLAYER_TABLE_NAME}(
            user_id VARCHAR(36),
            user_name VARCHAR(36),
            chara_id VARCHAR(36),
            chara_name VARCHAR(36),
            race VARCHAR(36),
            xp INT,
            life FLOAT
        )
        `, function (res) {
            callBack(res);
        });

    }



}
