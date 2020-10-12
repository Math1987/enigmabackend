import {
  checkEmailRequest,
  checkNameRequest,
  confirmRequest,
  signUpRequest,
  singInRequest,
  readAccountRequest, 
  resetPasswordRequest,
  confirmResetPasswordRequest,
  readAccountByToken,
  midleWearTokenSecur,
  removeAccountRequest
} from "./../controllers/account.controller";
const express = require("express");
const router = express.Router();

router.get(`/`, function (req, res) {
  res.status(200).send("account route");
});

router.get("/checkEmail", checkEmailRequest);
router.get("/checkName", checkNameRequest);
router.post("/signup", signUpRequest);
router.post("/confirm", confirmRequest);
router.post("/signIn", singInRequest);
router.post("/readAccount", readAccountRequest);
router.post("/resetPassword", resetPasswordRequest);
router.post("/confirmResetPassword", confirmResetPasswordRequest);

router.use(midleWearTokenSecur);

router.get("/removeAccount", removeAccountRequest);

export const routerAccount = router;
