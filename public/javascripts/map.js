function initMap() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var plymouth = new google.maps.LatLng(50.3755, -4.1427);
  var mapOptions = {
    zoom:13,
    center: plymouth
  }
  
  infoWindow = new google.maps.InfoWindow;
  
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      map.setCenter(pos);
      }, function() {
      handleLocationError(true);
      });
  } else {
      // Browser doesn't support Geolocation
      handleLocationError(false);
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
}

function handleLocationError(browserHasGeolocation) {
  console.error(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function calcRoute() {
    
  var directionsService = new google.maps.DirectionsService();
  var start = document.getElementById('origin').value;
  var end = document.getElementById('destination').value;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      document.getElementById('save').disabled = false;
      directionsDisplay.setDirections(result);
    } else {
      document.getElementById('save').disabled = true;
    }
  });  
}

function saveRoute() {
  var result = directionsDisplay.getDirections();

  if(result.status == 'OK') {
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', window.location.href, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(result));
  }
}