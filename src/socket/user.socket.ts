import { getPattern } from "./../patterns/main.patterns";
import { Socket } from "socket.io";
import { readAccountByToken } from "../controllers/account.controller";
import { getOnPositions } from "../controllers/world.controller";
import { initCharaSocket } from "./chara.socket";
import { readToken } from "../controllers/token.controller";
import { initAdminSocket } from "./admin.socket";

export const io: WebSocket = null;

export const runSocket = (http) => {
  io = require("socket.io")(http, { origin: "*:*" });

  io.on("connection", (socket: Socket) => {
    socket.on("test", (val) => {
      console.log(val);
    });

    console.log('socket try connection', socket.handshake.query)

    if (socket.handshake.query["token"] != null) {

      readToken( socket.handshake.query["token"], resToken => {

        console.log('token found for socket co', resToken );

        if ( resToken && resToken['id'] ){
          readAccountByToken(socket.handshake.query["token"], (account) => {
            if (account && account["world"] && account["chara"]) {
              socket["account"] = account;
              socket.join(account["world"]);
              initCharaSocket(socket, account);
            }
          });
        }else if ( resToken && resToken['admin'] ){
          socket["admin"] = resToken ;
          initAdminSocket(socket);
        }

      });


    }
  });
};
