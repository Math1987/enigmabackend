import { createToken, readToken } from "./token.controller";

export const adminLoginReq = (req, res) => {

    if ( req.body && req.body['user'] && req.body['password'] ){

        if ( req.body['user'] === "Math17" && req.body['password'] === "test" ){
            const token = createToken({admin: "Math17"});
            console.log('token created', token);
            res.status(200).send({token : token});
        }else{
            res.status(401).send('wrong datas');
        }

    }else{
        res.status(401).send('need user and password');
    }

}


export const midleWearTokenSecurADMIN = (req:Request, res: Response, next ) => {

    const token = req.headers['authtoken'];
    console.log('token test ', token);
    if (token) {
        readToken(token, values => {
            console.log('values in admin token', values);
            if ( values['admin'] ){
                next();
            }else{
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
    } else {
      res.status(401).send("need token");
    }

}