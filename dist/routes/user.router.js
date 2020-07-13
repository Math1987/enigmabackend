"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const security_1 = require("../services/security");
const player_data_1 = require("../data/player.data");
const express = require('express');
exports.routerUser = express.Router();
exports.routerUser.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        res.status(200).send('');
    }
    else {
        const token = req.headers.authorization;
        if (token) {
            security_1.Security.checkToken(token, function (userRes) {
                if (userRes) {
                    req.headers['userTokenValues'] = userRes;
                    next();
                }
                else {
                    res.status(401).json('token invalid');
                }
            });
        }
        else {
            res.status(401).send('need token');
        }
    }
});
exports.routerUser.get('/datas', function (req, res) {
    const token = req.headers.authorization;
    if (token) {
        security_1.Security.checkToken(token, function (userRes) {
            if (userRes) {
                res.status(200).json(userRes);
            }
            else {
                res.status(401).json('token invalid');
            }
        });
    }
    else {
        res.status(401).json('no token');
    }
});
exports.routerUser.post('/createChara', function (req, res) {
    player_data_1.PlayerData.createCharacter('world1', req.body, function (chara) {
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
exports.routerUser.post('/chara', function (req, res) {
    player_data_1.PlayerData.readCharacter('world1', req.body.id, function (chara) {
        if (chara) {
            res.status(200).json(chara);
        }
        else {
            res.status(401).json('chara non trouvé');
        }
    });
});
