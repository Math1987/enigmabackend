import {
  checkEmailRequest,
  checkNameRequest,
} from "./../controllers/account.controller";
const express = require("express");
const router = express.Router();

router.get(`/`, function (req, res) {
  res.status(200).send("account route");
});

router.get("/checkEmail", checkEmailRequest);

router.get("/checkName", checkNameRequest);

router.post("/signup", function (req: Request, res: Response) {});

router.post("/confirm", (req: Request, res: Response) => {});

router.post("/signIn", function (req: Request, res: Response) {});

export const routerAccount = router;
