import { readAccountDataById, checkEmailData, checkAccountNameData, readAccountData, replacePasswordData } from "./../data/account.data";
import { IV, sendWelcomEmail, confirmEmail, encrypt, sendResetEmail, decrypt } from "./email.controller";
import { createToken, readToken } from "./token.controller";
import { readCharaById } from "../data/player.data";
import { readChara } from "./chara.controller";

const checkEmail = (email: string, callback: Function) => {
  checkEmailData(email, (accountRes) => {
    if (accountRes && accountRes.length > 0  ){
      callback(true);
    }else{
      callback(null);
    }
  });
};
const checkName = (name: string, callback: Function) => {
  checkAccountNameData(name, (accountRes) => {
    if ( accountRes && accountRes.length > 0 ){
      callback(true);
    }else{
      callback(null);
    }
  });
};
const readAccountByToken = (token: string, callback: Function ) => {
  if ( token ){
    readToken(token, tokenRes => {
      if ( tokenRes && tokenRes['id'] ){
        readAccountDataById( tokenRes['id'], accountRes =>{
          if ( accountRes && accountRes['world'] ){

            readChara(accountRes['world'], accountRes['id'], charaRes => {
              if ( charaRes ){
                accountRes['chara'] = charaRes ;
              }
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
    checkEmailData(req.body.email, (accountRes) => {
      if (accountRes&& accountRes.length >0 ){
        res.status(401).send('already exist');
      }else{
        checkAccountNameData(req.body.name, (nameRes) => {
          if (!nameRes || nameRes.length <= 0) {
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
    readAccountData(req.body.email, req.body.password, (
      accountRes
    ) => {
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
export const resetPasswordRequest = (req: Request, res : Response ) => {

  checkEmail(req.body['email'], resEmail => {

    if ( resEmail ){

      sendResetEmail(req.body['email']);

      res.status(200).send('ok');

    }else{
      res.status(404).send('email not found');
    }
  })
}

export const confirmResetPasswordRequest = (req: Request, res : Response ) => {

  console.log(req.body['code']);
  const email = decrypt({ iv: IV, encryptedData: req.body['code'] });
  if ( email ){

    replacePasswordData(email, req.body['password'], resData => {
      res.status(200).send(resData);
    });

  }

}