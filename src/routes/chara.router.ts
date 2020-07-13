import {ResourceData} from "../data/resource.data";

const express = require('express');
export const routerChara = express.Router();


routerChara.get('/resources', function (req: Request, res : Response) {
    console.log('getting resources');
    console.log(req.headers['userTokenValues']);
    const tokenDatas = req.headers['userTokenValues'] ;
    ResourceData.readResources(tokenDatas.id,tokenDatas.world, (resResources)=>{
        console.log(resResources);
        res.status(200).send(resResources);
    });

});
