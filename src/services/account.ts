import {HttpsHandler} from "../https.handler";
import {Data} from "../data/data";
import {Security} from "./security";
import {AccountData} from "../data/account.data";

/**
 * The account service manage all the requests about user's account,
 * as singin, singup, geting user informations etc...
 */
export class AccountService{

    /**
     * The initiation use HttpsHandle static app as express with bodyparser
     */
    static init(){

        /**
         * echeckEmail request check if mail exist or not.
         * send true or false
         */
        HttpsHandler.app.get('/checkEmail', function (req: Request, res : Response) {
            if ( req.query.email ){
                AccountData.checkAccount(req.query.email,function (accountRes) {
                    res.send(accountRes);
                });
            }else{
                res.send(false);
            }
        });
        /**
         * checkAccountName request check if name exist or not.
         * send true or false
         */
        HttpsHandler.app.get('/checkAccountName', function (req: Request, res : Response) {
            if ( req.query.name ){
                AccountData.checkAccountName(req.query.name,function (accountRes) {
                    res.send(accountRes);
                });
            }else{
                res.send(false);
            }
        });


        /**
         * signup request try to create a new account in database.
         * check if the body contain all the requireds informations,
         * then check if the email and name are free, (if not, send error 403)
         * then create account and send the user informations as json
         */
        HttpsHandler.app.post('/signup', function (req: Request, res : Response) {
            if ( req.body && req.body.email && req.body.password && req.body.name ){
                AccountData.checkAccount(req.query.email,function (accountRes) {
                    AccountData.checkAccountName(req.query.email,function (nameRes) {
                        if ( !accountRes && !nameRes ){
                            AccountData.createAccount(req.body.email, req.body.password, req.body.name, 0, function (account) {
                                res.status(200).json(account);
                            });
                        }else{
                            res.status(403).json('email or name incorrect');
                        }
                    });
                });
            }else{
                res.status(403).json('body request incorrect');
            }
        });
        /**
         * signin create a token if email and password
         * send the token back if correct,
         * send error 401 if not, or 403 if body invalid
         */
        HttpsHandler.app.post('/signIn', function (req: Request, res : Response) {
            if ( req.body && req.body.email && req.body.password ){
                AccountData.readAccount(req.body.email, req.body.password, function (accountRes) {
                    if ( accountRes ){
                        var token = Security.createToken(accountRes) ;
                        res.status(200).json(token);
                    }else{
                        res.status(401).json('error');
                    }
                });
            }else{
                res.status(403).json('body invalid');
            }
        });

        /**
         * user send the user informations as email, name, admin rights etc...
         * only if the token in the header is valid,
         * else send 401 if not or 403 if body invalid
         */
        HttpsHandler.app.get('/user', function (req: Request, res : Response) {
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
        /**
         * RefreshToken create a new token from an other token if valid
         * if not, send error 401, or 403 if no token in header
         */
        HttpsHandler.app.get('/refreshToken', function (req: Request, res : Response) {
            const token = req.headers.authorization ;
            if ( token ){

                Security.checkToken(token, function (userRes) {
                   if ( userRes ){
                       delete userRes['exp'];
                       delete userRes['iat'];
                       const newToken = Security.createToken(userRes) ;
                       res.status(200).json(newToken);
                   } else{
                       res.status(401).json('wrong token');
                   }
                });
            }else{
                res.status(403).json('no token to refresh!');
            }
        });
    }

}
