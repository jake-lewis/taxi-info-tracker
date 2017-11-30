var getRoute = function(query, callback, apiKey) {
    //query.origin = getLatLong(query.origin);
    //query.destination = getLatLong(query.destination);

    var googleMapsClient = require('@google/maps').createClient({
        key: apiKey
    });

    //using the geocoder as a local function call to deal with promise scope issues
    googleMapsClient.geocode({address: query.origin}, 
        function(err, response) {
            if (!err) {
                //console.log(response.json.results[0].geometry.location);
                query.origin = response.json.results[0].geometry.location;
            }
    });

    googleMapsClient.geocode({address: query.destination}, 
        function(err, response) {
            if (!err) {
                //console.log(response.json.results[0].geometry.location);
                query.destination = response.json.results[0].geometry.location;
            }
    });

    
    googleMapsClient.directions(query, callback);
};

var map = {getRoute: getRoute}

module.exports = map;