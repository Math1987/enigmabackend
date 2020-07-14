import {ValuesData} from "../data/values.data";

const express = require('express');
export const routerChara = express.Router();


routerChara.get('/values', function (req: Request, res : Response) {

    const tokenDatas = req.headers['userTokenValues'] ;
    ValuesData.readResources(tokenDatas.id,tokenDatas.world, (resValues)=>{

        res.status(200).send(resValues);
    });

});

routerChara.post('/addvalue', function (req: Request, res : Response) {

    console.log(req.body);
    const tokenDatas = req.headers['userTokenValues'] ;
    ValuesData.addValue(tokenDatas.id, tokenDatas.world, req.body.key_, req.body.adder).then( res =>{
        console.log(res);
    });
    res.status(200).send(null);

});
