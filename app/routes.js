var routeList = require('./routeList');
var jobList = require('./jobList');
var routeFactory = require('./models/routeFactory');
var jobFactory = require('./models/jobFactory');
var googleApiKeys = require('../config/googleAPI');

module.exports = function(app, passport) {

    app.get('/*', function(req, res, next) {
        res.set('X-Clacks-Overhead', 'GNU Terry Pratchett')
        res.locals.user = req.user;
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
        res.render('route', {javascriptMapKey: googleApiKeys.javascriptMap});
    });

    app.post('/route', function(req, res) {
        var route = routeFactory.create(req.body);
        var userId = req.user.id;

        routeFactory.store(userId, route, function(err, result) {
            if (err) { 
                console.log(err);
                res.render('error', err);
            }

            route.id = result.insertId;
            route.userId = userId;
        });

        res.end();
    });

    app.get('/routeList', isLoggedIn, function(req, res) {
        routeList.getRoutes(res.locals.user, function(err, routeList) {
            if (err) {
                res.status(500);
                res.render('error', err);
            } else {
                res.render('routeList', { routeList });
            }
        });
    });

    app.get('/createJob', isLoggedIn, function(req, res, next) {
        if (req.query.routeId) {
            //Create job from specific route
            routeList.getRoutes(res.locals.user, req.query.routeId, function(err, routeList) {
                if (err) {
                    res.status(500);
                    res.redirect('error', err);
                } else {
                    res.render('createJob', { routeList });
                }
            });
        } else {
            //Render list of routes for user, they can select which route to use
            routeList.getRoutes(res.locals.user, function(err, routeList) {
                if (err) {
                    res.status(500);
                    res.redirect('error', err);
                } else {
                    res.render('routeList', { routeList });
                }
            });
        }
    });

    app.post('/createJob', isLoggedIn, function(req, res, next) {
        var job = jobFactory.create(req.user, req.body);
        var userId = req.user.id;
        
        jobFactory.store(userId, job, function(err, result) {
            if (err) { 
                console.error(err);
                return;
            }

            job.id = result.insertId;
            job.userId = userId;
            res.redirect('jobList');
        });
        
        //TODO render job list?
    });

    app.get('/jobList', isLoggedIn, function(req, res) {
        jobList.getJobs(res.locals.user, function(err, jobList) {
            if (err) {
                res.status(500);
                res.render('error', err);
            } else {
                res.render('jobList', { jobList });
            }
        });
    });

    app.get('/jobDetails', isLoggedIn, function(req, res) {
        if (req.query.jobId) {
            //View details for a specific job
            jobList.getJobs(res.locals.user, req.query.jobId, function(err, jobList) {
                if (err) {
                    res.status(500);
                    res.redirect('error', err);
                } else {
                    res.render('jobDetails', { jobList: jobList, javascriptMapKey: googleApiKeys.javascriptMap});
                }
            });
        } else {
            //Render list of jobs for user, they can select which job to use
            jobList.getJobs(res.locals.user, function(err, jobList) {
                if (err) {
                    res.status(500);
                    res.redirect('error', err);
                } else {
                    res.render('jobList', { jobList });
                }
            });
        }
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
                delete req.user.password;

                //TODO IF has origin url, render that instead
                if(req.session.originalUrl) {
                    return res.redirect(req.session.originalUrl);
                }

                //res.redirect('profile');
                return res.render('profile', { user: req.user });
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
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        delete req.user;
        req.logout();
        res.redirect('/');
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        //record origin ID
        req.session.originalUrl = req.originalUrl;

        // if they aren't redirect them to the home page
        res.render('login', { message: 'You must be logged in to view this page.' });
    }
}