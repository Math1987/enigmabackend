"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalculation = void 0;
const calcul_data_1 = require("../data/calcul.data");
let calculs = null;
exports.getCalculation = (callBack) => {
    if (!calculs) {
        calcul_data_1.readCalculsData((calcul) => {
            calculs = calcul;
            callBack(calcul);
        });
    }
    else {
        callBack(calculs);
    }
};
