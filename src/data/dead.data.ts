import { successOrFailData } from "./data";

const TABLE_NAME = "deads";

const initDeadData = (callback) => {

  successOrFailData(
    `
    create table if not exists ${TABLE_NAME}
    (
      world VARCHAR(36),
      id VARCHAR(36),
      key_ VARCHAR(36),
      primary key( world, id)
    )
  `,
    (res) => {
        callback(res);
    }
  );
};

const addDeadData = (
  world_name: string,
  obj : Object,
  callback: Function
) => {
  successOrFailData(
    `
  INSERT INTO ${TABLE_NAME}
  (world,id,key_)
  VALUES
  ("${world_name}","${obj['id']}","${obj['key_']}")
  `,
    (insertRes) => {
        callback(insertRes);
    }
  );
};

const readDeadByIdData = (world_name, id, callback) => {
  successOrFailData(
    `
    SELECT * FROM ${TABLE_NAME}
    WHERE world = "${world_name}" AND id = "${id}" 
  `,
    (res) => {
      if (res && res.length > 0) {
        let finalRes = JSON.parse(JSON.stringify(res[0])) ;
        finalRes['key'] = finalRes['key_'];
        callback(finalRes);
      } else {
        callback(null);
      }
    }
  );
};

export { initDeadData, addDeadData, readDeadByIdData };
