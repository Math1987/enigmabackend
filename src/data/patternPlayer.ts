import { successOrFailData } from "./data";

const TABLE_NAME = "PatternPlayer";

const initPatternPlayerData = (callBack: CallableFunction) => {
  console.log("init patternPlayer");
  successOrFailData(
    `
      DROP TABLE ${TABLE_NAME}
      `,
    function (res) {}
  );

  successOrFailData(
    `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
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
      `,
    function (res) {
      initValuesData(function (end) {
        callBack(end);
      });
    }
  );
};
const initValuesData = (callBack: CallableFunction) => {
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

  successOrFailData(
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
      `,
    function (res) {
      callBack(res);
    }
  );
};
const readPlayerPatternData = (key: string, callback: CallableFunction) => {
  successOrFailData(
    `
          SELECT * FROM ${TABLE_NAME}
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
};
const readAllPlayerPatternData = (callBack: CallableFunction) => {
  successOrFailData(
    `
          SELECT * FROM PatternPlayer
      `,
    (res) => {
      callBack(JSON.parse(JSON.stringify(res)));
    }
  );
};

export {
  initPatternPlayerData,
  initValuesData,
  readPlayerPatternData,
  readAllPlayerPatternData,
};
