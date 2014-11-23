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


var WeatherFullOneDay = React.createClass({
    render: function () {
        var key = 0;
        var rows = [];
        this.props.forecast.forEach(function (weather) {
            var date = moment(weather.date);
            var dayname = DayShortNames[date.day()];
            var monthname = MonthNames[date.month()];
            var daynumber = date.date();
            var mooncode = (weather.moon_code.length == 1) ? ('0' + weather.moon_code) : (''  + weather.moon_code);
            var magnetictitle = (weather.biomet && weather.biomet.message) ? ('магнитное поле') : ('');

            weather.parts.slice(0,4).forEach(function (part, index) {
                var temp = part.temp;
                var timeOfDay = ["утром", "днем", "вечером", "ночью"];
                var tempMin = part.temp_min;
                var tempMax = part.temp_max;
                var weatherDescr = part.weather;
                var pressure = part.pressure;
                var humidity = part.humidity;
                var weatherIcon = part.weather_icon;
                var windIcon = part.wind_direction;
                var windSpeed = part.wind_speed;


                if (index === 0) {
                    return rows.push(
                        <tr className ="weather-full__row">
                            <td className="weather-full__date-cell" rowSpan="4">
                                <span className="weather-full__day-name">{dayname}</span>
                                <span className="weather-full__date"><span className="weather-full__date-number">{daynumber}</span><span className="weather-full__date-month">{monthname}</span></span>
                            </td>
                            <td className={'weather-full__time-of-day-cell weather' + (temp + temp % 2)}>
                                <span className="weather-full__time-of-day">{timeOfDay[index]}</span>
                        {tempMin}..{tempMax}
                            </td>
                            <td className={'weather-full__icon weather' + (temp + temp % 2)}>
                                <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + weatherIcon + '.png'} />
                            </td>
                            <td className={'weather-full__descr weather' + (temp + temp % 2)}>
                    {weatherDescr}
                            </td>
                            <td className={'weather-full__pressure weather' + (temp + temp % 2)}>
                    {pressure}
                            </td>
                            <td className={'weather-full__humidity weather' + (temp + temp % 2)}>
                    {humidity}
                            </td>
                            <td className={'weather-full__wind-icon weather' + (temp + temp % 2)}>
                                <img src={'http://yandex.st/weather/1.2.83/i/wind/' + windIcon + '.gif'} />
                            </td>
                            <td className={'weather-full__wind-speed weather' + (temp + temp % 2)}>
                    {windSpeed}
                            </td>
                            <td rowSpan="4" className="weather-full__sun">
                                <span className="weather-full__sun-title">
                                восход
                                </span>
                    {weather.sunrise}
                            </td>
                            <td rowSpan="4" className="weather-full__sun">
                                <span className="weather-full__sun-title">
                                закат
                                </span>
                    {weather.sunset}
                            </td>
                            <td rowSpan="4" className="weather-full__moon-icon">
                                <img src={'http://yandex.st/weather/1.2.83/i/moon/' + mooncode + '.gif'} />
                            </td>
                            <td rowSpan="4" className="weather-full__magnetic-field">
                                <span className="weather-full__magnetic-field-title">
                            {magnetictitle}
                                </span>
                    {weather.biomet && weather.biomet.message && weather.biomet.message}
                            </td>
                        </tr>
                    )
                }
                rows.push(
                    <tr className ="weather-full__row">
                        <td className={'weather-full__time-of-day-cell weather' + (temp + temp % 2)}>
                            <span className="weather-full__time-of-day">днем</span>
                        {tempMin}..{tempMax}
                        </td>
                        <td className={'weather-full__icon weather' + (temp + temp % 2)}>
                            <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + weatherIcon + '.png'} />
                        </td>
                        <td className={'weather-full__descr weather' + (temp + temp % 2)}>
                    {weatherDescr}
                        </td>
                        <td className={'weather-full__pressure weather' + (temp + temp % 2)}>
                    {pressure}
                        </td>
                        <td className={'weather-full__humidity weather' + (temp + temp % 2)}>
                    {humidity}
                        </td>
                        <td className={'weather-full__wind-icon weather' + (temp + temp % 2)}>
                            <img src={'http://yandex.st/weather/1.2.83/i/wind/' + windIcon + '.gif'} />
                        </td>
                        <td className={'weather-full__wind-speed weather' + (temp + temp % 2)}>
                    {windSpeed}
                        </td>
                    </tr>
                )

            });

            rows.push(
                <tr className="weather-full__row-gap">
                    <td colSpan="16"></td>
                </tr>
            )
        });


        return (<tbody>{rows}</tbody>);
    }
});



var WeatherFull = React.createClass({
    render: function () {
        var displayed = (this.props.type == "full") ? {display:'block'} : {};
        return (
            <div className="content__weather-full"  style={displayed}>
                <table className="weather-full">
                    <thead>
                        <tr>
                            <th colSpan="4"></th>
                            <th className="weather-full__table-title">давление,<br />мм рт. ст.</th>
                            <th className="weather-full__table-title" colSpan="2">влажность</th>
                            <th className="weather-full__table-title">ветер,<br />м/с</th>
                            <th colSpan="4"></th>
                        </tr>
                    </thead>

                        <WeatherFullOneDay forecast={this.props.forecast} />

                </table>
            </div>
        );
    }
});


module.exports = WeatherFull;
