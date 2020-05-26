/**
 * Security manage token usage with JWT,
 * using a private key write in rsa folder
 */
import {HttpsHandler} from "../https.handler";

const jwt = require('jsonwebtoken');
const fs = require('fs');
const RSA_KEY_PRIVATE = fs.readFileSync('dist/rsa/key');
const TOKEN_TIME = '900s';


export class Security{


    static checkSecurity(){

    }

    /**
     * createTOken send back a new token from informations (as email, id etc...)
     */
    static createToken(informations ){
        return jwt.sign(informations,RSA_KEY_PRIVATE, {algorithm: 'HS256', expiresIn: TOKEN_TIME});
    }

    /**
     * checkToken verify if token
     * Send user informations (as email, id ect...) in callBack if valid
     * if not send null
     */
    static checkToken(token, callBack){
        if ( token ){
            jwt.verify(token, RSA_KEY_PRIVATE, (err, decoded)=>{
                if (err){
                    callBack(null);
                }else{
                    callBack(decoded);
                }
            });
        }else{
            callBack(null);
        }
    }

}
