import { successOrFailData } from "./data";

const TABLE_NAME = "historic2";

const initHistoric2Data = (callback) => {
    console.log('init historic 2 datasz');
  successOrFailData(
    `
    create table if not exists ${TABLE_NAME}
    (
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      world VARCHAR(36),
      key_ VARCHAR(36),
      user VARCHAR(36),
      target VARCHAR(36),
      status VARCHAR(36),
      d100 INT,
      value FLOAT
      )
  `,
    (res) => {
        callback(res);
    }
  );
};

const addInHistoric2 = (
  world_name: string,
  key : string,
  user: string,
  target: string,
  status: string,
  d100: Number,
  value : Number,
  callback: Function
) => {
  successOrFailData(
    `
  INSERT INTO ${TABLE_NAME}
  (time,world,key_,user,target,status,d100,value)
  VALUES
  (now(),"${world_name}","${key}","${user}","${target}", "${status}", ${d100}, ${value})
  `,
    (insertRes) => {
        callback(insertRes);
    }
  );
};

const readHistoricUserData = (world_name, id, callback) => {
  successOrFailData(
    `
    SELECT * FROM ${TABLE_NAME}
    WHERE world = "${world_name}" AND user = "${id}" 
    ORDER BY time DESC;
  `,
    (res) => {
      if (res && res.length > 0) {
        callback(res);
      } else {
        callback(null);
      }
    }
  );
};

export { initHistoric2Data, addInHistoric2, readHistoricUserData };
