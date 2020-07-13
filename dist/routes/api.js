"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
exports.routerApi = express.Router();
exports.routerApi.get('/test', (req, res) => {
    res.send('api ok');
});
