import { ModelPattern } from "./model.pattern";

export class Player extends ModelPattern {
  constructor() {
    super();
  }
  readKey() {
    return "player";
  }
  create(world_name, id, callback) {}
}
