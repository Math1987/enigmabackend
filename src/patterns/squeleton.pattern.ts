import { ModelPattern } from "./model.pattern";
import { passSqueletons } from "../controllers/squeleton.controller";
import { readSqueletonById, removeSqueletonDataById, updateSqueletonData, updateSqueletonDatas } from "../data/squeleton.data";
import { addDeadData } from "../data/dead.data";

export class Squeleton extends ModelPattern {
  constructor(key: string) {
    super();
    this.values = {};
  }
  readKey() {
    return "squeleton";
  }
  readDatas(world_name, obj, callback){
    readSqueletonById(world_name, obj['id'], callback);
  }
  updateValue(world_name, obj, key, value, callback ){
    console.log('I am a squeleton ready to update the value', obj['id'], key, value);
    updateSqueletonData(world_name, obj['id'], key, value, callback );
  }

  die(world_name, obj, callback){
    // updateSqueletonData(world_name, obj['id'], "life", -1, callback);
    console.log('squeleton pattern death', obj);
    obj['key_'] = this.readKey();
    addDeadData(world_name, obj, addDead => {
      removeSqueletonDataById(world_name, obj['id'], callback);
    });

  }

  pass(worldDatas, callback) {
    passSqueletons(worldDatas, callback);
  }
}
