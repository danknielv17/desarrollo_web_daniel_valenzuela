
// Estadísticas de Actividades - Gráficos con Highcharts
document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de líneas: actividades por día
    fetch('/api/estadisticas/por-dia')
        .then(r => r.json())
        .then(data => {
            Highcharts.chart('grafico-lineas', {
                chart: { type: 'line' },
                title: { text: 'Actividades por Día' },
                xAxis: { categories: data.labels, title: { text: 'Día' } },
                yAxis: { title: { text: 'Cantidad de Actividades' }, allowDecimals: false },
                series: [{
                    name: 'Actividades',
                    data: data.values
                }]
            });
        });

    // Gráfico de torta: actividades por tipo
    fetch('/api/estadisticas/por-tipo')
        .then(r => r.json())
        .then(data => {
            Highcharts.chart('grafico-torta', {
                chart: { type: 'pie' },
                title: { text: 'Actividades por Tipo' },
                series: [{
                    name: 'Cantidad',
                    colorByPoint: true,
                    data: data.labels.map((label, i) => ({
                        name: label,
                        y: data.values[i]
                    }))
                }]
            });
        });

    // Gráfico de barras: actividades por momento del día y mes
    fetch('/api/estadisticas/por-momento-mes')
        .then(r => r.json())
        .then(data => {
            Highcharts.chart('grafico-barras', {
                chart: { type: 'column' },
                title: { text: 'Actividades por Momento del Día y Mes' },
                xAxis: { categories: data.labels, title: { text: 'Mes' } },
                yAxis: { min: 0, title: { text: 'Cantidad de Actividades' }, allowDecimals: false },
                plotOptions: { column: { grouping: true } }, // Agrupadas, no apiladas
                series: [
                    { name: 'Mañana', data: data.manana, color: '#36a2eb' },
                    { name: 'Mediodía', data: data.mediodia, color: '#ffce56' },
                    { name: 'Tarde', data: data.tarde, color: '#e67e22' }
                ]
            });
        });
});