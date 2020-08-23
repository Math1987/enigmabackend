import { MainPatterns } from "./../patterns/main.patterns";
import { Socket } from "socket.io";
import { readAccountByToken } from "../controllers/account.controller";
import { getOnPositions } from "../controllers/world.controller";

export const io: WebSocket = null;

export const runSocket = (http) => {
  io = require("socket.io")(http, { origin: "*:*" });

  io.on("connection", (socket: Socket) => {
    socket.on("test", (val) => {
      console.log(val);
    });

    if (socket.handshake.query["token"] != null) {
      readAccountByToken(socket.handshake.query["token"], (account) => {
        if (account && account["world"] && account["chara"]) {
          socket["account"] = account;
          socket.join(account["world"]);

          const id = account["id"];
          const world_name = account["world"];

          const key = account["chara"]["key_"];

          console.log(id, key);

          socket.on("getOnPositions", (positions: [], callback) => {
            getOnPositions(account["world"], positions, callback);
          });

          socket.on("move", (x, y, callback) => {
            console.log(id);
            let pattern = MainPatterns.getPattern(key);
            if (pattern) {
              pattern.move(world_name, id, x, y, callback);
            }
          });
        }
      });
    }
  });
};
