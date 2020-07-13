"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_handler_1 = require("../https.handler");
const world_data_1 = require("../data/world.data");
class Chara {
    static init() {
        https_handler_1.HttpsHandler.postBackend('/u/createChara', function (req, res) {
            world_data_1.WorldData.createCharacter('world1', req.body, function (chara) {
                if (chara) {
                    chara = req.body;
                    chara['world'] = 'world1';
                    res.status(200).json(chara);
                }
                else {
                    res.status(401).json('erreur de création du personnage');
                }
            });
        });
        https_handler_1.HttpsHandler.postBackend('/u/chara', function (req, res) {
            world_data_1.WorldData.readCharacter('world1', req.body.id, function (chara) {
                if (chara) {
                    res.status(200).json(chara);
                }
                else {
                    res.status(401).json('chara non trouvé');
                }
            });
        });
    }
}
exports.Chara = Chara;
