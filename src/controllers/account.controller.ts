import { AccountData } from "./../data/account.data";
import { sendWelcomEmail, confirmEmail } from "./email.controller";
import { createToken, readToken } from "./token.controller";
import { readCharaById } from "../data/player.data";

const checkEmail = (email: string, callback: Function) => {
  AccountData.checkAccount(email, (accountRes) => {
    callback(accountRes);
  });
};
const checkName = (name: string, callback: Function) => {
  AccountData.checkAccountName(name, (accountRes) => {
    callback(accountRes);
  });
};
const readAccountByToken = (token: string, callback: Function ) => {
  if ( token ){
    readToken(token, tokenRes => {
      if ( tokenRes && tokenRes['id'] ){
        AccountData.readAccountById( tokenRes['id'], accountRes =>{
          if ( accountRes && accountRes['world'] ){
            readCharaById( accountRes['world'], accountRes['id'], charaRes => {
              accountRes['chara'] = charaRes ;
              callback(accountRes);
            });
          }else{
            callback(accountRes);
          }
        });
      }else{
        callback(null);
      }
    });
  }else{
    callback(null);
  }
}

export { readAccountByToken };

export const checkEmailRequest = (req, res) => {
  if (req.query && req.query.email) {
    checkEmail(req.query.email, (checkRes) => {
      res.status(200).send(checkRes);
    });
  } else {
    res.status(401).send("need data");
  }
};
export const checkNameRequest = (req, res) => {
  if (req.query && req.query.name) {
    checkName(req.query.name, (checkRes) => {
      res.status(200).send(checkRes);
    });
  } else {
    res.status(401).send("need data");
  }
};
export const signUpRequest = (req, res) => {
  if (req.body && req.body.email && req.body.password && req.body.name) {
    AccountData.checkAccount(req.body.email, (accountRes) => {
      if (accountRes){
        res.status(401).send('already exist');
      }else{
        AccountData.checkAccountName(req.body.name, (nameRes) => {
          if (!nameRes) {
            sendWelcomEmail(req.body);
            res.status(200).json(req.body);
          } else {
            res.status(403).json("email or name incorrect");
          }
        });
      }
    });
  } else {
    res.status(403).json("body request incorrect");
  }
};
export const confirmRequest = (req, res) => {
  if (req.body["code"]) {
    confirmEmail(req.body["code"], (confirmRes) => {
      res.status(200).send(confirmRes);
    });
  } else {
    res.status(200).send(false);
  }
});
export const singInRequest  = (req: Request, res: Response) => {
  if (req.body && req.body.email && req.body.password) {
    AccountData.readAccount(req.body.email, req.body.password, function (
      accountRes
    ) {
      if (accountRes) {

        let tokenVal = {id : accountRes.id };
        const token = createToken(tokenVal);
        let finalObj = {} ;
        Object.assign(finalObj, accountRes);
        finalObj['token'] = token ;

        if ( finalObj && finalObj['world'] ){
          readCharaById( finalObj['world'], finalObj['id'], charaRes => {
            finalObj['chara'] = charaRes ;
            res.status(200).json(finalObj);
          });
        }else{
          res.status(200).json(finalObj);
        }

      } else {
        res.status(401).json("error");
      }
    });
  } else {
    res.status(403).json("body invalid");
  }
});
export const readAccountRequest = (req: Request, res: Response ) => {
  if ( req.body && req.body.token ){
    readAccountByToken(req.body.token, accountRes => {
      if ( accountRes ){
        res.status(200).send(accountRes);
      }else{
        res.status(404).send(null);
      }
    });
  }else{
    res.status(401).send(null);
  }
}