var map = require('./map');
var googleApiKeys = require('../config/googleAPI')

module.exports = function(app, passport) {

    app.get('/*', function(req, res, next) {
        console.log(req.session.user);
        next();
    })
0
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
            mode: 'driving'}

        var route;

        map.getRoute(query, function(err, response) {
            if (err) {
                console.error(err);
                return;
            }

            console.log(response.json);
            
            res.render('route', { route: response, key: googleApiKeys.mapWebService });
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
        passport.deserializeUser(req.session.passport.user, function(err, user) {
            if (err)
                return;

            //User is user object from database, deserialised from user id
            //console.log('User:');
            //console.log(user);
            //req.session.user not being set
            req.session.user = user;
            req.session.save(function(err){if (err) console.log(err)});

            console.log('req.session.user');
            console.log(req.session.user); //undefined
        });
        
        //res.redirect('/profile');
        res.render('profile', {
            id: req.user.id,
            username: req.user.username // get the user out of session and pass to template
        });
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
            user: req.user // get the user out of session and pass to template
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
        res.render('login', { message: 'You must be logged in to view this page.'});
    }
}