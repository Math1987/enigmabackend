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
    static createMobile( world_name: string, id : string, draw_key : string, x, y, callBack ){

        const position = `POINT(${x},${y})`;

        Data.successOrFail(`
        INSERT INTO ${world_name}_${TABLE_NAME}
        (id, image_key, position)
        VALUES
        ("${id}", "${draw_key}", ${position})
        `, function (res) {
            console.log(res);
            callBack(res);
        });


    }
    static readByPositions( world_name: string, positions : {x: number, y:number}[], callBack){

        let posRequete = '';
        for (let p of positions) {
            if (posRequete.length > 0) {
                posRequete += ','
            }
            posRequete += `POINT(${p.x},${p.y})`;
        }

        console.log(world_name);
        console.log(posRequete);

        Data.successOrFail(`
        SELECT * FROM ${world_name}_${TABLE_NAME}
        WHERE position IN (${posRequete})
        `, function (res) {
            if ( res ){
                callBack(JSON.parse(JSON.stringify(res)));
            }else{
                callBack(null);
            }
        });


    }

}
