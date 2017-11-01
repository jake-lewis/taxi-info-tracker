$(document).ready(function() {
    var path = window.location.pathname.split('/')[1];
    $('.navbar-link').removeClass('active');
    (path ? $('#' + path) : $('#index')).addClass('active');
});