"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternPlayer = void 0;
const data_1 = require("./data");
class PatternPlayer {
    static init(callBack) {
        data_1.Data.successOrFail(`
        DROP TABLE PatternPlayer
        `, function (res) { });
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS PatternPlayer
        (
          key_ VARCHAR(36) primary key,

          life FLOAT,
          life_max FLOAT,
  
          water FLOAT,
          food FLOAT, 
          faith FLOAT, 
          wood FLOAT,
  
          skill_water FLOAT, 
          skill_food FLOAT,
          skill_faith FLOAT,
          skill_wood FLOAT, 
          skill_attack FLOAT,
          skill_defense FLOAT,
  
          xp FLOAT,
          move INT,
          move_max INT,
          action INT,
          action_max INT
  
        )
        `, function (res) {
            PatternPlayer.initValues(function (end) {
                callBack(end);
            });
        });
    }
    static initValues(callBack) {
        let valString = `(
      "humanmasculin",
      100,
      100,

      20,
      20,
      20,
      20,

      10,
      10,
      10,
      10,
      10,
      10,

      50,
      20,
      20,
      8,
      8
      ),`;
        valString += `(
        "humanfeminine",
        100,
        100,
  
        20,
        20,
        20,
        20,
  
        10,
        10,
        10,
        10,
        10,
        10,
  
        50,
        20,
        20,
        8,
        8
        ),`;
        valString += `(
        "dwarfmasculin",
        100,
        100,
  
        20,
        20,
        20,
        20,
  
        10,
        10,
        10,
        10,
        10,
        10,
  
        50,
        20,
        20,
        8,
        8
        ),`;
        valString += `(
          "dwarffeminine",
          100,
          100,
    
          20,
          20,
          20,
          20,
    
          10,
          10,
          10,
          10,
          10,
          10,
    
          50,
          20,
          20,
          8,
          8
          ),`;
        valString += `(
          "elfmasculin",
          100,
          100,
    
          20,
          20,
          20,
          20,
    
          10,
          10,
          10,
          10,
          10,
          10,
    
          50,
          20,
          20,
          8,
          8
          ),`;
        valString += `(
            "elffeminine",
            100,
            100,
      
            20,
            20,
            20,
            20,
      
            10,
            10,
            10,
            10,
            10,
            10,
      
            50,
            20,
            20,
            8,
            8
            ),`;
        valString += `(
            "vampiremasculin",
            100,
            100,
      
            20,
            20,
            20,
            20,
      
            10,
            10,
            10,
            10,
            10,
            10,
      
            50,
            20,
            20,
            8,
            8
            ),`;
        valString += `(
              "vampirefeminine",
              100,
              100,
        
              20,
              20,
              20,
              20,
        
              10,
              10,
              10,
              10,
              10,
              10,
        
              50,
              20,
              20,
              8,
              8
              )`;
        data_1.Data.successOrFail(`
            INSERT INTO PatternPlayer
            (
              key_,

              life,
              life_max,
      
              water,
              food, 
              faith, 
              wood,
      
              skill_water, 
              skill_food,
              skill_faith,
              skill_wood, 
              skill_attack,
              skill_defense,
      
              xp,
              move,
              move_max,
              action,
              action_max              
            )
            VALUES ${valString}
        `, function (res) {
            console.log("insert pattern player => ");
            console.log(res);
            callBack(res);
        });
    }
    static read(key, callback) {
        data_1.Data.successOrFail(`
            SELECT * FROM PatternPlayer
            WHERE key_ = "${key}"
        `, (res) => {
            if (res && res.length > 0) {
                callback(JSON.parse(JSON.stringify(res[0])));
            }
            else {
                callback(null);
            }
        });
    }
    static readAll(callBack) {
        data_1.Data.successOrFail(`
            SELECT * FROM PatternPlayer
        `, (res) => {
            callBack(JSON.parse(JSON.stringify(res)));
        });
    }
}
exports.PatternPlayer = PatternPlayer;