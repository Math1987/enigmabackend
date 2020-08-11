import * as path from "path";

const express = require('express');
export const indexRouter = express.Router();


indexRouter.get('*', function (req, res) {-
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
