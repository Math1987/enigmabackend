import { getCalculation } from "./calculation.controller";
import { Calculation } from "../data/calcul.data";

let calculs = null;

export const getCalculation = (callBack) => {
  if (!calculs) {
    Calculation.readCalculs((calcul) => {
      calculs = calcul;
      callBack(calcul);
    });
  } else {
    callBack(calculs);
  }
};
