"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midleWearTokenSecurADMIN = exports.adminReadTokenReq = exports.adminLoginReq = void 0;
const token_controller_1 = require("./token.controller");
exports.adminLoginReq = (req, res) => {
    if (req.body && req.body['user'] && req.body['password']) {
        if (req.body['user'] === "Math17" && req.body['password'] === "test") {
            const token = token_controller_1.createToken({ admin: "Math17" });
            console.log('token created', token);
            res.status(200).send({ token: token });
        }
        else {
            res.status(401).send('wrong datas');
        }
    }
    else {
        res.status(401).send('need user and password');
    }
};
exports.adminReadTokenReq = (req, res) => {
    const token = req.headers['authtoken'];
    console.log('token test ', token);
    if (token) {
        token_controller_1.readToken(token, values => {
            if (values['admin']) {
                res.status(200).send({ admin: values['admin'] });
            }
            else {
                res.status(401).send("wait a minute...you're not an admin!!!");
            }
        });
    }
    else {
        res.status(401).send("token not valid");
    }
};
exports.midleWearTokenSecurADMIN = (req, res, next) => {
    const token = req.headers['authtoken'];
    console.log('token test ', token);
    if (token) {
        token_controller_1.readToken(token, values => {
            console.log('values in admin token', values);
            if (values['admin']) {
                next();
            }
            else {
                res.status(401).send("wait a minute...you're not an admin!!!");
            }
        });
        //   readAccountByToken(token, (values) => {
        //     console.log('values found from token', values);
        //     req["account"] = values;
        //     next();
        //     // if ( values['admin'] ){
        //     //   next();
        //     // }else{
        //     //   res.status(401).send("wait a minute...you're not an admin!!!");
        //     // }
        //   });
    }
    else {
        res.status(401).send("need token");
    }
};
