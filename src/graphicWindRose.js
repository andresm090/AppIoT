var graphicWindRose = {

    data: {
        table: 'freq',
        startRow: 1,
        endRow: 16,
        endColumn: 7
    },

    chart: {
        polar: true,
        type: 'column',
        renderTo: 'rose',
        reflow: false
    },

    title: {
        text: 'Rosa de vientos'
    },

    credits: {
      enabled: false
      //text: 'IoT aplication',
      //href: 'http://localhost:3000/'
    },

    exporting: { 
      enabled: false
    },

    pane: {
        size: '85%'
    },

    legend: {
        align: 'right',
        verticalAlign: 'top',
        y: 100,
        layout: 'vertical',
        enabled: false
    },

    xAxis: {
        endOnTick: true,
        tickmarkPlacement: 'on',
        categories: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
        tickInterval:1,
    },

    yAxis: {
        min: 0,
        endOnTick: false,
        showLastLabel: true,
        title: {
            text: 'Frequency (%)'
        },
        labels: {
            //formatter: function () {
                //return this.value + '%';
            //}
        },
        reversedStacks: false
    },

    tooltip: {
        valueSuffix: '%'
    },

    plotOptions: {
        series: {
            stacking: 'normal',
            shadow: false,
            groupPadding: 0,
            pointPlacement: 'on'
        }
    },

    //series: [{}],

};

module.exports = graphicWindRose;