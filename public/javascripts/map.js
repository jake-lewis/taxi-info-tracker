function initMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService();
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);
    directionsService.route(route, function(result, status) {
        if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });
};