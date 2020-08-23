"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Security = void 0;
/**
 * Security manage token usage with JWT,
 * using a private key write in rsa folder
 */
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const RSA_KEY_PRIVATE = fs.readFileSync(path.join(__dirname, "..", "rsa", "key")); //'dist/rsa/key');
const TOKEN_TIME = "900s";
class Security {
    static checkSecurity(req, res, next) {
        let token = req.headers.authorization; //req.headers.authorization.split(' ')[1] ;
        if (token) {
            Security.checkToken(token, function (userRes) {
                if (userRes) {
                    next();
                }
                else {
                    res.status(401).json("token invalid");
                }
                /*if ( userRes && req.body.userId && req.body.userId === userRes.id ){
                            next();
                        }else{
                            res.status(401).json('token invalid');
                        }*/
            });
        }
        else {
            res.send(null);
        }
    }
    /**
     * createTOken send back a new token from informations (as email, id etc...)
     */
    static createToken(informations) {
        return jwt.sign(informations, RSA_KEY_PRIVATE, {
            algorithm: "HS256",
            expiresIn: TOKEN_TIME,
        });
    }
    /**
     * checkToken verify if token
     * Send user informations (as email, id ect...) in callBack if valid
     * if not send null
     */
    static checkToken(token, callBack) {
        if (token != null) {
            jwt.verify(token, RSA_KEY_PRIVATE, (err, decoded) => {
                if (err) {
                    console.log(err);
                    callBack(null);
                }
                else {
                    callBack(decoded);
                }
            });
        }
        else {
            callBack(null);
        }
    }
}
exports.Security = Security;
