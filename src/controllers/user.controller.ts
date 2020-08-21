import { confirmEmail } from './email.controller';
import { AccountData } from './../data/account.data';


export const confirmAccount(req, res){

  if ( req.query['confirm'] && confirmEmail( req.query['confirm'] )){
    AccountData.createAccount(
      req.body.email,
      req.body.password,
      req.body.name,
      0,
      function (account) {
  
        res.status(200).json(account);
      }
    );
  }else{
    res.status(401).send('need confirm code');
  }


}