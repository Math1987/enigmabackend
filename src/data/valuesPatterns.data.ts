import { Data } from "./data";

export class ValuesPatternsData {
  static TABLE_NAME = "valuesPatterns";

  static init(callBack: CallableFunction) {
    Data.successOrFail(
      `
        DROP TABLE ${ValuesPatternsData.TABLE_NAME}
        `,
      function (res) {}
    );

    Data.successOrFail(
      `
        CREATE TABLE IF NOT EXISTS ${ValuesPatternsData.TABLE_NAME}
        (
        key_ VARCHAR(36),
        icon INT,
        user VARCHAR(36),
        start FLOAT,
        PRIMARY KEY (key_, user)
        )
        `,
      function (res) {
        ValuesPatternsData.initValues(function (end) {
          callBack(end);
        });
      }
    );
  }

  static initValues(callBack: CallableFunction) {
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
        icon: 53,
        user: "player",
        start: 10,
      },
      {
        key_: "food",
        icon: 55,
        user: "player",
        start: 10,
      },
      {
        key_: "faith",
        icon: 7,
        user: "player",
        start: 10,
      },
      {
        key_: "wood",
        icon: 18,
        user: "player",
        start: 10,
      },

      //SKILLS
      {
        key_: "skill_attack",
        icon: 32,
        user: "player",
        start: 10,
      },
      {
        key_: "skill_defense",
        icon: 34,
        user: "player",
        start: 10,
      },
      {
        key_: "skill_food",
        icon: 32,
        user: "player",
        start: 10,
      },
      {
        key_: "skill_water",
        icon: 17,
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
        icon: 35,
        user: "player",
        start: 10,
      },

      //STOCK
      {
        key_: "move",
        icon: 36,
        user: "player",
        start: 20,
      },
      {
        key_: "action",
        icon: 16,
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

    Data.successOrFail(
      `
            INSERT INTO ${ValuesPatternsData.TABLE_NAME}
            (key_, icon, user, start)
            VALUES ${valString}
        `,
      function (res) {
        callBack(res);
      }
    );
  }

  static read(key: string, callback: CallableFunction) {
    Data.successOrFail(
      `
            SELECT * FROM ${ValuesPatternsData.TABLE_NAME}
            WHERE user = "${key}"
        `,
      (res) => {
        callback(JSON.parse(JSON.stringify(res)));
      }
    );
  }
  static readAll(callBack: CallableFunction) {
    Data.successOrFail(
      `
            SELECT * FROM ${ValuesPatternsData.TABLE_NAME}
        `,
      (res) => {
        callBack(JSON.parse(JSON.stringify(res)));
      }
    );
  }
}
