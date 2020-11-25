import { insertClanData } from "../data/clan.data"

export const createClanRequest = (req, res) => {
    if ( req.body && req.body['worldName']
     && req.body['clan']
     && req.body['color']
     ){
         insertClanData(req.body['worldName'], req.body['clan'], req.body['color'], '', resClan => {
             if ( resClan ){
                 res.status(200).send({clan : "ok"});
             }else{
                 res.status(401).send({err : 'error'});
             }
         });
     }else{
         res.status(401).send('need datas');
     }
}