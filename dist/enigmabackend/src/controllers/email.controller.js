"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomEmail = exports.confirmEmail = void 0;
const account_data_1 = require("./../data/account.data");
const environment_1 = require("./../environment/environment");
const nodemailer = require("nodemailer");
const sparkPostTransport = require("nodemailer-sparkpost-transport");
let transporter = null;
if (environment_1.environment.mode === "prod") {
    transporter = nodemailer.createTransport(sparkPostTransport({
        sparkPostApiKey: "a85b730b332f3feccd149c8d61ed531e94d77ab8",
    }));
}
else {
    transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "6cd4df2b779edf",
            pass: "99902d2b39d776",
        },
    });
}
const emailChecker = {};
const crypto = require("crypto");
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
function encrypt(text) {
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}
function decrypt(text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.confirmEmail = (code, callBack) => {
    if (emailChecker[code]) {
        let email = decrypt({ iv: iv, encryptedData: code });
        if (emailChecker[code]["email"] === email) {
            account_data_1.AccountData.createAccount(emailChecker[code].email, emailChecker[code].password, emailChecker[code].name, 0, function (account) {
                callBack(emailChecker[code]);
            });
        }
        else {
            callBack(false);
        }
    }
    else {
        callBack(false);
    }
};
function sendWelcomEmail(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var crypter = encrypt(user["email"]);
            emailChecker[crypter.encryptedData] = user;
            console.log(crypter.encryptedData);
            const data = yield transporter.sendMail({
                from: "enigma@terrajdr.com",
                to: user["email"],
                subject: "Bienvenue sur Enigma!",
                text: `Bonjour ${user["name"]}. 
      \n Bienvenue sur Enigma! 
      \n Cliquez sur ce lien pour activer votre compte: 
      \n ${environment_1.environment.frontURL}/confirmer?${crypter.encryptedData}`,
            });
            console.log("email ok");
        }
        catch (e) {
            console.log("error ", e);
        }
    });
}
exports.sendWelcomEmail = sendWelcomEmail;
//main();
var crypter = encrypt("bonjour@test.com");
console.log(crypter.encryptedData);
