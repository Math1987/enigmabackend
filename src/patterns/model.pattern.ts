import { readPatterValueData } from "./../data/valuesPatterns.data";

export class ModelPattern {
  values: {} = {};

  constructor() {
    readPatterValueData(this.readKey(), (values) => {
      for (let row of values) {
        this.values[row["key_"]] = row["start"];
      }
    });
  }
  readKey() {
    return "";
  }
  create(world_name, id, callback) {}

  move(
    world_name: string,
    id: number,
    x: number,
    y: number,
    callback: Function
  ) {
    callback(null);
  }

  addValue(world_name, id, key, value, callback) {
    callback(null);
  }
  pops(world_name, user, callBack) {
    // if (this.values["life"]) {
    //   MobilesData.updateLifeAndPosition(
    //     world_name,
    //     user["id"],
    //     this.values["life"],
    //     0,
    //     0,
    //     (resLife) => {
    //       if (resLife) {
    //         user["life"] = this.values["life"];
    //         user["position"] = { x: 0, y: 0 };
    //         callBack(this.values["life"]);
    //       } else {
    //         callBack(null);
    //       }
    //     }
    //   );
    // } else {
    //   callBack(null);
    // }
  }
}
