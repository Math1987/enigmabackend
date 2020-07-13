import {Data} from "./data";

export class SkillsPatternsData{

    static TABLE_NAME = "skills" ;

    static init(callBack: CallableFunction){

        Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${SkillsPatternsData.TABLE_NAME}
        (
        name VARCHAR(36) PRIMARY KEY,
        user VARCHAR(36),
        user VARCHAR(36),
        value FLOAT        
        )
        `, function (res) {

        });

    }

}
