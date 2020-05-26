/**
 * Manage DataBase with mysql/mysqljs
 *
 * create tables in enigma_db (for dev mode)
 * handling Account informations (email, name, admin rights etc...),
 * and worlds informations.
 */
export class Data{

    private static HOST = 'localhost' ;
    private static USER = "root" ;
    private static PASSWORD = '' ;
    private static DB_NAME = "enigma_db";

    private static CONNECTION ;

    private static ACCOUNT = 'account' ;
    private static WORLDS = 'worlds' ;

    static init(callBack:CallableFunction){

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

    /**
     * Manage Account :
     * give back infromations form request.
     * Note that the attributes used in informations must be correct
     * (if possible not null or wrong types)
     */
    static initAccount(callBack:CallableFunction){
        let sql = `
            CREATE TABLE IF NOT EXISTS ${Data.ACCOUNT}(
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(154),
            password text,
            name VARCHAR(154),
            admin INT
            )
        `

        Data.successOrFail(sql, callBack)
    }

    static checkAccount(email:String, callBack:CallableFunction){
        let sql = `
            SELECT email from ${Data.ACCOUNT}
            WHERE email = "${email}"
        `

        Data.findOrFail(sql, callBack)
    }

    static checkAccountName(name:String, callBack:CallableFunction){
        let sql = `
            SELECT email from ${Data.ACCOUNT}
            WHERE name = "${name}"
        `

        Data.findOrFail(sql, callBack)
    }

    static createAccount(email:String, password:String, name:String, admin:Number, callBack:CallableFunction){
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

    static readAccount(email:String, password:String, callBack:CallableFunction){
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
                   let json = JSON.parse(JSON.stringify(res[0]));
                   callBack(json);
               }else{
                   callBack(null)
               }
           }
        });
    }

    /**
     * Query SQL or fail in console
     * @param sql
     * @param callBack
     */
    protected static successOrFail(sql:String, callBack:CallableFunction){
        Data.CONNECTION.query(sql
        , function (err, res) {
            if( err ){
                console.error(err);
                callBack(null);
            }else{
                callBack(res);
            }

        })
    }

    /**
     * Find at least one occurrence from SQL statement or fail in console
     * @param sql
     * @param callBack
     */
    protected static findOrFail(sql:String, callBack:CallableFunction){
        Data.CONNECTION.query(sql,
            function (err, res) {
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

}
