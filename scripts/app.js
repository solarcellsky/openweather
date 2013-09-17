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

var weatherWidget = function(units, symbol) {
    var cnt = 6;
    var latlng = ($('#latlng').data('latlng')).split(',');
    var data_current = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latlng[0] + '&lon=' + latlng[1] + '&units=' + units + '&lang=zh_cn&callback=?';
        var data_forecast = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + latlng[0] + '&lon=' + latlng[1] + '&cnt=' + cnt + '&units=' + units + '&lang=zh_cn&callback=?';

    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: data_current,
        success: function(data) {
            var details = '<tbody>';
            details += '<tr><td rowspan="7" class="weather-icon" style="background:url(weather_icons/' + data.weather[0].icon + '.png) no-repeat center 75px">';
            details += '<div class="weather-sum"><div class="location">';
            details += data.name;
            details += ' , ';
            details += data.sys.country
            details += '</div>';
            details += getDates(data.dt);
            details += ' ';
            details += getTimes(data.dt);
            details += '<br />';
            details += data.weather[0].description;
            details += ' , \u98CE\u5411 ';
            details += degToCompass(data.wind.deg);
            details += ' (';
            details += (data.wind.deg).toFixed(2);
            details += ' &deg;)</div>';
            details += '</td><td colspan="2"><div class="temp"><span class="weather-current-temp">';
            details += (data.main.temp).toFixed(1);
            details += '</span><em>' + symbol + '</em></div></td></tr><tr><td>\u6E7F\u5EA6:</td><td><span class="weather-current-humidity">';
            details += data.main.humidity;
            details += '</span> %</td></tr><tr><td>\u98CE\u901F:</td><td><span class="weather-current-windspeed">';
            details += data.wind.speed;
            details += '</span> m/s</td></tr><tr><td>\u6C14\u538B:</td><td><span class="weather-current-pressure">';
            details += data.main.pressure;
            details += '</span> hPa</td></tr><tr><td>\u65E5\u51FA:</td><td>';
            details += getTimes(data.sys.sunrise);
            details += '</td></tr>';
            details += '<tr><td>\u65E5\u843D:</td><td>';
            details += getTimes(data.sys.sunset);
            details += '</td></tr><tbody>';
            $('table.current').append(details);
        
            Cufon.replace('.weather-current-temp', {
                fontFamily: 'Helvetica Neue'
            });

            $('.loading-current,.disabled').remove();
        },
        error: function() {
            $('table.current').empty().append('<tr><td>暂时无法取得天气数据</td></tr>');
        }
    });

    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: data_forecast,
        success: function(data) {
            var items = [];
            var len = data.list.length;
            for (var i = 0; i < len; i++) {
                var item = '<tr><td>';
                item += getDates(data.list[i].dt);
                item += '</td><td>';
                item += data.list[i].weather[0].description;
                item += '</td><td>';
                item += (data.list[i].temp.min).toFixed(1);
                item += ' ~ ';
                item += (data.list[i].temp.max).toFixed(1);
                item += symbol;
                item += '</td></tr>';

                items.push(item);
            };

            for (var j = 0; j < items.length; j++) {
                $('.forecast tbody').append(items[j]);
            };

            $('.loading-forecast,.disabled').remove();
        },
        error: function() {
            $('table.forecast').empty().append('<tr><td>暂时无法取得天气数据</td></tr>');
        }
    });

};

var toggleWeatherUnits = function() {
    var self = $(this);
    var units = self.data('units');
    var symbol = self.data('symbol');
    self.addClass('active').siblings().removeClass('active');
    $('.set-units').append('<div class="disabled"></div>')
    $('#weather-current').append('<div class="loading-current"></div>');
    $('#weather-forecast').append('<div class="loading-forecast"></div>');
    $('table.current').empty();
    $('.forecast tbody').empty();
    weatherWidget(units, symbol);
};

$(function() {
    Cufon.replace('h1', {
        fontFamily: 'Helvetica Neue'
    });
    weatherWidget('metric', '&#8451;');
    $(document).on('click', '[data-action=set-metric],[data-action=set-imperial]', toggleWeatherUnits);
});