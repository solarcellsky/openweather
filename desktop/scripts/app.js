var getDates = function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var days = ['\u5468\u65E5', '\u5468\u4E00', '\u5468\u4E8C', '\u5468\u4E09', '\u5468\u56DB', '\u5468\u4E94', '\u5468\u516D'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    if (month < 10) month = '0' + month;
    var date = a.getDate();
    if (date < 10) date = '0' + date;
    var day = days[a.getDay()];
    var dates = month + '-' + date + ' , ' + day;
    return dates;
};

var getTimes = function(timestamp) {
    var a = new Date(timestamp * 1000);
    var hours = a.getHours();
    if (hours < 10) hours = '0' + hours;
    var minutes = a.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    var seconds = a.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    var times = hours + ':' + minutes + ':' + seconds;
    return times;
};

var degToCompass = function(deg) {
    val = Math.round((deg - 11.25) / 22.5);
    arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[val % 16];
};

var getPosition = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $('#your-position').text('latlng: ' + position.coords.latitude + ',' + position.coords.longitude);
        });
    } else {
        $('#your-position').text("Geolocation is not supported by this browser.");
    };
};

$(function() {
    Cufon.replace('h1', {
        fontFamily: 'Helvetica Neue'
    });
    getPosition();
});