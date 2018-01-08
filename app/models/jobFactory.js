var debugCreate = require('debug')('jobFactory:create');
var debugStore = require('debug')('jobFactory:store');
var dbConnection = require('./dbConnection');

var factory = {
    //route, user id
    create: function(user, jobDetails) {
        var job = { 
            userId: user.id,
            username: user.username,
            origin: jobDetails.origin,
            destination: jobDetails.destination,
            start: jobDetails.datetime_start, 
            finish: jobDetails.datetime_finish, 
            fare: jobDetails.fare 
        };

        debugCreate('Created job: ' + job);

        return job;
    },

    store: function(userId, job, done) {
        if(!userId) {
            done('UserID cannot be null', null);
        } else {
            var insertQuery = 'INSERT INTO jobs (userId, username, origin, destination, start, finish, fare)' +
                'values (' + userId + ',"' + job.username + '","' + job.origin + '","' + job.destination +
                    '","' + job.start.replace('T', ' ') + '","' + job.start.replace('T', ' ') + '",' + job.fare + ')';

            var connection = dbConnection.getConnection();
            var resolve = function(connection) {
                connection.query(insertQuery, function(err, rows) {
                    if (err) {
                        debugStore(err);
                        done(err, null);
                    } else {
                        done(null, rows);
                    }
                });
            }

            var reject = function(err) {
                debugStore('Rejecting connection promise');
                done(err, null);
            };

            connection.then(resolve, reject);
        }
    }
};

module.exports = factory;