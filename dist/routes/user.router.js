"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const security_1 = require("../services/security");
const player_data_1 = require("../data/player.data");
const express = require('express');
exports.routerUser = express.Router();
exports.routerUser.use((req, res, next) => {
    //console.log('user call ' + req.method + ' ' + req.url );
    if (req.method === "OPTIONS") {
        res.status(200).send('');
    }
    else {
        const token = req.headers.authorization;
        if (token) {
            security_1.Security.checkToken(token, function (userRes) {
                console.log('values in token');
                console.log(userRes);
                if (userRes) {
                    req.headers['userTokenValues'] = userRes;
                    next();
                }
                else {
                    console.log('token invalid');
                    res.status(401).json('token invalid');
                }
            });
        }
        else {
            console.log('no token here');
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
    console.log(req.body);
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
/*routerUser.post('/chara', function (req: Request, res : Response) {
    const tokenDatas = req.headers['userTokenValues'] ;
    PlayerData.readCharacter(tokenDatas.world, req.body.id, function (chara) {
        if ( chara ){
            res.status(200).json(chara) ;
        }else{
            res.status(204).json('chara non trouvé');
        }
    });
});*/