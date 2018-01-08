var dbConnection = require('./models/dbConnection');

var debug = require('debug')('statistics');

var getFares = function(userId, startDate, endDate, done) {

    if (userId && startDate && endDate) {
        var connection = dbConnection.getConnection();

        var resolve = function(connection) {;
            // select fare from jobs where userId = loggedIn AND start >= start AND finish <= endDate ORDER BY finish
            var fareQuery = 'SELECT finish, fare FROM jobs WHERE userId=' + userId + ' AND start >="' + startDate + '" AND finish <="' + endDate + '" ORDER BY finish;';

            console.log(fareQuery);

            connection.query(fareQuery, function(err, rows) {

                //rows are in format [[full date, fare], [full date, fare]]
                
                //Format date to YYYY-MM-DD
                rows = rows.map((currentValue) => ([new Date(currentValue.finish).toISOString().substring(0, 10), currentValue.fare]));

                //Get list of distince dates
                var dates = rows.map((row) => row[0]).filter((value, index, self) => self.indexOf(value) === index);

                //For each date, get the total fare
                var takings = dates.map((date) => rows.filter((row) => row[0] === date)).map((dayGroup) => dayGroup.reduce((total, row) => [total[0], total[1] + row[1]]));

                done(err, takings);
            });
        };

        var reject = function(err) {
            debug('Rejecting');
            done(err, null);
        }

        connection.then(resolve, reject);
    }
};

var statistics = { getFares: getFares}

module.exports = statistics;