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


var WeatherFullHeader = React.createClass({
    render: function () {
        return (

              <tr>
                  <th colSpan="4"></th>
                  <th className="weather-full__table-title">давление,<br />мм рт. ст.</th>
                  <th className="weather-full__table-title" colSpan="2">влажность</th>
                  <th className="weather-full__table-title">ветер,<br />м/с</th>
                  <th colSpan="4"></th>
              </tr>

        );
    }
});


var WeatherFullOneDay = React.createClass({
    render: function () {
        var key = 0;
        var rows = [];
        this.props.forecast.slice(0).forEach(function (weather) {
            var date = moment(weather.date);
            var dayname = DayShortNames[date.day()];
            var monthname = MonthNames[date.month()];
            var daynumber = date.date();

            var weather0 = weather.parts[0];
            var weather1 = weather.parts[1];
            var weather2 = weather.parts[2];
            var weather3 = weather.parts[3];
            var mooncode = (weather.moon_code.length == 1) ? ('0' + weather.moon_code) : (''  + weather.moon_code);
            var magnetictitle = (weather.biomet && weather.biomet.message) ? ('магнитное поле') : ('');
            rows.push(
                <tbody>
                <tr className ="weather-full__row">
                    <td className="weather-full__date-cell" rowSpan="4">
                        <span className="weather-full__day-name">{dayname}</span>
                        <span className="weather-full__date"><span className="weather-full__date-number">{daynumber}</span><span className="weather-full__date-month">{monthname}</span></span>
                    </td>
                    <td className={'weather-full__time-of-day-cell weather' + (weather0.temp + weather0.temp % 2)}>
                        <span className="weather-full__time-of-day">утром</span>
                        {weather0.temp_min}..{weather0.temp_max}
                    </td>
                    <td className={'weather-full__icon weather' + (weather0.temp + weather0.temp % 2)}>
                        <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + weather0.weather_icon + '.png'} />
                    </td>
                    <td className={'weather-full__descr weather' + (weather0.temp + weather0.temp % 2)}>
                    {weather0.weather}
                    </td>
                    <td className={'weather-full__pressure weather' + (weather0.temp + weather0.temp % 2)}>
                    {weather0.pressure}
                    </td>
                    <td className={'weather-full__humidity weather' + (weather0.temp + weather0.temp % 2)}>
                    {weather0.humidity}
                    </td>
                    <td className={'weather-full__wind-icon weather' + (weather0.temp + weather0.temp % 2)}>
                        <img src={'http://yandex.st/weather/1.2.83/i/wind/' + weather0.wind_direction + '.gif'} />
                    </td>
                    <td className={'weather-full__wind-speed weather' + (weather0.temp + weather0.temp % 2)}>
                    {weather0.wind_speed}
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
                    <tr className ="weather-full__row">
                        <td className={'weather-full__time-of-day-cell weather' + (weather1.temp + weather1.temp % 2)}>
                            <span className="weather-full__time-of-day">днем</span>
                        {weather1.temp_min}..{weather1.temp_max}
                        </td>
                        <td className={'weather-full__icon weather' + (weather1.temp + weather1.temp % 2)}>
                            <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + weather1.weather_icon + '.png'} />
                        </td>
                        <td className={'weather-full__descr weather' + (weather1.temp + weather1.temp % 2)}>
                    {weather1.weather}
                        </td>
                        <td className={'weather-full__pressure weather' + (weather1.temp + weather1.temp % 2)}>
                    {weather1.pressure}
                        </td>
                        <td className={'weather-full__humidity weather' + (weather1.temp + weather1.temp % 2)}>
                    {weather1.humidity}
                        </td>
                        <td className={'weather-full__wind-icon weather' + (weather1.temp + weather1.temp % 2)}>
                            <img src={'http://yandex.st/weather/1.2.83/i/wind/' + weather1.wind_direction + '.gif'} />
                        </td>
                        <td className={'weather-full__wind-speed weather' + (weather1.temp + weather1.temp % 2)}>
                    {weather1.wind_speed}
                        </td>
                    </tr>
                    <tr className ="weather-full__row">
                        <td className={'weather-full__time-of-day-cell weather' + (weather2.temp + weather2.temp % 2)}>
                            <span className="weather-full__time-of-day">вечером</span>
                        {weather2.temp_min}..{weather2.temp_max}
                        </td>
                        <td className={'weather-full__icon weather' + (weather2.temp + weather2.temp % 2)}>
                            <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + weather2.weather_icon + '.png'} />
                        </td>
                        <td className={'weather-full__descr weather' + (weather2.temp + weather2.temp % 2)}>
                    {weather2.weather}
                        </td>
                        <td className={'weather-full__pressure weather' + (weather2.temp + weather2.temp % 2)}>
                    {weather2.pressure}
                        </td>
                        <td className={'weather-full__humidity weather' + (weather2.temp + weather2.temp % 2)}>
                    {weather2.humidity}
                        </td>
                        <td className={'weather-full__wind-icon weather' + (weather2.temp + weather2.temp % 2)}>
                            <img src={'http://yandex.st/weather/1.2.83/i/wind/' + weather2.wind_direction + '.gif'} />
                        </td>
                        <td className={'weather-full__wind-speed weather' + (weather2.temp + weather2.temp % 2)}>
                    {weather2.wind_speed}
                        </td>
                    </tr>
                    <tr className ="weather-full__row">
                        <td className={'weather-full__time-of-day-cell weather' + (weather3.temp + weather3.temp % 2)}>
                            <span className="weather-full__time-of-day">ночью</span>
                        {weather3.temp_min}..{weather3.temp_max}
                        </td>
                        <td className={'weather-full__icon weather' + (weather3.temp + weather3.temp % 2)}>
                            <img className="weather-short__icon" src={'http://yandex.st/weather/1.2.77/i/icons/30x30/' + weather3.weather_icon + '.png'} />
                        </td>
                        <td className={'weather-full__descr weather' + (weather3.temp + weather3.temp % 2)}>
                    {weather3.weather}
                        </td>
                        <td className={'weather-full__pressure weather' + (weather3.temp + weather3.temp % 2)}>
                    {weather3.pressure}
                        </td>
                        <td className={'weather-full__humidity weather' + (weather3.temp + weather3.temp % 2)}>
                    {weather3.humidity}
                        </td>
                        <td className={'weather-full__wind-icon weather' + (weather3.temp + weather3.temp % 2)}>
                            <img src={'http://yandex.st/weather/1.2.83/i/wind/' + weather3.wind_direction + '.gif'} />
                        </td>
                        <td className={'weather-full__wind-speed weather' + (weather3.temp + weather3.temp % 2)}>
                    {weather3.wind_speed}
                        </td>
                    </tr>
                    <tr className="weather-full__row-gap">
                        <td colspan="16"></td>
                    </tr>
               </tbody>
            );
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
                        <WeatherFullHeader forecast={this.props.forecast} />
                    </thead>

                        <WeatherFullOneDay forecast={this.props.forecast} />

                </table>
            </div>
        );
    }
});


module.exports = WeatherFull;
