import {Data} from "./data";
import {World} from "../models/world";
import {Player} from "../models/player";
import {AccountData} from "./account.data";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class SkillsData{


    static TABLE_SKILLS_NAME = `skills`;

    static init(callBack: CallableFunction){
        Data.successOrFail(`
        `, (res) =>{

        });
    }


    static buildTable( datas:World, callBack: CallableFunction){
        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${SkillsData.TABLE_SKILLS_NAME}
        ( 
        id VARCHAR(36) primary key,
        key_ VARCHAR(36),
        value FLOAT
        )
        `, function (res) {
            callBack(res);
        });
    }
}
