"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpsHandler {
    static init(app) {
        HttpsHandler.app = app;
        app.get('/test', function (req, res) {
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send('test');
        });
    }
}
exports.HttpsHandler = HttpsHandler;
HttpsHandler.app = null;
