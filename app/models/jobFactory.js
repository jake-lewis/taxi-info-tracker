var debug = require('debug')('factory:route');

var factory = {
    //route, user id
    create: function(user, jobDetails) {
        var route = { origin: jobDetails.origin, destination: jobDetails.destination };
        return { 
            userId: user.id,
            username: user.username,
            route: route,
            start: jobDetails.datetime_start, 
            finish: jobDetails.datetime_finish, 
            fare: jobDetails.fare 
        };
    }
};

module.exports = factory;