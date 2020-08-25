import { Data, successOrFailData } from "./data";

const TABLE_NAME = "valuesPatterns";

const initPatternValueData = (callBack: CallableFunction) => {
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
      key_ VARCHAR(36),
      icon INT,
      user VARCHAR(36),
      start FLOAT,
      PRIMARY KEY (key_, user)
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
  let values = [
    //LIFE
    {
      key_: "life",
      icon: 0,
      user: "player",
      start: 100,
    },
    {
      key_: "life_max",
      icon: 0,
      user: "player",
      start: 100,
    },
    {
      key_: "counter",
      icon: 0,
      user: "player",
      start: 0.5,
    },

    //RESOURCES
    {
      key_: "water",
      icon: 7,
      user: "player",
      start: 10,
    },
    {
      key_: "food",
      icon: 9,
      user: "player",
      start: 10,
    },
    {
      key_: "faith",
      icon: 8,
      user: "player",
      start: 10,
    },
    {
      key_: "wood",
      icon: 2,
      user: "player",
      start: 10,
    },

    //SKILLS
    {
      key_: "skill_attack",
      icon: 1,
      user: "player",
      start: 10,
    },
    {
      key_: "skill_defense",
      icon: 5,
      user: "player",
      start: 10,
    },
    {
      key_: "skill_food",
      icon: 9,
      user: "player",
      start: 10,
    },
    {
      key_: "skill_water",
      icon: 7,
      user: "player",
      start: 10,
    },
    {
      key_: "skill_faith",
      icon: 8,
      user: "player",
      start: 10,
    },
    {
      key_: "skill_wood",
      icon: 10,
      user: "player",
      start: 10,
    },

    //STOCK
    {
      key_: "move",
      icon: 6,
      user: "player",
      start: 20,
    },
    {
      key_: "action",
      icon: 0,
      user: "player",
      start: 8,
    },
    {
      key_: "addskills",
      icon: 5,
      user: "player",
      start: 50,
    },
  ];

  let valString = "";
  for (let row of values) {
    if (valString.length > 0) {
      valString += ", ";
    }
    valString += `("${row.key_}",${row.icon},"${row.user}","${row.start}")`;
  }

  successOrFailData(
    `
          INSERT INTO ${TABLE_NAME}
          (key_, icon, user, start)
          VALUES ${valString}
      `,
    function (res) {
      callBack(res);
    }
  );
};
const readPatterValueData = (key: string, callback: CallableFunction) => {
  successOrFailData(
    `
          SELECT * FROM ${TABLE_NAME}
          WHERE user = "${key}"
      `,
    (res) => {
      callback(JSON.parse(JSON.stringify(res)));
    }
  );
};
const readAllPatternData = (callBack: CallableFunction) => {
  successOrFailData(
    `
          SELECT * FROM ${TABLE_NAME}
      `,
    (res) => {
      callBack(JSON.parse(JSON.stringify(res)));
    }
  );
};

export {
  initPatternValueData,
  initValuesData,
  readPatterValueData,
  readAllPatternData,
};
