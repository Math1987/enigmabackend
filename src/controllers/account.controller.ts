import { AccountData } from "./../data/account.data";

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
