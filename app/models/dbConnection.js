var mysql = require('mysql');
var dbConfig = require('../../config/database');

var dbConfigDebug = require('debug')('connection:config');
var dbSetupDebug = require('debug')('connection:init');

//Create a promise that returns a new connection, or an existing conneciton if it is valid
var getConnection = function(resolve, reject) {
    dbConfigDebug('Host: :' + dbConfig.host);
    dbConfigDebug('User: :' + dbConfig.user);
    dbConfigDebug('Password: :' + dbConfig.password);

    var connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password
    });

    return new Promise((resolve, reject) => {
        if (connection.state === 'disconnected') {

            //Create new connection
            connection.connect(function(err) {
                if (err) {
                    dbSetupDebug('error connecting: ' + err.stack);
                    reject(err);
                }
                dbSetupDebug('connected as id ' + connection.threadId);

                //Set database
                connection.query('USE node_app_dev', function(err, rows) {
                    if (err) {
                        dbSetupDebug('Error on "USE node_app_dev"' + err);
                        reject(err);
                    }

                    dbSetupDebug('Connection state: ' + connection.state);
                    dbSetupDebug('Using node_app_dev');

                    //Dont resolve until after queries have finished
                    resolve(connection);
                });
            });
        } else if (connection.state === 'authenticated') {
            resolve(connection);
        } else {
            reject('Connection state is wrong');
        }
    });
}

module.exports = { getConnection: getConnection };