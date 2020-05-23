import {Request, Response} from "express";
import {Data} from "./data/data";

export class HttpsHandler{

    static app = null ;

    static init(app) {
        HttpsHandler.app = app ;
    }

}
