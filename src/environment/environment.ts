import { env } from "process";
const path = require("path");
const fs = require("fs");

let mode = "dev";
if (process.env.MODE === "prod") {
  mode = "prod";
}

const file = fs.readFileSync(path.join(__dirname, `./${mode}.json`));

export const environment = JSON.parse(file);
