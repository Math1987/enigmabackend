
import {HttpsHandler} from "../https.handler";
import {Data} from "../data/data";
const jwt = require('jsonwebtoken');
const fs = require('fs');
const RSA_KEY_PRIVATE = fs.readFileSync('dist/rsa/key');



export class AccountService{

    static init(){

        HttpsHandler.app.get('/checkEmail', function (req: Request, res : Response) {
            if ( req.query.email ){
                Data.checkAccount(req.query.email,function (accountRes) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(accountRes);
                });
            }else{
                res.send(false);
            }
        });
        HttpsHandler.app.get('/checkAccountName', function (req: Request, res : Response) {
            if ( req.query.name ){
                Data.checkAccountName(req.query.name,function (accountRes) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(accountRes);
                });
            }else{
                res.send(false);
            }
        });




        HttpsHandler.app.post('/signup', function (req: Request, res : Response) {
            if ( req.body ){
                Data.createAccount(req.body.email, req.body.password, req.body.name, 0, function (account) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.send(account);
                });
            }else{
                res.send(null);
            }
        });
        HttpsHandler.app.post('/signIn', function (req: Request, res : Response) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader("Access-Control-Allow-Origin", "*");
            if ( req.body ){
                Data.readAccount(req.body.email, req.body.password, function (accountRes) {
                    if ( accountRes ){
                        var token = jwt.sign( RSA_KEY_PRIVATE, 'text');
                        res.send(token);
                    }else{
                        res.send(null);
                    }
                });
            }else{
                res.send(null);
            }
        });

    }

}
