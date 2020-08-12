import { MobilesData } from "./../data/mobile.data";
import { ValuesData } from "./../data/values.data";

export const getChara = (world_name, id, callBack) => {
  let chara = {};

  ValuesData.readAsObject(world_name, id, (values) => {
    if (values) {
      chara = values;

      MobilesData.readById(world_name, id, (mobile) => {
        for (let key in mobile) {
          chara[key] = mobile[key];
        }
        callBack(chara);
      });
    } else {
      callBack(null);
    }
  });
};

export const move = (id, x, y) => {};
