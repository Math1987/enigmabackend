import { successOrFailData } from "./data";

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
  successOrFailData(sql, callBack);
};
const checkEmailData = (email: String, callBack: CallableFunction) => {
  let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE email = "${email}"
      `;
  successOrFailData(sql, callBack);
};
const checkAccountNameData = (name: String, callBack: CallableFunction) => {
  let sql = `
          SELECT email from ${TABLE_NAME}
          WHERE name = "${name}"
      `;

  successOrFailData(sql, callBack);
};
const updateAccountWorldData = (id, value, callback) => {
  successOrFailData(
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
  successOrFailData(
    `
  INSERT INTO ${TABLE_NAME}
  (id, email, password, name, admin)
  VALUES (uuid(), "${email}", MD5("${password}"), "${name}", ${admin})
  `,
    (res) => {
      if (res) {
        callBack({ email: email, password: password });
      } else {
        callBack(null);
      }
    }
  );
};
const readAccountData = (
  email: String,
  password: String,
  callBack: CallableFunction
) => {
  successOrFailData(
    `
  SELECT * FROM ${TABLE_NAME} 
  WHERE email = "${email}" AND password = MD5("${password}")
  `,
    (res) => {
      if (res && res.length > 0) {
        delete res[0]["password"];
        let json = JSON.parse(JSON.stringify(res[0]));
        callBack(json);
      } else {
        callBack(null);
      }
    }
  );
};
const readAccountDataById = (id: String, callBack: CallableFunction) => {
  successOrFailData(
    `
  SELECT * FROM ${TABLE_NAME} 
  WHERE id = "${id}"
          `,
    (res) => {
      if (res && res.length > 0) {
        delete res[0]["password"];
        let json = JSON.parse(JSON.stringify(res[0]));
        callBack(json);
      } else {
        callBack(null);
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
