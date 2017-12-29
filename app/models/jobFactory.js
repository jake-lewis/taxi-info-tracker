var passport = require('passport');
var debug = require('debug')('factory:route');

var factory = {
    //route, user id
    create: function(userId, username, route) {
        var job = {
            userId: userId,
            username: username,
            route: route
        };

        return job;
    }
};

module.exports = factory;