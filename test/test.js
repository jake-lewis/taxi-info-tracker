var app = require('../app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;
var routeFactory = require('../app/models/routeFactory');
var dbConnection = require('../app/models/dbConnection');
var statistics = require('../app/statistics');

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

describe("Test statistics", function(done) {
    it("Data formatting (functional)", function(done) {
        var testData = JSON.parse('[{"finish":"2018-01-07T19:00:00.000Z","fare":31},{"finish":"2018-01-08T14:10:48.000Z","fare":30},{"finish":"2018-01-08T16:22:12.000Z","fare":7.6},{"finish":"2018-01-08T16:24:14.000Z","fare":7},{"finish":"2018-01-08T16:25:47.000Z","fare":12},{"finish":"2018-01-08T16:25:47.000Z","fare":12},{"finish":"2018-01-08T16:27:36.000Z","fare":12},{"finish":"2018-01-08T16:29:06.000Z","fare":45},{"finish":"2018-01-08T17:41:17.000Z","fare":13.47},{"finish":"2018-01-09T22:03:00.000Z","fare":40},{"finish":"2018-01-10T14:13:43.000Z","fare":50.55}]');
        var expectedResult = [['2018-01-07', 31], ['2018-01-08', 139.07], ['2018-01-09', 40], ['2018-01-10', 50.55]];

        var result = statistics.formatData(testData);

        assert.deepEqual(result, expectedResult);

        done();
    });
});