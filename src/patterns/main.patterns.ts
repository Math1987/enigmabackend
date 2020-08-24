import { Player } from "./chara.pattern";

let PATTERNS = {};

const initMainPatterns = (callBack) => {
  PATTERNS = {
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
