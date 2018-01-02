var map = require('./map');
var routes = require('./routeList');
var googleApiKeys = require('../config/googleAPI');

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

    app.get('/route', isLoggedIn, function(req, res) {
        res.render('route');
    });

    app.get('/routeList', isLoggedIn, function(req, res) {
        routes.getRoutes(res.locals.user, function(err, routeList) {
            if (err) {
                console.error(err);
            } else {
                res.render('routeList', { routeList });
            }
        });
    });

    //Map API test
    app.post('/route', function(req, res) {

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

    //Attempt at custom failure callback on post
    app.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                res.status(401);
                return res.render('login', { message: req.flash('loginMessage') });
            }
            req.logIn(user, function(err) {
                if (err) { console.log(err); return next(err); }

                //prevent password hash from being sent to client
                delete user.password;

                return res.render('profile', { user: user });
            });
        })(req, res, next);
    });

    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user: req.session.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        delete req.session.user;
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