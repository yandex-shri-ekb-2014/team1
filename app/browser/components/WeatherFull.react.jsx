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
        var rows = [];
        this.props.forecast.forEach(function (weather) {
            var date = moment(weather.date);
            var dayname = DayShortNames[date.day()];
            var monthname = MonthNames[date.month()];
            var daynumber = date.date();
            var mooncode = weather.moon_code;
            var magnetictitle = (weather.biomet && weather.biomet.message) ? ('магнитное поле') : ('');
            var dateCellClasses = ['weather-full__date-cell'];

            if (dayname === 'сб' || dayname === 'вс') {
                dateCellClasses.push('weather-full__date-cell_holydays');
            }

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
                var windDirection = part.wind_abbr;
                var windSpeed = part.wind_speed;
                var weatherClass = " weather" + (temp + temp % 2);

                if ( !tempMin || !tempMax ) {
                    tempMin = temp - 1;
                    tempMax = temp + 1;
                }



                if (index === 0) {
                    return rows.push(
                        <tr className ="weather-full__row">
                            <td className={dateCellClasses.join(' ')} rowSpan="4">
                                <span className="weather-full__day-name">{dayname}</span>
                                <span className="weather-full__date"><span className="weather-full__date-number">{daynumber}</span><span className="weather-full__date-month">{monthname}</span></span>
                            </td>
                            <td className={'weather-full__time-of-day-cell' + weatherClass}>
                                <span className="weather-full__time-of-day">{timeOfDay[index]}</span>
                    {tempMin}..{tempMax}
                            </td>
                            <td className={'weather-full__icon' + weatherClass}>
                                <img className="weather-short__icon" src={'http://ekb.shri14.ru/icons/' + weatherIcon + '.svg'} />
                            </td>
                            <td className={'weather-full__descr' + weatherClass}>
                    {weatherDescr}
                            </td>
                            <td className={'weather-full__pressure' + weatherClass}>
                    {pressure}
                            </td>
                            <td className={'weather-full__humidity' + weatherClass}>
                    {humidity}
                            </td>
                            <td className={'weather-full__wind-icon' + weatherClass}>
                                <img className={'wind-'+windIcon} src={'/static/images/content/arrow.svg'} />
                                <p className="wind-direction">{windDirection}</p>
                            </td>
                            <td className={'weather-full__wind-speed' + weatherClass}>
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
                                <img src={'http://ekb.shri14.ru/icons/icon_moon_' + mooncode + '.svg'} />
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
                        <td className={'weather-full__time-of-day-cell' + weatherClass}>
                            <span className="weather-full__time-of-day">{timeOfDay[index]}</span>
                        {tempMin}..{tempMax}
                        </td>
                        <td className={'weather-full__icon' + weatherClass}>
                            <img className="weather-short__icon" src={'http://ekb.shri14.ru/icons/' + weatherIcon + '.svg'} />
                        </td>
                        <td className={'weather-full__descr' + weatherClass}>
                    {weatherDescr}
                        </td>
                        <td className={'weather-full__pressure' + weatherClass}>
                    {pressure}
                        </td>
                        <td className={'weather-full__humidity' + weatherClass}>
                    {humidity}
                        </td>
                        <td className={'weather-full__wind-icon' + weatherClass}>
                            <img className={'wind-'+windIcon} src={'/static/images/content/arrow.svg'} />
                            <p className="wind-direction">{windDirection}</p>
                        </td>
                        <td className={'weather-full__wind-speed' + weatherClass}>
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
