var loaded = false;

function renderMap() {
    if(!loaded) {
        initMap();
        loaded = true;
    }
    calcRoute();
    document.getElementById('map_container').style.display = 'block';
    document.getElementById('showMap').disabled = true;
    document.getElementById('hideMap').disabled = false;
}

function hideMap() {
    document.getElementById('map_container').style.display = 'none';
    document.getElementById('showMap').disabled = false;
    document.getElementById('hideMap').disabled = true;
}