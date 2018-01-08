var dbConnection = require('./models/dbConnection');

var debug = require('debug')('jobList');

var getJobs = function(user, jobId, done) {

    //If no job specified
    if (done == null) {
        done = jobId;
        jobId = null;
    }

    debug('Called get jobs');

    var connection = dbConnection.getConnection();

    var resolve = function(connection) {
        debug('Resolving');

        //TODO Remove test code
        if (connection.state === "authenticated") {
            debug('Connection valid');

            var userId = user.id;
            var jobCondition = jobId ? 'id = ' + jobId + ' AND' : '';
            var jobQuery = 'SELECT * FROM jobs WHERE ' + jobCondition + ' userId = ' + userId;

            connection.query(jobQuery, function(err, rows) {
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

var jobList = { getJobs: getJobs };

module.exports = jobList;