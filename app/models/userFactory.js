var bcrypt = require('bcrypt-nodejs');

var factory = {
    create: function(username, password) {
        var user = {
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
        };

        return user;
    }
};

module.exports = factory;