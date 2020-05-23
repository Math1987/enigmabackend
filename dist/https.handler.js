"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpsHandler {
    static init(app) {
        HttpsHandler.app = app;
    }
}
exports.HttpsHandler = HttpsHandler;
HttpsHandler.app = null;
