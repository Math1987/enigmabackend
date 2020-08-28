import { Player } from "./chara.pattern";

let PATTERNS = {};

const initMainPatterns = (callBack) => {
  PATTERNS = {
    humanmasculin: new Player("humanmasculin"),
    humanfeminine: new Player("humanfeminine"),
    dwarfmasculin: new Player("dwarfmasculin"),
    dwarffeminine: new Player("dwarffeminine"),
    elfmasculin: new Player("elfmasculin"),
    elffeminine: new Player("elffeminine"),
    vampiremasculin: new Player("vampiremasculin"),
    vampirefeminine: new Player("vampirefeminine"),
  };

  callBack("ok");
};
const getPattern = (key: string) => {
  return PATTERNS[key];
};
const passPatterns = (world_name, callback) => {
  let i = Object.keys(PATTERNS).length - 1;
  let func = () => {
    let key = Object.keys(PATTERNS)[i];
    let targetPattern = PATTERNS[key];
    targetPattern.pass(world_name, (resPass) => {
      if (i > 0) {
        i--;
        func();
      } else {
        callback("done");
      }
    });
  };
  func();
};

export { initMainPatterns, getPattern, passPatterns };
