var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');

var dbConfig = require('./database');

var connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
});

var factory = require('../app/models/userFactory');

connection.query('USE mysqldb');

//Exposed function
module.exports = function(passport) {
    //Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    //Deserialize the user for the session
    passport.deserializeUser(function(id, done) {
        connection.query('select * from users where id = ' + id, function(err, rows) {
            done(err, rows[0]);
        });
    });

    //Local Signup

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true //allows passing back to entire request to the callback
        },
        function(req, username, password, done) {
            //find a user whose username matches the given username
            connection.query("select * from users where username = '" + username + "'", function(err, rows) {
                console.log(rows);
                console.log("above row object");
                if (err) {
                    return done(err);
                }
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    //No error, username not taken

                    //Create user
                    var newUserMySQL = factory.create(username, password);

                    var insertQuery = "INSERT INTO users ( username, password ) values ('" + username + "','" + password + "')";
                    console.log(inserQuery);
                    connection.query(insertQuery, function(err, rows) {
                        newUserMySQL.id = rows.insertId;
                        return done(null, newUserMySQL);
                    });
                }
            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM 'users' WHERE 'username' = '" + username + "'", function(err, rows) {
                if (err) {
                    return done(err);
                }
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found'));
                }

                if (!(rows[0].password === password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }

                return done(null, rows[0]);
            });
        }
    ));
};