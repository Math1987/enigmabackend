"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_handler_1 = require("../https.handler");
const security_1 = require("./security");
/**
 * The account service manage all the requests about user's account,
 * as singin, singup, geting user informations etc...
 */
class AccountService {
    /**
     * The initiation use HttpsHandle static app as express with bodyparser
     */
    static init() {
        https_handler_1.HttpsHandler.getBackend('/test', function (req, res) {
            const nodeMailer = require('nodemailer');
            const transporter = nodeMailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'admin@math17api.com',
                    pass: '-CJNG@&G9,N['
                }
            });
            const mailOptions = {
                from: 'admin@math17api.com',
                to: 'mathieucolla@gmail.com',
                subject: "test de email envoyé depuis le backend",
                text: 'That was easy?'
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {

                }
            });
        });
        /**
         * signup request try to create a new account in database.
         * check if the body contain all the requireds informations,
         * then check if the email and name are free, (if not, send error 403)
         * then create account and send the user informations as json
         */
        https_handler_1.HttpsHandler.postBackend('testPost', function (req, res) {
            res.send('post ok');
        });
        /**
         * signin create a token if email and password
         * send the token back if correct,
         * send error 401 if not, or 403 if body invalid
         */
        /**
         * user send the user informations as email, name, admin rights etc...
         * only if the token in the header is valid,
         * else send 401 if not or 403 if body invalid
         */
        https_handler_1.HttpsHandler.getBackend('user', function (req, res) {
            const token = req.headers.authorization;
            if (token) {
                security_1.Security.checkToken(token, function (userRes) {
                    if (userRes) {
                        res.status(200).json(userRes);
                    }
                    else {
                        res.status(401).json('token invalid');
                    }
                });
            }
            else {
                res.status(401).json('no token');
            }
        });
        /**
         * RefreshToken create a new token from an other token if valid
         * if not, send error 401, or 403 if no token in header
         */
        https_handler_1.HttpsHandler.getBackend('refreshToken', function (req, res) {
            const token = req.headers.authorization;
            if (token) {
                security_1.Security.checkToken(token, function (userRes) {
                    if (userRes) {
                        delete userRes['exp'];
                        delete userRes['iat'];
                        const newToken = security_1.Security.createToken(userRes);
                        res.status(200).json(newToken);
                    }
                    else {
                        res.status(401).json('wrong token');
                    }
                });
            }
            else {
                res.status(403).json('no token to refresh!');
            }
        });
    }
}
exports.AccountService = AccountService;
