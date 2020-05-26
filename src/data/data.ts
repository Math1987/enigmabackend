import {WorldData} from "./world.data";

/**
 * Manage DataBase with mysql/mysqljs
 *
 * create tables in enigma_db (for dev mode)
 * handling Account informations (email, name, admin rights etc...),
 * and worlds informations.
 */
export class Data{

    constructor(){}
    /**
     * main informations to access to mysql
     */
    private static HOST = 'localhost' ;
    private static USER = "root" ;
    private static PASSWORD = '' ;
    private static MAIN_CO = null ;

    /**
     * global database informations and conection
     * about Accounts. Store email, password etc...
     */
    private static ACCOUNT_NAME = `enigma_accounts`;
    private static ACCOUNT_CO = null ;
    private static ACCOUNT_TABLE = 'account' ;

    /**
     * All databases concerning worlds.
     * Each one contain the world "enigma"
     * and all the tables below.
     * The table players contain commons informations
     * with main account database as id and name.
     */
    static WORLDS_CO : Object = {} ;
    static WORLD_TABLE_NAME = `world` ;
    static PLAYER_TABLE_NAME = `players` ;

    /**
     * First, create enigma_accounts database if not exist with a main mysql connection db.
     * Create an account_connection used for the first connection from backend (give back email, id and name)
     * Check all the enigma's worlds database and create a connection for each stored in WORLDS_CO object
     * @param callBack: when init finish confirm it with callBack
     */
    static init(callBack:CallableFunction){

        let mysql = require('mysql');
        Data.MAIN_CO = mysql.createConnection({
            host: Data.HOST,
            user: Data.USER,
            password: Data.PASSWORD
        });
        Data.MAIN_CO.query( `create database if not exists enigma_accounts`, function (err,res) {});


        Data.ACCOUNT_CO = mysql.createConnection({
            host: Data.HOST,
            user: Data.USER,
            password: Data.PASSWORD,
            database: Data.ACCOUNT_NAME
        });
        Data.initAccount(function (account) {
            callBack('init');
        });


        WorldData.readWorldsDbs(function (worlds: Array<string>) {
            if ( worlds ) {
                for (let world of worlds) {
                    Data.WORLDS_CO[world] = mysql.createConnection({
                        host: Data.HOST,
                        user: Data.USER,
                        password: Data.PASSWORD,
                        database: world
                    });
                }
            }
        })

    }

    /**
     * Manage Account :
     * give back infromations form request.
     * Note that the attributes used in informations must be correct
     * (if possible not null or wrong types)
     */
    static initAccount(callBack:CallableFunction){
        let sql = `
            CREATE TABLE IF NOT EXISTS ${Data.ACCOUNT_TABLE}(
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(154),
            password text,
            name VARCHAR(154),
            admin INT
            )
        `

        Data.successOrFail(Data.ACCOUNT_CO, sql, callBack)
    }
    static checkAccount(email:String, callBack:CallableFunction){
        let sql = `
            SELECT email from ${Data.ACCOUNT_TABLE}
            WHERE email = "${email}"
        `
        Data.findOrFail(sql, callBack)
    }
    static checkAccountName(name:String, callBack:CallableFunction){
        let sql = `
            SELECT email from ${Data.ACCOUNT_TABLE}
            WHERE name = "${name}"
        `

        Data.findOrFail(sql, callBack)
    }
    static createAccount(email:String, password:String, name:String, admin:Number, callBack:CallableFunction){
        Data.ACCOUNT_CO.query(`
        INSERT INTO ${Data.ACCOUNT_TABLE}
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
        Data.ACCOUNT_CO.query(`
        SELECT * FROM ${Data.ACCOUNT_TABLE} 
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
    public static successOrFail(co, sql:String, callBack:CallableFunction){
        co.query(sql
        , function (err, res) {
            if( err ){
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
    public static findOrFail(sql:String, callBack:CallableFunction){
        Data.ACCOUNT_CO.query(sql,
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
