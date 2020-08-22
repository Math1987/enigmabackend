import { Data } from "./data";

export const updateAccountWorld = (id, value, callback) => {
  Data.successOrFail(
    `
    UPDATE ${Data.TABLE_ACCOUNTS}
    SET world = "${value}"
    WHERE id = "${id}"
  `,
    (res) => {
      callback(res);
    }
  );
};

export class AccountData {
  static initAccount(callBack: CallableFunction) {
    let sql = `
            CREATE TABLE IF NOT EXISTS ${Data.TABLE_ACCOUNTS}(
            id VARCHAR(36) PRIMARY KEY,
            email VARCHAR(154),
            password text,
            name VARCHAR(154),
            world VARCHAR(36),
            admin INT
            )
        `;
    Data.successOrFail(sql, callBack);
  }
  static checkAccount(email: String, callBack: CallableFunction) {
    let sql = `
            SELECT email from ${Data.TABLE_ACCOUNTS}
            WHERE email = "${email}"
        `;
    Data.findOrFail(sql, callBack);
  }
  static checkAccountName(name: String, callBack: CallableFunction) {
    let sql = `
            SELECT email from ${Data.TABLE_ACCOUNTS}
            WHERE name = "${name}"
        `;

    Data.findOrFail(sql, callBack);
  }
  static createAccount(
    email: String,
    password: String,
    name: String,
    admin: Number,
    callBack: CallableFunction
  ) {
    Data.CONNECTION.query(
      `
        INSERT INTO ${Data.TABLE_ACCOUNTS}
        (id, email, password, name, admin)
        VALUES (uuid(), "${email}", MD5("${password}"), "${name}", ${admin})
        `,
      function (err, res) {
        if (err) {
          console.error(err);
          callBack(null);
        } else {
          callBack({ email: email, password: password });
        }
      }
    );
  }
  static readAccount(
    email: String,
    password: String,
    callBack: CallableFunction
  ) {
    Data.CONNECTION.query(
      `
        SELECT * FROM ${Data.TABLE_ACCOUNTS} 
        WHERE email = "${email}" AND password = MD5("${password}")
        `,
      function (err, res) {
        if (err) {
          console.error(err);
          callBack(null);
        } else {
          if (res && res.length > 0) {
            delete res[0]["password"];
            let json = JSON.parse(JSON.stringify(res[0]));
            callBack(json);
          } else {
            callBack(null);
          }
        }
      }
    );
  }
  static readAccountById(id: String, callBack: CallableFunction) {
    Data.CONNECTION.query(
      `
        SELECT * FROM ${Data.TABLE_ACCOUNTS} 
        WHERE id = "${id}"
                `,
      function (err, res) {
        if (err) {
          console.error(err);
          callBack(null);
        } else {
          if (res && res.length > 0) {
            delete res[0]["password"];
            let json = JSON.parse(JSON.stringify(res[0]));
            callBack(json);
          } else {
            callBack(null);
          }
        }
      }
    );
  }
}
