import {Security} from "../services/security";
import {WorldData} from "../data/world.data";
import {PlayerData} from "../data/player.data";

const express = require('express');
export const routerUser = express.Router();

routerUser.use((req, res, next)=>{
    if ( req.method === "OPTIONS"){
        res.status(200).send('');
    }else{
        const token = req.headers.authorization ;
        if ( token ){
            Security.checkToken(token, function (userRes) {
                if ( userRes ){
                    req.headers['userTokenValues'] = userRes ;
                    next();
                }else{
                    res.status(401).json('token invalid');
                }
            })
        }else{
            res.status(401).send('need token');
        }
    }

});

routerUser.get('/datas', function (req: Request, res : Response) {
    const token = req.headers.authorization ;
    if ( token ){
        Security.checkToken(token, function (userRes) {
            if ( userRes ){
                res.status(200).json(userRes);
            }else{
                res.status(401).json('token invalid');
            }
        })
    }else{
        res.status(401).json('no token');
    }
});


routerUser.post('/createChara', function (req: Request, res : Response) {
    PlayerData.createCharacter('world1', req.body, function (chara) {
        if ( chara ){
            chara = req.body ;
            chara['world'] = 'world1';
            res.status(200).json(chara);
        }else{
            res.status(401).json('erreur de création du personnage');
        }
    });
});

routerUser.post('/chara', function (req: Request, res : Response) {
    PlayerData.readCharacter('world1', req.body.id, function (chara) {
        if ( chara ){
            res.status(200).json(chara) ;
        }else{
            res.status(401).json('chara non trouvé');
        }
    });
});
