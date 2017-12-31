var mysql = require('mysql');
var dbConfig = require('../../config/database');
var connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
});

var dbSetupDebug = require('debug')('connection:init');

var connectionPromise = new Promise((resolve, reject) => {
    if (connection.state === 'disconnected') {
        connection.connect(function(err) {
            if (err) {
                dbSetupDebug('error connecting: ' + err.stack);
                reject(err);
            }
            dbSetupDebug('connected as id ' + connection.threadId);
        });

        connection.query('USE node_app_dev', function(err, rows) {
            if (err) {
                dbSetupDebug('Error on "USE node_app_dev"' + err);
                reject(err);
            }
            dbSetupDebug('Using node_app_dev');
        });

        dbSetupDebug('Connection state: ' + connection.state);
        resolve(connection);
    } else if (connection.state === 'authenticated') {
        resolve(connection);
    } else {
        reject('Connection state is wrong');
    }
});

var getConnection = function(resolve, reject) {
    connectionPromise.then(resolve, reject);
};

module.exports = { getConnection: getConnection };