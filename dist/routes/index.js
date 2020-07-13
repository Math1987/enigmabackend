"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
exports.index = express.Router();
exports.index.get('/', (req, res) => {
    res.send('geting index');
});
