var graphicLine = {

	title: {
        text: 'Potencia (Consumida - Generada)'
    },

    subtitle: {
        text: 'KwH'
    },

    credits: {
        enabled: false
    },

    exporting: { 
        enabled: false
    },

    yAxis: {
        title: {
            text: 'KwH'
        }
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 2010
        }
    },

    series: [{
        name: 'Installation',
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

};

module.exports = graphicLine;