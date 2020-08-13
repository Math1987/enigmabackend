import { MainPatterns } from "./main.patterns";
import { ValuesPatternsData } from "./../data/valuesPatterns.data";
import { Player } from "./chara.pattern";

export class MainPatterns {
  static PATTERNS = {};

  static init(callBack) {
    console.log("init");

    MainPatterns.PATTERNS = {
      dwarfmasculin: new Player(),
      dwarffeminine: new Player(),
      vampiremasculin: new Player(),
      vampirefeminine: new Player(),
    };

    callBack("ok");
  }

  static getPattern(key: string) {
    return MainPatterns.PATTERNS[key];
  }
}
