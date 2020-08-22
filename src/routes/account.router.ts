import {
  checkEmailRequest,
  checkNameRequest,
  confirmRequest,
  signUpRequest,
  singInRequest,
  readAccountRequest,
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

export const routerAccount = router;
