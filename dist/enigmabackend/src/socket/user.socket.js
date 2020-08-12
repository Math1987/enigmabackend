"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSocket = void 0;
const values_data_1 = require("./../data/values.data");
const mobile_data_1 = require("./../data/mobile.data");
const security_1 = require("./../services/security");
class UserSocket {
    constructor() {
        this.io = null;
    }
    init(http) {
        this.io = require("socket.io")(http);
        this.io.on("connection", (socket) => {
            if (socket.handshake.query['token'] != null) {
                security_1.Security.checkToken(socket.handshake.query['token'], (user) => {
                    if (user && user['world']) {
                        socket['enigma'] = {};
                        values_data_1.ValuesData.readAsObject(user['world'], user['id'], (values) => {
                            if (values && values['moves'] && values['moves'] > 0) {
                                socket['enigma'] = values;
                                socket['enigma']['id'] = user['id'];
                                mobile_data_1.MobilesData.readById(user['world'], user['id'], mobile => {
                                    if (mobile) {
                                        socket['enigma']['key'] = mobile.key_;
                                        socket['enigma']['life'] = mobile.life;
                                        socket['enigma']['x'] = mobile.position.x;
                                        socket['enigma']['y'] = mobile.position.y;
                                    }
                                });
                            }
                        }, socket.join(user['world']));
                        socket.on('message', (message) => {
                        });
                        socket.on('move', (x, y) => {
                            console.log('move asked');
                            if (socket['enigma']) {
                                let position = socket['enigma'];
                                mobile_data_1.MobilesData.updatePosition(user['world'], user['id'], position.x + x, position.y + y, (resMove) => {
                                    if (resMove) {
                                        let newPosition = { x: position.x + x, y: position.y + y };
                                        socket['enigma']['x'] = newPosition.x;
                                        socket['enigma']['y'] = newPosition.y;
                                        this.io.in(user['world']).clients((err, clients) => {
                                            for (let socketID of clients) {
                                                let targetSocket = this.io['sockets']['connected'][socketID];
                                                if (targetSocket['enigma']) {
                                                    let targetPos = { x: targetSocket['enigma'].x, y: targetSocket['enigma'].y };
                                                    if (targetPos.x >= newPosition.x - 5 && targetPos.x <= newPosition.x + 5
                                                        && targetPos.y >= newPosition.y - 5 && targetPos.y <= newPosition.y + 5) {
                                                        let sender = {
                                                            id: socket['enigma']['id'],
                                                            key: socket['enigma']['key'],
                                                            life: socket['enigma']['life'],
                                                            x: socket['enigma']['x'],
                                                            y: socket['enigma']['y'],
                                                            z: 1
                                                        };
                                                        targetSocket.emit('move', sender, x, y);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            socket.on('disconnect', () => {
            });
        });
    }
}
exports.UserSocket = UserSocket;
;
