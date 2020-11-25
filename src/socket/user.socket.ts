import { getPattern } from "./../patterns/main.patterns";
import { Socket } from "socket.io";
import { readAccountByToken } from "../controllers/account.controller";
import { getOnPositions } from "../controllers/world.controller";
import { initCharaSocket } from "./chara.socket";

export const io: WebSocket = null;

export const runSocket = (http) => {
  io = require("socket.io")(http, { origin: "*:*" });

  io.on("connection", (socket: Socket) => {
    socket.on("test", (val) => {
      console.log(val);
    });

    console.log('socket try connection', socket.handshake.query)

    if (socket.handshake.query["token"] != null) {
      readAccountByToken(socket.handshake.query["token"], (account) => {
        console.log('someone try to connect with socket', account);
        if (account && account["world"] && account["chara"]) {
          socket["account"] = account;
          socket.join(account["world"]);
          initCharaSocket(socket, account);
        }
      });
    }
  });
};
