import {Data} from "./data";
import {World} from "../models/world";
import {ValuesPatternsData} from "./valuesPatterns.data";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class ValuesData{


    static TABLE_RESOURCE = `values`;

    static buildTable( datas:World, callBack: CallableFunction){
        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${ValuesData.TABLE_RESOURCE}
        ( 
        id VARCHAR(36),
        key_ VARCHAR(36),
        value FLOAT,
        skill FLOAT,
        primary key (id, key_)
        )
        `, function (res) {
            callBack(res);
        });
    }

    static createFromPattern(id:string, pattern:string, world_name:string, callBack: CallableFunction){


        ValuesPatternsData.read('player',(resourcePattern) =>{

            console.log('read resources pattenrs')
            console.log(resourcePattern);

            let reqString = '' ;
            for ( let resource of resourcePattern ){
                reqString += `("${id}","${resource.name}", ${resource.start})` ;
                if ( resourcePattern[resourcePattern.length-1] !== resource ){
                    reqString += ", " ;
                }
            }

            Data.successOrFail(`
            INSERT INTO ${world_name}_${this.TABLE_RESOURCE}
            (id, key_, value)
            VALUES
            ${reqString}
            `, function ( res) {
                callBack(res);
            });

        });

    }

    static readResources(id:string, world_name: string, callBack: CallableFunction){

        Data.successOrFail(`
        SELECT * FROM ${world_name}_${ValuesData.TABLE_RESOURCE}
        WHERE id = "${id}"
        `, function (res) {
           callBack(JSON.parse(JSON.stringify(res)));
        });

    }
}
