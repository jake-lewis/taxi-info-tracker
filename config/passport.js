var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var dbConnection = require('../app/models/dbConnection');
var userFactory = require('../app/models/userFactory');

var dbSetupDebug = require('debug')('passport:dbSetup');
var sessionDebug = require('debug')('passport:session');
var loginDebug = require('debug')('passport:login');
var signupDebug = require('debug')('passport:signup');

var connection = dbConnection.getConnection();
var reject = function(err) {
    debug('Rejecting connection promise');
    console.error(err);
};

//Exposed function
module.exports = function(passport) {

    //Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
        sessionDebug('Serialized user "' + user.username + '"');
    });

    //Deserialize the user for the session
    passport.deserializeUser(function(id, done) {
        connection.then((connection) => {
            connection.query('select * from users where id = ' + id, function(err, rows) {
                var user = {
                    id: rows[0].id,
                    username: rows[0].username,
                    password: rows[0].password
                };
                //puts user into session
                done(err, user);
                sessionDebug('Deserialized user "' + rows[0].username + '"');
            });
        }, reject);
    });

    //Local Signup

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true //allows passing back to entire request to the callback
        },
        function(req, username, password, done) {
            connection.then((connection) => {
                //find a user whose username matches the given username
                connection.query("select * from users where username = '" + username + "'", function(err, rows) {
                    signupDebug(rows);
                    signupDebug("above row object");
                    if (err) {
                        return done(err);
                    }
                    if (rows.length) {
                        signupDebug('Username already taken');
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        //No error, username not taken

                        //Create user
                        var newUserMySQL = userFactory.create(username, password);

                        var insertQuery = "INSERT INTO users ( username, password ) values ('" + newUserMySQL.username + "','" + newUserMySQL.password + "')";
                        signupDebug('Query: ' + insertQuery);
                        connection.query(insertQuery, function(err, rows) {
                            newUserMySQL.id = rows.insertId;
                            return done(null, newUserMySQL);
                        });
                    }
                });
            }, reject);
        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            connection.then((connection) => {
                connection.query("SELECT * FROM users WHERE username = '" + username + "'", function(err, rows) {
                    if (err) {
                        return done(err);
                    }
                    if (!rows.length) {
                        loginDebug('User not found');
                        req.flash('loginMessage', 'No user found');
                        return done(null, false, 401);
                    }

                    var hash = rows[0].password;

                    loginDebug('Username: ' + username + ', Password: ' + password);
                    loginDebug('Stored password:' + hash);

                    if (!(bcrypt.compareSync(password, hash))) {
                        loginDebug('Passwords don\'t match');
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }

                    return done(null, rows[0]);
                });
            }, reject);
        }
    ));
};