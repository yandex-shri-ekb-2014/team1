/** @jsx React.DOM */

function drawChart (data) {
    var weatherHours = [];
    var hours = [];
    var item;
    var length = data.hours.length;
    var temp;
    var tempArray = [];

    tempArray = data.hours.map(function (item) {
        return item.temp;
    });

    var minTemp = Math.min.apply(Math, tempArray);
    if (minTemp < 0) {
        minTemp = Math.abs(minTemp) + 2
    } else {
        minTemp = - (minTemp - 2)
    }
    tempArray = tempArray.map(function (tempNum) {
        return (tempNum + minTemp);
    });


    for (var i = 0; i < length; i++) {
        item = data.hours[i];

        if (item.temp < 0) {
            temp = item.temp
        } else {
            if (item.temp != 0) {
                temp = "+" + item.temp
            } else {
                temp = item.temp
            }
        }

        weatherHours[i] = {
            y: tempArray[i],
            color: colors[item.temp + item.temp % 2],
            name: temp
        };
        if (item.hour.length == 1) {
            hours[i] = "0" + item.hour
        } else {
            hours[i] = item.hour
        }
    }

    new Highcharts.Chart({
        chart: {
            renderTo: 'graph-wrp',
            type: 'column',
            height: 200,
            marginTop: 15,
            spacing: [0,0,0,0]
        },
        xAxis: {
            categories: hours,
            title: false,
            labels: {
                enabled: true
            },
            lineWidth: 0,
            tickLength: 0
        },
        yAxis: {
            title: false,
            labels: {
                enabled:false
            },
            lineWidth: 0,
            tickLength: 0,
            gridLineWidth: 0,
            maxPadding: 0.1
        },
        plotOptions: {
            column: {
                groupPadding: 0,
                states: {
                    hover: {
                        brightness: -0.05
                    }
                },
                pointPadding: 0,
                dataLabels: {
                    enabled: true,
                    format: "{point.name}",
                    style: {
                        "fontFamily": "Arial",
                        "fontSize": "12px",
                        "color": "black",
                        "top": "-10px"
                    }
                }
            }

        },
        series: [{
            data: weatherHours
        }],
        title: false,
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: false
        }
    });
}
var colors = {
    '-60': '#519fdd',
    '-58': '#56a2dd',
    '-56': '#5ba5de',
    '-54': '#60a7de',
    '-52': '#66aadf',
    '-50': '#6bade0',
    '-48': '#70afe0',
    '-46': '#76b2e1',
    '-44': '#7bb5e2',
    '-42': '#80b7e2',
    '-40': '#86bae3',
    '-38': '#8bbde3',
    '-36': '#90bfe4',
    '-34': '#95c2e5',
    '-32': '#9bc5e5',
    '-30': '#a0c7e6',
    '-28': '#a0c7e6',
    '-26': '#abcde7',
    '-24': '#b0cfe8',
    '-22': '#b5d2e9',
    '-20': '#bbd5e9',
    '-18': '#c0d7ea',
    '-16': '#c5daea',
    '-14': '#caddeb',
    '-12': '#d0dfec',
    '-10': '#d5e2ec',
    '-8': '#dae5ed',
    '-6': '#e0e7ee',
    '-4': '#e5eaee',
    '-2': '#eaedef',
    '0': '#f0eff0',
    '2': '#f0f0ec',
    '4': '#f1f0e9',
    '6': '#f2f0e6',
    '8': '#f3f1e3',
    '10': '#f4f1e0',
    '12': '#f5f2dc',
    '14': '#f5f2d9',
    '16': '#f6f3d6',
    '18': '#f7f3d3',
    '20': '#f8f4d0',
    '22': '#f8f1c8',
    '24': '#f9eec0',
    '26': '#f9ebb9',
    '28': '#f9e8b1',
    '30': '#fae5aa',
    '32': '#fae3a3',
    '34': '#fae09c',
    '36': '#fbde96',
    '38': '#fbdb8f',
    '40': '#fbd988',
    '42': '#fcd682',
    '44': '#fcd47b',
    '46': '#fcd174',
    '48': '#fdcf6e',
    '50': '#fdcc67',
    '52': '#fdca60',
    '54': '#fec759',
    '56': '#fec553',
    '58': '#fec24c',
    '60': '#ffc045'
};

module.exports = drawChart;
