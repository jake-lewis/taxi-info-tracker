var dbConnection = require('./models/dbConnection');

var debug = require('debug')('routeList');

var getRoutes = function(user, done) {

    debug('Called get routes');

    var connection = dbConnection.getConnection();

    var resolve = function(connection) {
        debug('Resolving');

        //TODO Remove test code
        if (connection.state === "authenticated") {
            debug('Connection valid');
            done(null, [{ "test": "Successful test" }]);
        } else {
            debug('Connection in invalid state: ' + connection.state);
            done("connection is broken", null);
        }

        // var userId = user.id;
        // connection.query('SELECT * ROUTE WHERE userId = ' + userId, function(err, rows) {
        //     done(err, rows);
        // });
    };

    var reject = function(err) {
        debug('Rejecting');
        console.error(err);
    }

    connection.then(resolve, reject)
};

var routeList = { getRoutes: getRoutes };

module.exports = routeList;