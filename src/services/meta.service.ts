import {HttpsHandler} from "../https.handler";
import {MetaData} from "../data/meta.data";

export class MetaService{

    static init(){

        HttpsHandler.app.get(`/metadatas`,function (req, res){
            MetaData.readMetaDatas(function (metadatas) {
                res.status(200).json(metadatas);
            });

        });

    }

}
