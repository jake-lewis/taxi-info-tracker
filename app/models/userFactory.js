var bcrypt = require('bcrypt-nodejs');

var factory = {
    create: function(username, password) {
        var user;
        user.username = username;
        user.password = password;

        user.generateHash = function() {
            return bcrypt.hashSync(user.password, bcrypt.genSaltSync(12), null);
        }

        user.validPassword = function() {
            return bcrypt.compareSync(user.password, this.local.password);
        }

        return user;
    }
};