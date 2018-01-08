var debugCreate = require('debug')('routeFactory:create');
var debugStore = require('debug')('routeFactory:store');
var dbConnection = require('./dbConnection');

var factory = {
    create: function(response) {

        if (response.status === 'OK') {
            var route = {
                //TODO multiple routes / legs?
                origin: response.routes[0].legs[0].start_address, // <- calculated value / entered value -> response.request.origin,
                destination: response.routes[0].legs[0].end_address, // <- calculated value / entered value -> response.request.destination
                distance: response.routes[0].legs[0].distance,
                duration: response.routes[0].legs[0].duration,
                routeJSON: response
            };

            debugCreate('Created route:' + route);

            return route;
        }

        debugCreate('Could not create route, status:' + response.status);

        return;
    },

    store: function(userId, route, done) {
        if (!userId) {
            debugStore('ERROR: User ID cannot be null');
            done('UserID cannot be null', null);
        } else {
            var insertQuery = 'INSERT INTO routes (userId, origin, destination) ' +
                'values (' + userId + ',"' + route.origin + '","' + route.destination + '")';

            var connection = dbConnection.getConnection();
            var resolve = function(connection) {
                connection.query(insertQuery, function(err, rows) {
                    
                    if (err) {
                        debugStore(err);
                        done(err, null);
                    }
        
                    done(null, rows);
                });
            }

            var reject = function(err) {
                debugStore('Rejecting connection promise');
                done(err, null);
            };

            connection.then(resolve, reject);
        }
    }
}

module.exports = factory;