"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passSqueletons = void 0;
const squeleton_data_1 = require("../data/squeleton.data");
const grounds_controller_1 = require("./grounds.controller");
const passSqueletons = (worldDatas, callback) => {
    const width = parseInt(worldDatas['width']);
    const height = parseInt(worldDatas['height']);
    const density = parseFloat(worldDatas['squeletons']);
    const numberOfSqueletons = Math.floor(density * (width * height - Math.pow(grounds_controller_1.getNeutralZoneSize(), 2)));
    console.log('world passed', worldDatas);
    console.log('density of squeletons', density);
    console.log('number of squeleton', width, height, numberOfSqueletons);
    squeleton_data_1.readAllSqueletonsData(worldDatas['name'], squeletons => {
        console.log('squeletons found', squeletons.length);
        let actualSqueletons = squeletons.length | 0;
        let squeletonsCreate = [];
        while (actualSqueletons + squeletonsCreate.length < numberOfSqueletons) {
            let random = Math.floor(Math.random() * width * height);
            let px = -width / 2 + Math.floor(random % width);
            let py = -height / 2 + Math.floor(random / height);
            if (px >= -grounds_controller_1.NEUTRAL_ZONE_SIZE / 2) {
                px += grounds_controller_1.NEUTRAL_ZONE_SIZE;
            }
            if (py >= -grounds_controller_1.NEUTRAL_ZONE_SIZE / 2) {
                py += grounds_controller_1.NEUTRAL_ZONE_SIZE;
            }
            console.log('squeleton', px, py);
            squeletonsCreate.push({
                x: px,
                y: py,
                life: 50,
                life_max: 50,
                skill_defense: 10,
                skill_attack: 10
            });
        }
        console.log('squeletons to create', squeletonsCreate.length);
        if (squeletonsCreate.length > 0) {
            squeleton_data_1.insertSqueletonsData(worldDatas['name'], squeletonsCreate, callback);
        }
        else {
            callback(true);
        }
        // const createSqueleton = () => {
        //     let randomPos = {
        //         x : px,
        //         y : py
        //     }
        //     insertSqueletonData(worldDatas['name'], {
        //         x : randomPos.x,
        //         y : randomPos.y,
        //         life : 50,
        //         life_max : 50,
        //         skill_defense : 10,
        //         skill_attack : 10
        //     }, createRes => {
        //         actualSqueletons++;
        //         if ( actualSqueletons < numberOfSqueletons ){
        //             createSqueleton();
        //         }else{
        //             callback(true);
        //         }
        //     });
        // }
        // createSqueleton();
    });
};
exports.passSqueletons = passSqueletons;
