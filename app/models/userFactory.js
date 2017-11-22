var bcrypt = require('bcrypt-nodejs');

var factory = {
    create: function(username, password) {
        var user = {
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)
        };

        user.generateHash = function() {
            return bcrypt.hashSync(user.password, bcrypt.genSaltSync(12), null);
        }

        user.validPassword = function(password) {
            return bcrypt.compareSync(user.password, this.local.password);
        }

        return user;
    }
};

module.exports = factory;