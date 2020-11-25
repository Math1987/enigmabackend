import { readPatterValueData } from "./../data/valuesPatterns.data";

export class ModelPattern {
  values: {} = {};

  constructor() {}
  readKey() {
    return "";
  }
  create(world_name, id, callback) {}
  pass(worldDatas, callback) {
    callback("done");
  }

  move(
    world_name: string,
    id: number,
    x: number,
    y: number,
    free: boolean,
    callback: Function
  ) {
    callback(null);
  }
  attack(
    world_name: string,
    user: Object,
    target: Object,
    callBack: Function
  ) {}
  counterAttack(
    world_name: string,
    counterAttacker: Object,
    attackerPatter: ModelPattern,
    attacker: Object,
    callback
  ) {
    callback(false);
  }
  getDammage(world_name, user, value, callback) {}
  die(world_name, user, callback) {}

  addValue(world_name, id, key, value, callback) {
    callback(null);
  }
  updateValue(world_name, id, key, value, callback ){
    console.log('I am a pattern ready to update the value', this.readKey())
    callback(false);
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
