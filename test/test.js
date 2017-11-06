var supertest = require("supertest");
var should = require("should");
var jsdom = require('jsdom');
const { JSDOM } = jsdom;

// This agent refers to PORT where the program is running.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("Basic Server Functionality", function() {

    // #1 should return home page
    it("returns homepage", function(done) {
        // calling home page
        server
            .get("/")
            .expect("Content-type", /text/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                done();
            });
    });

});

describe("Test Navbar Functionality", function() {

    // #1 should return home page
    it("applies active class for page", function(done) {
        // calling home page
        const indexDom = new JSDOM('', {
            url: 'http://localhost:3000/'
        });

        console.log(indexDom.window.document.querySelector('#index').textContent);
        // server
        //     .get("/")
        //     .expect("Content-type", /text/)
        //     .expect(200)
        //     .end(function(err, res) {
        //         //$('#index').hasClass('active').should.equal(true);
        //     });
        // server
        //     .get("/about")
        //     .expect("Content-type", /text/)
        //     .expect(200)
        //     .end(function(err, res) {
        //         //$('#about').hasClass('active').should.equal(true);
        //         done();
        //     });
        const aboutDom = new JSDOM('', {
            url: 'localhost:3001/about'
        });
    });

});