import {WorldData} from "../data/world.data";

const express = require('express');
export const routerWorld = express.Router();

routerWorld.get('/', function (req: Request, res : Response) {
    res.status(200).send('ok');
});

routerWorld.post('/create', (req:Request, res: Response) =>{

    //WorldData.buildWorld({name : })
    if ( req.body && req.body.name && req.body.width && req.body.height ){
        WorldData.buildWorld(req.body, (worldBuild) =>{
            console.log(worldBuild);
        })
    }

    res.status(200).send('ok');
});
