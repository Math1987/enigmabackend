"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const path = require("path");
const fs = require("fs");
let mode = "dev";
if (process.env.MODE === "prod") {
    mode = "prod";
}
const file = fs.readFileSync(path.join(__dirname, `./${mode}.json`));
exports.environment = JSON.parse(file);
