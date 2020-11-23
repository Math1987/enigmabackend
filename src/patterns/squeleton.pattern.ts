import { ModelPattern } from "./model.pattern";
import { passSqueletons } from "../controllers/squeleton.controller";

export class Squeleton extends ModelPattern {
  constructor(key: string) {
    super();
    this.values = {};
  }
  readKey() {
    return "squeleton";
  }
  pass(worldDatas, callback) {
    passSqueletons(worldDatas, callback);
  }
}
