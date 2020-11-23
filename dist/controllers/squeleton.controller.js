"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passSqueletons = void 0;
const squeleton_data_1 = require("../data/squeleton.data");
const passSqueletons = (worldDatas, callback) => {
    const numberOfSqueletons = 2;
    console.log('pass squeleton', worldDatas);
    squeleton_data_1.readAllSqueletonsData(worldDatas['name'], squeletons => {
        console.log('squeletons found', squeletons);
        let actualSqueletons = squeletons.length | 0;
        const createSqueleton = () => {
            squeleton_data_1.insertSqueletonData(worldDatas['name'], {
                x: 1,
                y: 1,
                life: 50,
                life_max: 50,
                skill_defense: 10,
                skill_attack: 10
            }, createRes => {
                actualSqueletons++;
                if (actualSqueletons < numberOfSqueletons) {
                    createSqueleton();
                }
                else {
                    callback(true);
                }
            });
        };
        createSqueleton();
    });
};
exports.passSqueletons = passSqueletons;
