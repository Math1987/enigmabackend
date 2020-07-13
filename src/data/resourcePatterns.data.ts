import {Data} from "./data";

export class ResourcePatternsData{

    static TABLE_NAME = "ressourcePatterns" ;

    static init(callBack: CallableFunction){

        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${ResourcePatternsData.TABLE_NAME}
        (
        name VARCHAR(36) PRIMARY KEY,
        user VARCHAR(36),
        
        start FLOAT,
        skill_start FLOAT      
        )
        `, function (res) {
            ResourcePatternsData.initValues(function (end) {
                callBack(end);
            })
        });

    }

    static initValues(callBack: CallableFunction){

        let values = [

            {
                name: "water",
                user : "player",
                start : 10,
                skill_start : 10
            },
            {
                name: "food",
                user : "player",
                start : 10,
                skill_start : 10
            },
            {
                name: "faith",
                user : "player",
                start : 10,
                skill_start : 10
            },
            {
                name: "wood",
                user : "player",
                start : 10,
                skill_start : 10
            }


        ];

        let valString = '' ;
        for ( let row of values ){
            if ( valString.length > 0 ){
                valString += ', ' ;
            }
            valString += `("${row.name}","${row.user}","${row.start}","${row.skill_start}")`
        }

        Data.successOrFail(`
            INSERT INTO ${ResourcePatternsData.TABLE_NAME}
            (name, user, start, skill_start)
            VALUES ${valString}
        `, function (res ) {
            callBack(res);
        });

    }

    static read(key:string, callback:CallableFunction){

        Data.successOrFail(`
            SELECT * FROM ${ResourcePatternsData.TABLE_NAME}
            WHERE user = "${key}"
        `, (res) =>{
            callback(JSON.parse(JSON.stringify(res)));
        })


    }

}
