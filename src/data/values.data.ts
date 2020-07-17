import {Data} from "./data";
import {World} from "../models/world";
import {ValuesPatternsData} from "./valuesPatterns.data";

/**
 * This object manage all the world data.
 * Each world got tables named as: nameOfWorld + "_" + nameOfTable
 */
export class ValuesData{


    static TABLE_VALUES = `values`;

    static buildTable( datas:World, callBack: CallableFunction){
        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${datas.name}_${ValuesData.TABLE_VALUES}
        ( 
        id VARCHAR(36),
        key_ VARCHAR(36),
        value FLOAT,
        primary key (id, key_)
        )
        `, function (res) {
            callBack(res);
        });
    }

    static createFromPattern(id:string, pattern:string, world_name:string, callBack: CallableFunction){


        ValuesPatternsData.read('player',(resourcePattern) =>{

            let reqString = '' ;
            for ( let resource of resourcePattern ){
                reqString += `("${id}","${resource.key_}", ${resource.start})` ;
                if ( resourcePattern[resourcePattern.length-1] !== resource ){
                    reqString += ", " ;
                }
            }

            Data.successOrFail(`
            INSERT INTO ${world_name}_${this.TABLE_VALUES}
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
        SELECT * FROM ${world_name}_${ValuesData.TABLE_VALUES}
        WHERE id = "${id}"
        `, function (res) {
            if ( res && res.length > 0 ){
                callBack(JSON.parse(JSON.stringify(res)));
            }else{
                callBack(null);
            }
        });

    }

    static addValue(id:string, world_name:string, key_ : string, adder : number ){
        return new Promise<any>( (resolve, reject) =>{

            Data.successOrFail(`
            
           UPDATE ${world_name}_${ValuesData.TABLE_VALUES}
           SET value = value + ${adder}
           WHERE id = "${id}" AND key_ = "${key_}"
            `, res => {
                if ( res ){
                    resolve(true);
                }else{
                    reject();
                }
            });

        } );
    }
    static updateValues(id:string, world_name:string, keysAdds : {key_:string, value:number}[] ){

        let vals = `` ;
        for ( let row of keysAdds ){
            vals += `("${id}","${row.key_}", ${row.value})` ;
            if ( row !== keysAdds[keysAdds.length-1]){
                vals += ',' ;
            }
        }
        return new Promise<any>( (resolve, reject) =>{
            Data.successOrFail(`
               INSERT INTO ${world_name}_${ValuesData.TABLE_VALUES} (id, key_, value)
               VALUES ${vals}
               ON DUPLICATE KEY UPDATE value=VALUES(value) 
            `, res => {
                if ( res ){
                    resolve(true);
                }else{
                    reject();
                }
            });

        } );
    }
}