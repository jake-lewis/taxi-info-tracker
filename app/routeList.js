var dbConnection = require('./models/dbConnection');

var debug = require('debug')('routeList');

var getRoutes = function(user, routeId, done) {

    //If no route specified
    if (done == null) {
        done = routeId;
        routeId = null;
    }

    debug('Called get routes');

    var connection = dbConnection.getConnection();

    var resolve = function(connection) {
        debug('Resolving');

        //TODO Remove test code
        if (connection.state === "authenticated") {
            debug('Connection valid');

            var userId = user.id;
            var routeCondition = routeId ? 'id = ' + routeId + ' AND' : '';
            var routeQuery = 'SELECT * FROM routes WHERE ' + routeCondition + ' userId = ' + userId;

            connection.query(routeQuery, function(err, rows) {
                done(err, rows);
            });

        } else {
            debug('Connection in invalid state: ' + connection.state);
            done("connection is broken", null);
        }
    };

    var reject = function(err) {
        debug('Rejecting');
        console.error(err);
    }

    connection.then(resolve, reject);
};

var routeList = { getRoutes: getRoutes };

module.exports = routeList;