"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStorage = void 0;
const LocalStorage = require("node-localstorage").LocalStorage;
exports.localStorage = new LocalStorage('./scratch');
