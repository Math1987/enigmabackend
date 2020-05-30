"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("./data");
class MetaData {
    static init(callBack) {
        data_1.Data.successOrFail(`
        CREATE TABLE IF NOT EXISTS ${MetaData.TABLE_NAME}
        (
        name VARCHAR(36) PRIMARY KEY,
        type VARCHAR(36),
        name_fr VARCHAR(36),
        description_fr TEXT,
        img TEXT
        )
        `, function (res) {
            console.log(res);
            MetaData.initValues(callBack);
        });
    }
    static initValues(callBack) {
        let values = [
            {
                type: "sexes",
                name: "masculin",
                name_fr: "masculin",
                description_fr: "",
                img: '/assets/images/homme.png'
            },
            {
                type: 'sexes',
                name: "feminine",
                name_fr: 'féminin',
                description_fr: '',
                img: '/assets/images/femme.png'
            },
            {
                type: 'races',
                name: 'human',
                name_fr: 'humain',
                description_fr: 'Je suis de taille moyenne, blablabla....',
                img: '/assets/images/humain.png'
            },
            {
                type: 'races',
                name: 'dwarf',
                name_fr: 'nain',
                description_fr: 'description_fr',
                img: '/assets/images/nain.png'
            },
            {
                type: 'races',
                name: 'vampire',
                name_fr: 'vampire',
                description_fr: 'description_fr',
                img: '/assets/images/vampire.png'
            },
            {
                type: 'races',
                name: 'elf',
                name_fr: 'elfe',
                description_fr: 'description_fr',
                img: '/assets/images/elfe.png'
            },
            {
                type: 'religions',
                name: 'water',
                name_fr: `déesse de l'eau`,
                description_fr: `déesse de l'eau`,
                img: '/assets/images/elfe.png'
            }
        ];
        let valString = '';
        for (let row of values) {
            if (valString.length > 0) {
                valString += ', ';
            }
            valString += `("${row.name}","${row.type}","${row.name_fr}","${row.description_fr}","${row.img}")`;
        }
        data_1.Data.successOrFail(`
            INSERT INTO ${MetaData.TABLE_NAME}
            (name, type, name_fr, description_fr, img)
            VALUES ${valString}
        `, function (res) {
            callBack(res);
        });
    }
    static readMetaDatas(callBack) {
        data_1.Data.successOrFail(`
        SELECT * FROM ${MetaData.TABLE_NAME}
        `, function (res) {
            res = JSON.parse(JSON.stringify(res));
            let obj = {};
            for (let row of res) {
                if (!obj[row.type]) {
                    obj[row.type] = [];
                }
                let type = row.type;
                Reflect.deleteProperty(row, 'type');
                obj[type].push(row);
            }
            callBack(obj);
        });
    }
}
exports.MetaData = MetaData;
MetaData.TABLE_NAME = "metadatas";
