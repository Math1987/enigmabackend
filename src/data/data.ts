export class Data{

    private static HOST = 'localhost' ;
    private static USER = "root" ;
    private static PASSWORD = '' ;
    private static DB_NAME = "enigma_db";

    private static CONNECTION ;

    private static ACCOUNT = 'account' ;
    private static WORLDS = 'worlds' ;

    static init(callBack){

        let mysql = require('mysql');
        Data.CONNECTION = mysql.createConnection({
            host: Data.HOST,
            user: Data.USER,
            password: Data.PASSWORD,
            database: Data.DB_NAME
        });

        Data.initAccount(function (account) {

        });


    }
    static initAccount(callBack){
        Data.CONNECTION.query(`
        create table if not exists ${Data.ACCOUNT}(
        id INT PRIMARY KEY AUTO_INCREMENT,
        email varchar(154),
        password text,
        name varchar(154),
        admin INT
        )
        `, function (err, res) {
            if( err ){
                console.error(err);
                callBack(null);
            }else{
                callBack(res);
            }

        });
    }
    static checkAccount(email:string, callBack){
        Data.CONNECTION.query(`
        SELECT email from ${Data.ACCOUNT}
        WHERE email = "${email}"
        `, function (err, res) {
            if ( err ){
                console.error(err);
                callBack(null);
            }else{
                if ( res && res.length > 0 ){
                    callBack(true);
                }else{
                    callBack(false);
                }
            }
        });
    }
    static checkAccountName(name:string, callBack){
        Data.CONNECTION.query(`
        SELECT email from ${Data.ACCOUNT}
        WHERE name = "${name}"
        `, function (err, res) {
            if ( err ){
                console.error(err);
                callBack(null);
            }else{
                if ( res && res.length > 0 ){
                    callBack(true);
                }else{
                    callBack(false);
                }
            }
        });
    }
    static createAccount(email:string, password:string, name: string, admin:number, callBack){
        Data.CONNECTION.query(`
        INSERT INTO ${Data.ACCOUNT}
        (id, email, password, name, admin)
        VALUES (0, "${email}", MD5("${password}"), "${name}", ${admin})
        `, function (err, res) {
            if (err){
                console.error(err);
                callBack(null);
            }else{
                callBack({email: email, password: password});
            }
        })
    }
    static readAccount(email, password, callBack){
        Data.CONNECTION.query(`
        SELECT * FROM ${Data.ACCOUNT} 
        WHERE email = "${email}" AND password = MD5("${password}")
        `, function (err, res) {
           if ( err ){
               console.error(err);
               callBack(null);
           }else{
               if ( res && res.length > 0 ){
                   delete res[0]['password'];
                   callBack(res[0]);
               }else{
                   callBack(null)
               }
           }
        });
    }

}
