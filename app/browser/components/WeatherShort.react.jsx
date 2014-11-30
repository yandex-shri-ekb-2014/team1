/** @jsx React.DOM */
var React = require('react');
var moment = require('moment');

var DayShortNames = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
var MonthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октярбря',
    'ноября',
    'декабря'
];


var WeatherShortHeader = React.createClass({
    render: function () {
        var isCurrentMonth = moment(this.props.forecast[0].date).month();

        var key = 0;
        var rows = [];
        this.props.forecast.slice(1).forEach(function (weather, index) {
            var date = moment(weather.date);
            if (date.day() === 1 && index > 0) {
                rows.push(<td className="weather-short__gap" key={key++}></td>);
            }

            var dayname = 'завтра';
            if (index > 0) {
                dayname = DayShortNames[date.day()];
            }

            var datename = date.date();
            if (index < 2 || isCurrentMonth !== date.month()) {
                datename = date.date() + ' ' + MonthNames[date.month()];
                isCurrentMonth = date.month();
            }

            rows.push(
                <th className="weather-short__item" key={key++}>
                    <p className="weather-short__dayname">{dayname}</p>
                    <p className="weather-short__date">{datename}</p>
                </th>
            );
        });

        return (<tr>{rows}</tr>);
    }
});

var WeatherShortDay = React.createClass({
    render: function () {
        var key = 0;
        var rows = [];
        this.props.forecast.slice(1).forEach(function (weather, index) {
            var date = moment(weather.date);
            if (date.day() === 1 && index > 0) {
                rows.push(<td className="weather-short__gap" key={key++}></td>);
            }

            var temp = weather.parts[4].temp;
            var wIcon = weather.parts[4].weather_icon;

            rows.push(
                <td className={'weather-short__dayweather weather' + (temp + temp % 2)} key={key++}>
                    <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + wIcon + '.png'} />
                    <p className="weather-short__descr">{weather.parts[4].weather}</p>
                    <p className="weather-short__temperature">{(temp > 0 ? '+' : '') + temp}</p>
                </td>
            );
        });

        return (<tr>{rows}</tr>);
    }
});

var WeatherShortNight = React.createClass({
    render: function () {
        var key = 0;
        var rows = [];
        this.props.forecast.slice(1).forEach(function (weather, index) {
            var date = moment(weather.date);
            if (date.day() === 1 && index > 0) {
                rows.push(<td className="weather-short__gap" key={key++}></td>);
            }

            var temp = weather.parts[5].temp;

            rows.push(
                <td className={'weather-short__nightweather weather' + (temp + temp % 2)} key={key++}>
                    <p className="weather-short__night-temperature">{temp + temp % 2}</p>
                </td>
            );
        });

        return (<tr>{rows}</tr>);
    }
});

var WeatherShort = React.createClass({
    render: function () {
        return (
            <div className="content__weather-short">
                <table className="weather-short">
                    <thead>
                        <WeatherShortHeader forecast={this.props.forecast} />
                    </thead>
                    <tbody>
                        <WeatherShortDay forecast={this.props.forecast} />
                        <WeatherShortNight forecast={this.props.forecast} />
                    </tbody>
                </table>
            </div>
        );
    }
});


module.exports = WeatherShort;
