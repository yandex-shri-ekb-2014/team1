var React = require('react');
var _ = require('lodash');

var CityList = React.createClass({
    getInitialState: function() {
        return {
            isActive: false
        }
    },

    clickHandler: function(e) {
        this.state.isActive ? this.setState({isActive: false}) : this.setState({isActive: true});
    },

    render: function() {
        var classes = ['city-list__ul'];

        if (this.state.isActive) classes.push('city-list__ul_active');

        return (
            <div className="city-list">

                <p className="city-list__p" onClick={this.clickHandler}>
                Другой город<img src="/static/images/header/active-arrow.png" />
                </p>

                <ul className={classes.join(' ')}>
                    <li className="city-list__ul_li_begin">Последние города</li>
                    <li className="city-list__ul_li_active">Москва</li>
                    <li>Санкт-Петербург</li>
                    <li>Екатеринбург</li>
                    <li className="city-list__ul_li_end">Все города</li>
                </ul>
            </div>
        );
    }
});

var TableDetailRows = React.createClass({
    blocks: {
        head: function(data, key) {
            return (
                <th className={data.classes} key={key}>{data.title}</th>
            );
        },

        temp: function(data, key) {
            return (
                <td className={data.classes} key={key}>{data.temp}</td>
            );
        },

        weather: function(data, key) {
            return (
                <td className={data.classes} key={key}>
                    <img className="table-detail__w-info_img" src={'http://ekb.shri14.ru/icons/' + data.weather_icon + '.svg'}
                        width={data.size}
                        height={data.size} />
                    {data.weather ? data.weather : ''}
                </td>
            );
        },

        info: function(data, key) {
            return (
                <td rowSpan="2" className="table-detail__more-info vertical-align-top" key={key}>
                Давление: {data.pressure}<br />
                Ветер: {data.wind}<br />
                Влажность: {data.humidity}<br />
                Восход: {data.sunrise} Заход: {data.sunset}<br />
                    <p className="table-detail__reg">
                        Данные зарегистрированы недавно
                    </p>
                </td>
            );
        }
    },

    render: function() {
        var cells = [];

        this.props.data.forEach(function(item, index) {
            var blockName = _.keys(item)[0];

            cells.push(this.blocks[blockName](item[blockName], index));
        }, this);

        return <tr className={this.props.className}>{cells}</tr>;
    }
});

var TableDetail = React.createClass({
    formatData: function(data, blockName) {
        var items = [];

        this.props.actualTimesOfDay.forEach(function(item, index) {
            var cell = {};
            var current = item;

            if (index === 0) current = 'now';

            cell[blockName] = this[blockName + 'Template'](data, current, index);

            items.push(cell);

            if (index === this.props.actualTimesOfDay.length - 1 && blockName === 'temp') {
                items.push({'info': this.infoTemplate(data, item, index)});
            }
        }, this);

        return items;
    },

    headTemplate: function(data, item, index) {
        var classes = ['table-detail__th'];
        var alias = {
            now: 'сейчас',
            morning: 'утром',
            day: 'днём',
            evening: 'вечером',
            night: 'ночью'
        };

        if (index === 0) {
            classes.push('table-detail__th_now');
        };

        return {
            title: alias[item] ? alias[item] : item,
            classes: classes.join(' ')
        };
    },

    tempTemplate: function(data, item, index) {
        var classes = ['vertical-align-bottom'];
        var temp = this.getPropByTimeOfDay(data, item, 'temp');

        if (index === 0) classes.push('table-detail__temp_now');

        classes.push(this.props.helpers.getWeatherClass(temp));

        return {
            classes: classes.join(' '),
            temp: this.props.helpers.weatherToStringWithDimension(temp)
        };
    },

    weatherTemplate: function(data, item, index) {
        var classes = [];
        var temp = this.getPropByTimeOfDay(data, item, 'temp');
        var weather_icon = this.getPropByTimeOfDay(data, item, 'weather_icon');
        var weather = '';
        var size = 30;

        if (index === 0) {
            classes.push('table-detail__w-info');
            weather = this.getPropByTimeOfDay(data, item, 'weather');
            size = 48;
        };

        classes.push(this.props.helpers.getWeatherClass(temp));

        return {
            classes: classes.join(' '),
            weather_icon: weather_icon,
            weather: weather,
            size: size
        };
    },

    infoTemplate: function(data) {
        var wind = data.fact.wind.toLowerCase() + ', ' +
            this.props.helpers.windSpeedWithDimension(data.fact.wind_speed) +
            ' (' + this.props.helpers.windSpeedWithDimension(data.fact.wind_speed, true) + ')';

        return {
            pressure: this.props.helpers.pressureWithDimension(data.fact.pressure),
            wind: wind,
            humidity: this.props.helpers.humidityWithDimension(data.fact.humidity),
            sunrise: data.forecast[0].sunrise,
            sunset: data.forecast[0].sunset
        };
    },

    getPropByTimeOfDay: function(data, timeOfDay, propName) {
        var map = {
            now: data.fact[propName],
            morning: data.forecast[0].parts[0][propName],
            day: data.forecast[0].parts[1][propName],
            evening: data.forecast[0].parts[2][propName],
            night: data.forecast[0].parts[3][propName],
            yesterday: data.yesterday[propName]
        };

        return map[timeOfDay];
    },

    render: function() {
        var yesterdayTemp = this.getPropByTimeOfDay(this.props.data, 'yesterday', 'temp');

        return (
            <table className="weather-detail__table-detail">
                <TableDetailRows data={this.formatData(this.props.data, 'head')}
                    className="table-detail__th" />
                <TableDetailRows data={this.formatData(this.props.data, 'temp')}
                    className="table-detail__temp" />
                <TableDetailRows data={this.formatData(this.props.data, 'weather')}
                    className="table-detail__tr_top" />
                <tr>
                    <td colSpan="5" className="table-detail__yesterday">
                    вчера {this.props.helpers.weatherToStringWithDimension(yesterdayTemp)}
                    </td>
                </tr>
            </table>
        );
    }
});

var WeatherDetail = React.createClass({
    helpers: {
        getWeatherClass: function(temp) {
            return 'weather' + (temp + temp % 2);
        },

        weatherToString: function(temp) {
            return (temp > 0 ? '+' : '') + temp;
        },

        weatherToStringWithDimension: function(temp) {
            return this.weatherToString(temp) + ' °C';
        },

        pressureWithDimension: function(pressure) {
            return pressure + ' мм рт. ст.';
        },

        windSpeedWithDimension: function(windSpeed, kmPerHour) {
            return kmPerHour ? (windSpeed * 1e-3 * 3.6e3).toFixed(1) + ' км/ч' : windSpeed + ' м/с';
        },

        humidityWithDimension: function(humidity) {
            return humidity + '%';
        },

        parseDate: function(date) {
            var date = new Date(date);

            return {
                date: date.getDate(),
                day: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][date.getDay()],
                month: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
                    'августа', 'сентября', 'октярбря', 'ноября', 'декабря'][date.getMonth()]
            };
        },

        getActualTimesOfDay: function() {
            var timesOfDay = {
                morning: [6, 11],
                day: [12, 17],
                evening: [18, 23],
                night: [0, 5]
            };
            var timesOfDayKeysOrder = ['morning', 'day', 'evening', 'night'];
            var hour = new Date().getHours();
            var result = [];

            timesOfDayKeysOrder.forEach(function(key) {
                if (hour >= timesOfDay[key][0] && hour <= timesOfDay[key][1]) {
                    result.push(key);
                } else if (result.length > 0) {
                    result.push(key);
                }
            });

            return result;
        }
    },

    getPropByTimeOfDay: function(data, timeOfDay, propName) {
        var map = {
            now: data.fact[propName],
            morning: data.forecast[0].parts[0][propName],
            day: data.forecast[0].parts[1][propName],
            evening: data.forecast[0].parts[2][propName],
            night: data.forecast[0].parts[3][propName]
        };

        return map[timeOfDay];
    },

    render: function() {
        return (
            <div className="weather-detail">
                <div className="weather-detail__select-city">
                    <h2 className="select-city__h2">{this.props.data.info.name}</h2>

                    <CityList />

                    <TableDetail data={this.props.data}
                        actualTimesOfDay={this.helpers.getActualTimesOfDay()}
                        helpers={this.helpers} />

                </div>
                <div className="weather-detail__rotater"><img src="/static/images/header/rotator.jpg" /></div>
            </div>
        );
    }
});

module.exports = WeatherDetail;
