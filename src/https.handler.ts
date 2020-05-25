/**
 * Just give a static environement express for services
 */
export class HttpsHandler{

    static app = null ;

    static init(app) {
        HttpsHandler.app = app ;
    }

}
