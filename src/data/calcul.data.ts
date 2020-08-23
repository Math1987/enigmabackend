import { successOrFailData } from "./data";
const TABLE_NAME = "calcul";

const initCalculationData = (callBack) => {
  successOrFailData(
    `
  create table if not exists ${TABLE_NAME}
  (
  name VARCHAR(154), 
  attribute VARCHAR(154),
  operator INT,
  value FLOAT,
  PRIMARY KEY (name, attribute)
  );`,
    (res) => {
      if (res) {
        createCalculationsData(
          `
          
          ("getWater", "getWater", 0, 0.25 ),
          ("getWater", "defense", 0, 0.25),
          ("getWater", "defense_log", 0, 0.33),
          ("getWater", "ground", 0, 0.08),
          ("getWater", "neutral", 0, 0.05),
          ("getWater", "well", 0, 0.8),
          
          ("getFood", "getFood", 0, 0.25 ),
          ("getFood", "attack", 0, 0.25),
          ("getFood", "attack_log", 0, 0.33),
          ("getFood", "ground", 0, 0.08),
          ("getFood", "neutral", 0, 0.05),
          ("getFood", "field", 0, 0.4),
          ("getFood", "tree", 0, 0.1),
          
          ("getMaterial", "getMaterial", 0, 0.25 ),
          ("getMaterial", "attack", 0, 0.33),
          
          ("getFaith", "getFaith", 0, 0.25 ),
          ("getFaith", "defense", 0, 0.25),
          ("getFaith", "defense_log", 0, 0.33),
          ("getFaith", "ground", 0, 0.5),
          ("getFaith", "neutral", 0, 0.3),
          ("getFaith", "temple", 0, 0.75),
          
          ("move", "neutral_in", 0, 0 ),
          ("move", "neutral_out", 0, 1 ),
          ("move", "ground_in", 0, 1),     
          ("move", "ground_out", 0, 1),            
          ("move", "tree_in", 0, 2),     
          ("move", "ground_out", 0, 1),     
          ("move", "fortification_in", 0, 1),     
          ("move", "fortification_out", 0, 0),                         
          
          ("attack", "proba_min", 0, 0.7 ),
          ("attack", "proba_getFood_min", 0, 20),
          ("attack", "proba_getFood", 0, 0.33),
          ("attack", "proba_factor1", 0, 1.5),
          ("attack", "proba_getFaith_min", 0, 20),
          ("attack", "proba_getFaith", 0, 0.33),
          ("attack", "proba_factor2", 0, 1.5),
          ("attack", "getMaterial_min", 0, 20 ),
          ("attack", "getMaterial", 0, 0.33 ),
          ("attack", "getWater_min", 0, 20 ),
          ("attack", "getWater", 0, 0.33 ),
          ("attack", "factor", 0, 2.5 ),
          
          ("disassemble", "factor", 0, 0.5 ),
          ("defense", "min", 0, 10 ),
          ("defense", "factor", 0, 0.2 ),
          ("defense", "food_cost", 0, 20 ),
          
          
          
          ("levitation", "faith_cost", 0, 400 ),
          ("levitation", "faith_adder", 0, 200 ),
          ("levitation", "add_move", 0, 10 ),
          ("flame", "faith_cost", 0, 200 ),
          ("flame", "faith_adder", 0, 100 ),
          ("flame", "adder", 0, 1 ),                    
        
          ("protection", "faith_cost", 0, 100 ),
          ("blesstree", "faith_adder", 0, 100 ),
          ("protection", "adder", 0, 1 ),           
          
          ("blesstree", "faith_cost", 0, 50 ),
          ("blesstree", "faith_adder", 0, 10 ),
          ("blesstree", "adder", 0, 1 ),       
      
      
          ("spellRain", "faith_cost", 0, 100 ),
          ("spellRain", "faith_adder", 0, 100 ),
          ("spellRain", "add_move", 0, 10 ),
          ("spellVision", "faith_cost", 0, 100 ),
          ("spellVision", "faith_adder", 0, 100 ),
          ("spellVision", "add_move", 0, 10 ),
          
          ("luck", "faith_cost", 0, 100 ),
          ("luck", "faith_adder", 0, 100 ),                    
          ("luck", "adder", 0, 1 ),    
          
          
          ("tree", "pass_adder", 0, 20),
          ("tree", "pass_feed_adder", 0, 20),
          
          ("mine", "gold_proba", 0, 0.3),
          ("mine", "gold_D100Factor", 0, 0.5),
          ("mine", "gold_min", 0, 10),
          ("mine", "superGold_proba", 0, 0.4),
          ("mine", "superGold_D100Factor", 0, 1),
          ("mine", "superGold_min", 0, 20),
          ("mine", "relic_proba", 0, 0.15),
          ("mine", "xp_proba", 0, 0.15),
          
          ("openChest", "gold_proba", 0, 0.5),
          ("openChest", "relic_proba", 0, 0.5)        
          
          `,
          function (calculRes) {
            callBack(res);
          }
        );
      }
    }
  );
};
const readCalculsData = (callBack) => {
  successOrFailData(
    `
    SELECT * FROM ${TABLE_NAME}
  `,
    (res) => {
      if (res) {
        let obj = {};
        for (let row of res) {
          if (!obj[row["name"]]) {
            obj[row["name"]] = {};
          }

          obj[row["name"]][row["attribute"]] = row["value"];

          //obj[row["name"]] = row["value"];
        }
        callBack(obj);
      } else {
        callBack(null);
      }
    }
  );
};
const createCalculationsData = (calculations, callBack) => {
  successOrFailData(
    `
  INSERT IGNORE INTO ${TABLE_NAME}
  (name, attribute, operator, value)
  VALUES
  ${calculations}
  `,
    function (res) {
      if (res) {
        callBack(res);
      }
    }
  );
};
const readAllCalculationsData = (callBack) => {
  successOrFailData(
    `
  SELECT * FROM ${TABLE_NAME}
  `,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        let array = [];
        for (let r of res) {
          let found = false;
          for (let ar of array) {
            if (ar.name == r.name) {
              ar.attributes[r.attribute] = r.value;
              found = true;
              break;
            }
          }
          if (!found) {
            let attribute = {};
            attribute[r.attribute] = r.value;
            array.push({
              name: r.name,
              attributes: attribute,
            });
          }
        }
        callBack(array);
      }
    }
  );
};
const readCalculationsByName = (name, callBack) => {
  successOrFailData(
    `
  SELECT * FROM ${TABLE_NAME}
  WHERE name = "${name}"
  `,
    function (err, res) {
      if (err) {
        console.log(err);
      } else {
        let json = {};
        for (let r of res) {
          json[r.attribute] = r.value;
        }

        callBack(json);
      }
    }
  );
};
const updateCalculation = (name, attribute, value, callBack) => {
  successOrFailData(
    `
  UPDATE ${TABLE_NAME}
  SET value = ${value}
  WHERE name = "${name}" AND attribute = "${attribute}"
  `,
    function (err, res) {
      if (err) {
        console.log(err);
        callBack(null);
      } else {
        callBack(res);
      }
    }
  );
};

export {
  initCalculationData,
  readCalculsData,
  createCalculationsData,
  readAllCalculationsData,
  readCalculationsByName,
  updateCalculation,
};
