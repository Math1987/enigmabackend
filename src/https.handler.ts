import {Request, Response} from "express";

export class HttpsHandler{

    static app = null ;

    static init(app){

        HttpsHandler.app = app ;
        app.get('/test', function (req: Request, res : Response) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send('test');
        });


    }

}
