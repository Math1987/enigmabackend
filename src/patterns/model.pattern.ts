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
    });
  }
  readKey() {
    return "";
  }
  create(world_name, id, callback) {}
  addValue(world_name, id, key, value, callback) {
    callback(null);
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
            user["life"] = this.values["life"];
            user["position"] = { x: 0, y: 0 };
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
