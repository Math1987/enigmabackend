import { readCalculsData } from "../data/calcul.data";

let calculs = null;

export const getCalculation = (callBack) => {
  if (!calculs) {
    readCalculsData((calcul) => {
      calculs = calcul;
      callBack(calcul);
    });
  } else {
    callBack(calculs);
  }
};
