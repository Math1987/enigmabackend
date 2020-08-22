import { MainPatterns } from "./main.patterns";
import { ValuesPatternsData } from "./../data/valuesPatterns.data";
import { Player } from "./chara.pattern";

export class MainPatterns {
  static PATTERNS = {};

  static init(callBack) {
    MainPatterns.PATTERNS = {
      humanmasculin: new Player(),
      dwarhumanfeminine: new Player(),
      dwarfmasculin: new Player(),
      dwarffeminine: new Player(),
      elfmasculin: new Player(),
      elffeminine: new Player(),
      vampiremasculin: new Player(),
      vampirefeminine: new Player(),
    };

    callBack("ok");
  }

  static getPattern(key: string) {
    return MainPatterns.PATTERNS[key];
  }
}
