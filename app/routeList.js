var dbConnection = require('./models/dbConnection');

var debug = require('debug')('routeList');

var getRoutes = function(user, done) {

    debug('Called get routes');
    var connection = dbConnection.getConnection((connection) => {
            debug('Resolving');

            var userId = user.id;

            //TODO Remove test code
            if (connection.state === "authenticated") {
                debug('Connection valid');
                done(null, [{ "test": "Successful test" }]);
            } else {
                debug('Connection in invalid state: ' + connection.state);
                done("connection is broken", null);
            }

            // connection.query('SELECT * ROUTE WHERE userId = ' + userId, function(err, rows) {
            //     done(err, rows);
            // });
        },
        (err) => {
            debug('Rejecting');
            console.error(err);
            return;
        });
};

var routeList = { getRoutes: getRoutes };

module.exports = routeList;