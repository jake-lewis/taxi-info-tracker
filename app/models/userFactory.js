var bcrypt = require('bcrypt-nodejs');
var debug = require('debug')('factory:user');

var factory = {
    create: function(username, password) {
        debug('Username: ' + username + ' Password: ' + password);
        var user = {
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
        };

        debug('Hashed password: ' + user.password);

        return user;
    }
};

module.exports = factory;