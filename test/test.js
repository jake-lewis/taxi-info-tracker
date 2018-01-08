var app = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var routeFactory = require('../app/models/routeFactory');
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

    it("Connection promise", function() {

        //Mocha handles returning a Promise, without needing a failure handler or done() callback
        return dbConnection.getConnection().then((connection) => {
            connection.state.should.equal('authenticated');
        }).catch((error) => {
            assert.isNotOk(error, 'Promise error');
        });
    });
});

describe("Test authentication", function(done) {

    //Increased timeout
    it("Successful Login", function(done) {
        chai.request(app)
            .post('/login')
            .send({
                username: 'testUser',
                password: 'password'
            })
            .end(function(err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    }).timeout(50000);

    it("Failed Login", function(done) {

        chai.request(app)
            .post('/login')
            .send({
                username: 'testUser',
                password: 'error'
            })
            .end(function(err, res) {
                //Apparently checking against err for "Unauthorized" doesn't work with chai-http ¯\_(ツ)_/¯
                expect(res).to.have.status(401);
                done();
            });
    }).timeout(50000);
});