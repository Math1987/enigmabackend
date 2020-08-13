import { MobilesData } from "./../data/mobile.data";
import { ValuesData } from "./../data/values.data";
import { ValuesPatternsData } from "./../data/valuesPatterns.data";

export class ModelPattern {
  values: {} = {};

  constructor() {
    ValuesPatternsData.read(this.readKey(), (values) => {
      for (let row of values) {
        this.values[row["key_"]] = row["start"];
      }
      console.log(this.values);
    });
  }
  readKey() {
    return "";
  }
  pops(world_name, user, callBack) {
    if (this.values["life"]) {
      MobilesData.updateLifeAndPosition(
        world_name,
        user["id"],
        this.values["life"],
        0,
        0,
        (resLife) => {
          if (resLife) {
            callBack(this.values["life"]);
          } else {
            callBack(null);
          }
        }
      );
    } else {
      callBack(null);
    }
  }
}
