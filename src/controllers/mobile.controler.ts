import { MobilesData } from "./../data/mobile.data";
import { ValuesData } from "./../data/values.data";

export const getMobile = (world_name, id, callBack) => {
  let mobileObj = {};

  ValuesData.readAsObject(world_name, id, (values) => {
    if (values) {
      MobilesData.readById(world_name, id, (mobile) => {
        Object.assign(mobileObj, values, mobile);
        callBack(mobileObj);
      });
    } else {
      callBack(null);
    }
  });
};
