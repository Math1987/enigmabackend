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

export { initMainPatterns, getPattern };
