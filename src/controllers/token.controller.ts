/**
 * Security manage token usage with JWT,
 * using a private key write in rsa folder
 */
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const RSA_KEY_PRIVATE = fs.readFileSync(
  path.join(__dirname, "..", "rsa", "key")
); //'dist/rsa/key');
const TOKEN_TIME = "1000000s";


export const createToken = (informations) => {
  return jwt.sign(informations, RSA_KEY_PRIVATE, {
    algorithm: "HS256",
    expiresIn: TOKEN_TIME,
  });
}

export const readToken = (token, callBack)=>{
  if (token != null) {
    jwt.verify(token, RSA_KEY_PRIVATE, (err, decoded) => {
      if (err) {
        callBack(null);
      } else {
        callBack(decoded);
      }
    });
  } else {
    callBack(null);
  }
}


export const useSecurRoute (req, res, next) => {

  const token = req.headers.authorization;
  if (token) {
    readToken(token, function (userRes) {
      if (userRes) {
        req.headers["userTokenValues"] = userRes;
        req["user"] = userRes;
        next();
      } else {
        res.status(401).json("token invalid");
      }
    });
  } else {
    res.status(401).send("need token");
  }

}