import {ValuesData} from "../data/values.data";

const express = require('express');
export const routerChara = express.Router();


routerChara.get('/values', function (req: Request, res : Response) {
    console.log('getting values');
    console.log(req.headers['userTokenValues']);
    const tokenDatas = req.headers['userTokenValues'] ;
    ValuesData.readResources(tokenDatas.id,tokenDatas.world, (resValues)=>{
        console.log(resValues);
        res.status(200).send(resValues);
    });

});
