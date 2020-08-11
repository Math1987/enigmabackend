import {Data} from "./data";
import {World} from "../models/world";


const TABLE_NAME = "mobiles" ;
/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class MobilesData{


    static buildMobileDatas( datas:World, callBack: CallableFunction){
        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${TABLE_NAME}
        ( 
        id VARCHAR(36) primary key,
        image_key VARCHAR(36), 
        position POINT
        )
        `, function (res) {
            console.log(res);
            callBack(res);
        });
    }

}
