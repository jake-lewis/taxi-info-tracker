var map = require('./map');
var googleApiKeys = require('../config/googleAPI')

module.exports = function(app, passport) {

    app.get('/*', function(req, res, next) {
        res.locals.user = req.session.user;
        next();
    });

    //Index (with login links)
    app.get('/', function(req, res) {
        res.render('index', { title: 'Taxi Info Tracker' });
    });

    //About page
    app.get('/about', function(req, res) {
        res.render('about', { title: 'About Page' });
    });

    app.get('/route', function(req, res) {
        res.render('route');
    })

    //Map API test
    app.post('/getRoute', function(req, res) {

        var query = {
            origin: req.body.origin,
            destination: req.body.destination,
            mode: 'driving'
        }

        var route;

        map.getRoute(query, function(err, response) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(response.json);

            res.render('route', { user: req.session.user, route: response, key: googleApiKeys.mapWebService });
        }, googleApiKeys.javascriptMap);
    });

    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res) {
        console.log(1);
        passport.deserializeUser(req.session.passport.user, req, function(err, user) {
            console.log(2);
            if (err) {
                console.log(3);
                return;
            }

            //User is user object from database, deserialised from user id
            req.session.user = {};
            req.session.user.id = user.id;
            req.session.user.username = user.username;
            console.log(4);

            res.render('profile', {
                user: req.session.user
            });
        });

        console.log(5);
        //res.redirect('/profile', {user: req.session.user});
        // res.render('profile', {
        //     user: req.session.user
        // });
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        //failureRedirect: '/about',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user: req.session.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.render('login', { message: 'You must be logged in to view this page.' });
    }
}