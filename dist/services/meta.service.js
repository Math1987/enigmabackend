"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_handler_1 = require("../https.handler");
const meta_data_1 = require("../data/meta.data");
class MetaService {
    static init(callBack) {
        https_handler_1.HttpsHandler.getBackend(`/metadatas`, function (req, res) {
            meta_data_1.MetaData.readMetaDatas(function (metadatas) {
                res.status(200).json(metadatas);
            });
        });
        callBack('done');
    }
}
exports.MetaService = MetaService;
