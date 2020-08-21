import { getChara, moveChara } from "./../controllers/chara.controller";
import { ValuesData } from "./../data/values.data";
import { MobilesData } from "./../data/mobile.data";
import { Security } from "./../services/security";
import { HttpBase } from "http";
import { Socket } from "socket.io";

export const io: WebSocket = null;

export class UserSocket {
  constructor() {}

  init(http) {
    io = require("socket.io")(http, { origin: "*:*" });

    io.on("connection", (socket: Socket) => {
      if (socket.handshake.query["token"] != null) {
        Security.checkToken(socket.handshake.query["token"], (user) => {
          if (user && user["world"]) {
            socket["user"] = user;
            socket["chara"] = {};
            socket.join(user["world"]);

            getChara(user["world"], user["id"], (chara) => {
              socket["chara"] = chara;
              socket.on("move", (x, y) => {
                moveChara(
                  user["world"],
                  socket["chara"],
                  x,
                  y,
                  (moveRes) => {}
                );
              });
            });
          }

          socket.on("disconnect", () => {});
        });
      }
    });
  }
}
