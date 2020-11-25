"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClanRequest = void 0;
const clan_data_1 = require("../data/clan.data");
exports.createClanRequest = (req, res) => {
    if (req.body && req.body['worldName']
        && req.body['clan']
        && req.body['color']) {
        clan_data_1.insertClanData(req.body['worldName'], req.body['clan'], req.body['color'], '', resClan => {
            if (resClan) {
                res.status(200).send({ clan: "ok" });
            }
            else {
                res.status(401).send({ err: 'error' });
            }
        });
    }
    else {
        res.status(401).send('need datas');
    }
};
