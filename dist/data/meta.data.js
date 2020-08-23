"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMetaDatasDatas = exports.initMetaValuesData = exports.initMetaData = void 0;
const data_1 = require("./data");
const TABLE_NAME = "metadatas";
const initMetaData = (callBack) => {
    data_1.Data.successOrFail(` DROP TABLE IF EXISTS ${TABLE_NAME}`, () => { });
    data_1.Data.successOrFail(`
      CREATE TABLE ${TABLE_NAME}
      (
      key_ VARCHAR(36) PRIMARY KEY,
      type VARCHAR(36),
      name_fr VARCHAR(36),
      description_fr TEXT,
      img TEXT
      )
      `, function (res) {
        initMetaValuesData(callBack);
    });
};
exports.initMetaData = initMetaData;
const initMetaValuesData = (callBack) => {
    let values = [
        {
            key_: "water",
            type: "resource",
            name_fr: "eau",
            description_fr: "resource en eau",
            img: "",
        },
        {
            key_: "food",
            type: "resource",
            name_fr: "nourriture",
            description_fr: "resource en nourriture",
            img: "",
        },
        {
            key_: "wood",
            type: "resource",
            name_fr: "bois",
            description_fr: "resource en bois",
            img: "",
        },
        {
            key_: "faith",
            type: "resource",
            name_fr: "foi",
            description_fr: "spiritualité",
            img: "",
        },
        {
            key_: "move",
            type: "playtoken",
            name_fr: "déplacement",
            description_fr: "permet de se déplacer",
            img: "",
        },
        {
            key_: "action",
            type: "playtoken",
            name_fr: "actions",
            description_fr: "actions a utiliser",
            img: "",
        },
        {
            key_: "addskills",
            type: "addskill",
            name_fr: "ajout de compétences",
            description_fr: "ajouter des compétences",
            img: "",
        },
        {
            key_: "skill_attack",
            type: "skill",
            name_fr: "attaque",
            description_fr: "compétence d'attaque",
            img: "",
        },
        {
            key_: "skill_defense",
            type: "skill",
            name_fr: "défense",
            description_fr: "compétence de défense",
            img: "",
        },
        {
            key_: "skill_water",
            type: "skill",
            name_fr: "sourcier",
            description_fr: "compétence de sourcier",
            img: "",
        },
        {
            key_: "skill_faith",
            type: "skill",
            name_fr: "prêtre",
            description_fr: "compétence de prêtre",
            img: "",
        },
        {
            key_: "skill_wood",
            type: "skill",
            name_fr: "bûcheron",
            description_fr: "compétence de bûcheron",
            img: "",
        },
        {
            key_: "skill_food",
            type: "skill",
            name_fr: "chasseur",
            description_fr: "compétence de chasseur",
            img: "",
        },
        {
            key_: "masculin",
            type: "sexes",
            name_fr: "masculin",
            description_fr: "",
            img: "/assets/images/homme.png",
        },
        {
            key_: "feminine",
            type: "sexes",
            name_fr: "féminin",
            description_fr: "",
            img: "/assets/images/femme.png",
        },
        {
            key_: "human",
            type: "races",
            name_fr: "humain",
            description_fr: "Je suis de taille moyenne, blablabla....",
            img: "/assets/images/humain.png",
        },
        {
            key_: "dwarf",
            type: "races",
            name_fr: "nain",
            description_fr: "description_fr",
            img: "/assets/images/nain.png",
        },
        {
            key_: "vampire",
            type: "races",
            name_fr: "vampire",
            description_fr: "description_fr",
            img: "/assets/images/vampire.png",
        },
        {
            key_: "elf",
            type: "races",
            name_fr: "elfe",
            description_fr: "description_fr",
            img: "/assets/images/elfe.png",
        },
        {
            key_: "godWater",
            type: "religions",
            name_fr: `Déesse de l'eau`,
            description_fr: `déesse de l'eau`,
            img: "/assets/images/eau.png",
        },
        {
            key_: "godFire",
            type: "religions",
            name_fr: `Dieu du feu`,
            description_fr: `Dieu du feu`,
            img: "/assets/images/feu.png",
        },
        {
            key_: "godLight",
            type: "religions",
            name_fr: `Déesse de la lumière`,
            description_fr: `Déesse de la lumière`,
            img: "/assets/images/lumiere.png",
        },
        {
            key_: "godShadow",
            type: "religions",
            name_fr: `Dieu des ombres`,
            description_fr: `Dieu des ombres`,
            img: "/assets/images/ombre.png",
        },
    ];
    let valString = "";
    for (let row of values) {
        if (valString.length > 0) {
            valString += ", ";
        }
        valString += `("${row.key_}","${row.type}","${row.name_fr}","${row.description_fr}","${row.img}")`;
    }
    data_1.Data.successOrFail(`
          INSERT INTO ${TABLE_NAME}
          (key_, type, name_fr, description_fr, img)
          VALUES ${valString}
      `, function (res) {
        callBack(res);
    });
};
exports.initMetaValuesData = initMetaValuesData;
const readMetaDatasDatas = (callBack) => {
    data_1.Data.successOrFail(`
      SELECT * FROM ${TABLE_NAME}
      `, function (res) {
        res = JSON.parse(JSON.stringify(res));
        let obj = {};
        for (let row of res) {
            if (!obj[row.type]) {
                obj[row.type] = [];
            }
            let type = row.type;
            Reflect.deleteProperty(row, "type");
            obj[type].push(row);
        }
        callBack(obj);
    });
};
exports.readMetaDatasDatas = readMetaDatasDatas;
