var gaugeInc = {

	title: {
        text: 'Angulo de inclinacion panel fotovoltaico'
    },

    subtitle: {
        text: 'Tipo de base fija, con ajuste manual'
    },

    yAxis: {
        title: {
            text: ''
        },
        max: 15
    },
    credits: {
            enabled: false
        },

        exporting: { 
	  		enabled: false
		},
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        enabled: false
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 1
        }
    },

    tooltip: {
    	enabled: false
    },

    series: [{
        name: 'Panel Fotovoltaico',
        data: [{x:1, y:1}, {x:5, y:10}]
    }, {
    	name:'a',
      data: [{
      			x: 2,
            y: 10,
            marker: {
                symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
            }
        }]
    }, {
        name: 'soporte',
        data: [{x:3, y:0}, {x:3, y:5.5}]
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

module.exports = gaugeInc;