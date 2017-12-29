var debug = require('debug')('factory:route');

var factory = {
    //route, user id
    create: function(userId, username, route) {
        return { userId: userId, username: username, route: route };
    }
};

module.exports = factory;