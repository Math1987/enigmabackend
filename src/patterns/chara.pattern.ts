import { ModelPattern } from "./model.pattern";

export class Player extends ModelPattern {
  constructor() {
    super();
  }
  readKey() {
    return "player";
  }

  pops() {
    console.log("pops");
  }
}
