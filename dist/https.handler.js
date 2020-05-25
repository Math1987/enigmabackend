"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Just give a static environement express for services
 */
class HttpsHandler {
    static init(app) {
        HttpsHandler.app = app;
    }
}
exports.HttpsHandler = HttpsHandler;
HttpsHandler.app = null;
