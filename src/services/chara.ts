import {HttpsHandler} from "../https.handler";
import {Data} from "../data/data";
import {WorldData} from "../data/world.data";

export class Chara{

    static init(){


        HttpsHandler.app.post('/u/createChara', function (req: Request, res : Response) {
            WorldData.createCharacter('world1', req.body, function (chara) {
                if ( chara ){

                    chara = req.body ;
                    chara['world'] = 'world1';
                    res.status(200).json(chara);
                }else{
                    res.status(401).json('erreur de création du personnage');
                }
            });
        });

        HttpsHandler.app.post('/u/chara', function (req: Request, res : Response) {
            console.log(req.body);
            WorldData.readCharacter('world1', req.body.id, function (chara) {
                if ( chara ){
                    res.status(200).json(chara) ;
                }else{
                    res.status(401).json('chara non trouvé');
                }
            });
        });

    }

}
