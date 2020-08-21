import { Data } from "./data";

export class PatternPlayer {
  static init(callBack: CallableFunction) {
    Data.successOrFail(
      `
        DROP TABLE PatternPlayer
        `,
      function (res) {}
    );

    Data.successOrFail(
      `
        CREATE TABLE IF NOT EXISTS PatternPlayer
        (
          key_ VARCHAR(36) primary key,

          life FLOAT,
          life_max FLOAT,
  
          water FLOAT,
          food FLOAT, 
          faith FLOAT, 
          wood FLOAT,
  
          comp_getwater FLOAT, 
          comp_getfood FLOAT,
          comp_getfaith FLOAT,
          comp_getwood FLOAT, 
          comp_attack FLOAT,
          comp_defense FLOAT,
  
          xp FLOAT,
          move INT,
          move_max INT,
          attack INT,
          attack_max INT
  
        )
        `,
      function (res) {
        PatternPlayer.initValues(function (end) {
          callBack(end);
        });
      }
    );
  }

  static initValues(callBack: CallableFunction) {
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

    Data.successOrFail(
      `
            INSERT INTO PatternPlayer
            (
              key_,

              life,
              life_max,
      
              water,
              food, 
              faith, 
              wood,
      
              comp_getwater, 
              comp_getfood,
              comp_getfaith,
              comp_getwood, 
              comp_attack,
              comp_defense,
      
              xp,
              move,
              move_max,
              attack,
              attack_max              
            )
            VALUES ${valString}
        `,
      function (res) {
        console.log("insert pattern player => ");
        console.log(res);
        callBack(res);
      }
    );
  }

  static read(key: string, callback: CallableFunction) {
    Data.successOrFail(
      `
            SELECT * FROM PatternPlayer
            WHERE key_ = "${key}"
        `,
      (res) => {
        if (res && res.length > 0) {
          callback(JSON.parse(JSON.stringify(res[0])));
        } else {
          callback(null);
        }
      }
    );
  }
  static readAll(callBack: CallableFunction) {
    Data.successOrFail(
      `
            SELECT * FROM PatternPlayer
        `,
      (res) => {
        callBack(JSON.parse(JSON.stringify(res)));
      }
    );
  }
}
