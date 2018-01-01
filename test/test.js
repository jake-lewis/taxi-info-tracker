var app = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var jobFactory = require('../app/models/jobFactory');
var dbConnection = require('../app/models/dbConnection');

// UNIT test begin

chai.use(chaiHttp);

describe("Basic Server Functionality", function() {

    // #1 should return home page
    it("returns homepage", function(done) {
        // calling home page
        chai.request(app)
            .get("/")
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

});

describe("Test Factories", function() {

    // #1 Test if job factory works
    it("Job Factory", function(done) {
        var testRoute = { route: "route" };

        var job = jobFactory.create(5, 'zezblit', testRoute);

        job.userId.should.equal(5);
        job.username.should.equal('zezblit');
        job.route.should.equal(testRoute);
        done();
    });

    it("Connection promise", function() {

        //Mocha handles returning a Promise, without needing a failure handler or done() callback
        return dbConnection.getConnection().then((connection) => {
            connection.state.should.equal('authenticated');
        });
    });
});