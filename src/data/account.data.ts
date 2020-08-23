import { Data } from "./data";

const TABLE_NAME = `accounts`;

const initAccountData = (callBack: CallableFunction) => {
  let sql = `
          CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(154),
          password text,
          name VARCHAR(154),
          world VARCHAR(36),
          admin INT
          )
      `;
  Data.successOrFail(sql, callBack);
};
const checkEmailData = (email: String, callBack: CallableFunction) => {
  let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE email = "${email}"
      `;
  Data.findOrFail(sql, callBack);
};
const checkAccountNameData = (name: String, callBack: CallableFunction) => {
  let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE name = "${name}"
      `;

  Data.findOrFail(sql, callBack);
};
const updateAccountWorldData = (id, value, callback) => {
  Data.successOrFail(
    `
    UPDATE ${TABLE_NAME}
    SET world = "${value}"
    WHERE id = "${id}"
  `,
    (res) => {
      callback(res);
    }
  );
};
const createAccountData = (
  email: String,
  password: String,
  name: String,
  admin: Number,
  callBack: CallableFunction
) => {
  Data.CONNECTION.query(
    `
      INSERT INTO ${TABLE_NAME}
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
};
const readAccountData = (
  email: String,
  password: String,
  callBack: CallableFunction
) => {
  Data.CONNECTION.query(
    `
      SELECT * FROM ${TABLE_NAME} 
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
};
const readAccountDataById = (id: String, callBack: CallableFunction) => {
  Data.CONNECTION.query(
    `
      SELECT * FROM ${TABLE_NAME} 
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
};

export {
  initAccountData,
  checkEmailData,
  checkAccountNameData,
  updateAccountWorldData,
  createAccountData,
  readAccountData,
  readAccountDataById,
};
